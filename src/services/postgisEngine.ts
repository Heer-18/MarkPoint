import { CivicIssue, DeduplicationMatch, GeofencePolygon, SpatialCoordinate } from '../types/civic';
import { CITY_GEOFENCES } from '../data/geofences';

/**
 * Calculates geodesic distance between two points in meters using Haversine formula
 * (Matches PostGIS ST_Distance(geography, geography) behavior)
 */
export function calculateDistanceMeters(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
    Math.cos((coord2.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * PostGIS ST_DWithin(25 meters) Spatial Deduplication Engine
 * Checks if an active ticket in the same category exists within 25 meters.
 */
export function checkSpatialDeduplication(
  newCoord: SpatialCoordinate,
  taxonomyId: string,
  existingTickets: CivicIssue[],
  reporterId: string = 'usr-current'
): DeduplicationMatch {
  const ACTIVE_STATUSES = ['PENDING_INTERNAL', 'IN_REVIEW', 'IN_PROGRESS', 'WORK_SUBMITTED', 'ESCALATED_SLA_BREACH'];
  
  // Find closest active ticket in same taxonomy/category
  let closestTicket: CivicIssue | null = null;
  let minDistance = Infinity;

  for (const ticket of existingTickets) {
    if (!ACTIVE_STATUSES.includes(ticket.status)) continue;
    
    // Check taxonomy / category match or vertical match
    const categoryMatches = ticket.taxonomyId === taxonomyId || ticket.vertical === getVerticalFromTaxonomy(taxonomyId);
    
    if (categoryMatches) {
      const dist = calculateDistanceMeters(newCoord, ticket.location);
      if (dist < minDistance) {
        minDistance = dist;
        closestTicket = ticket;
      }
    }
  }

  // 25 meters threshold (ST_DWithin 25)
  if (closestTicket && minDistance <= 25) {
    return {
      isDuplicate: true,
      masterTicket: closestTicket,
      distanceMeters: Math.round(minDistance * 10) / 10,
      upvoteCountAfterMatch: closestTicket.upvoteCount + 1,
      message: `Spatial duplicate detected within ${Math.round(minDistance)}m! Aggregated into Master Ticket ${closestTicket.id}. Upvote count increased to ${closestTicket.upvoteCount + 1}.`
    };
  }

  return {
    isDuplicate: false,
    distanceMeters: minDistance === Infinity ? 0 : Math.round(minDistance * 10) / 10,
    upvoteCountAfterMatch: 1,
    message: 'No spatial duplicate within 25m. New master ticket generated.'
  };
}

/**
 * Helper to get vertical from taxonomy ID
 */
function getVerticalFromTaxonomy(taxonomyId: string): string {
  if (taxonomyId.startsWith('RD')) return 'ROADS_MOBILITY';
  if (taxonomyId.startsWith('SW')) return 'SOLID_WASTE';
  if (taxonomyId.startsWith('WB')) return 'WATER_BODIES_ECOLOGY';
  if (taxonomyId.startsWith('UT')) return 'PUBLIC_UTILITIES';
  if (taxonomyId.startsWith('PA')) return 'CIVIC_ASSETS';
  return 'ROADS_MOBILITY';
}

/**
 * Point in Polygon (Ray-Casting Algorithm) for PostGIS ST_Contains simulation
 */
export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [lat, lng] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Identifies the responsible geofenced authority for given coordinates
 */
export function getGeofenceZoneForLocation(
  coord: SpatialCoordinate,
  geofences: GeofencePolygon[] = CITY_GEOFENCES
): { zoneName: string; authority: string } {
  const pt: [number, number] = [coord.lat, coord.lng];
  
  for (const zone of geofences) {
    if (isPointInPolygon(pt, zone.coordinates)) {
      return {
        zoneName: zone.name,
        authority: zone.authority
      };
    }
  }

  return {
    zoneName: 'Central Municipal Ward & Colony Grid',
    authority: 'Municipal Corporation (Zonal Office)'
  };
}
