import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Layers, ShieldAlert, Clock, ThumbsUp, Sparkles, Navigation } from 'lucide-react';
import { CivicIssue, GeofencePolygon } from '../../types/civic';
import { CITY_GEOFENCES } from '../../data/geofences';

interface GISMapViewProps {
  tickets: CivicIssue[];
  selectedTicket: CivicIssue | null;
  onSelectTicket: (ticket: CivicIssue) => void;
  onOpenVerification: (ticket: CivicIssue) => void;
}

export const GISMapView: React.FC<GISMapViewProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  onOpenVerification
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const geofencesLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [28.6380, 77.2180],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark styled OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      circlesLayerRef.current = L.layerGroup().addTo(map);
      geofencesLayerRef.current = L.layerGroup().addTo(map);

      // Render Geofence Polygons
      CITY_GEOFENCES.forEach((fence: GeofencePolygon) => {
        const polygon = L.polygon(fence.coordinates, {
          color: fence.color,
          weight: 2,
          fillColor: fence.color,
          fillOpacity: fence.fillOpacity,
          dashArray: '4, 6'
        });

        polygon.bindTooltip(
          `<div class="p-1 font-mono text-[10px] text-slate-200"><strong>${fence.name}</strong><br/>Authority: ${fence.authority}</div>`,
          { sticky: true }
        );

        geofencesLayerRef.current?.addLayer(polygon);
      });
    } catch (err) {
      console.warn('Map initialization:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & 25m Radius Circles
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !circlesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    circlesLayerRef.current.clearLayers();

    tickets.forEach((ticket) => {
      const isResolved = ticket.status === 'VERIFIED_RESOLVED' || ticket.status === 'RESOLVED_DEMO';
      const isBreached = ticket.status === 'ESCALATED_SLA_BREACH';
      const isSelected = selectedTicket?.id === ticket.id;

      // Color by vertical & status
      let markerColor = '#06b6d4'; // cyan default
      if (isResolved) markerColor = '#10b981'; // emerald
      else if (isBreached) markerColor = '#ef4444'; // rose
      else if (ticket.vertical === 'SOLID_WASTE') markerColor = '#f59e0b'; // amber
      else if (ticket.vertical === 'WATER_BODIES_ECOLOGY') markerColor = '#3b82f6'; // blue
      else if (ticket.vertical === 'ROADS_MOBILITY') markerColor = '#f97316'; // orange

      // 1. Draw 25-meter PostGIS Deduplication Buffer Circle for active tickets
      if (!isResolved) {
        const circle = L.circle([ticket.location.lat, ticket.location.lng], {
          radius: 25, // 25 meters radius
          color: markerColor,
          weight: 1.5,
          fillColor: markerColor,
          fillOpacity: 0.18,
          dashArray: '2, 4'
        });
        circlesLayerRef.current?.addLayer(circle);
      }

      // 2. Custom Pulsing HTML Icon Marker
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2">
            ${!isResolved ? `<span class="absolute w-8 h-8 rounded-full map-marker-pulse" style="background: ${markerColor}40;"></span>` : ''}
            <div class="relative flex items-center justify-center w-7 h-7 rounded-full shadow-xl border-2 text-white font-bold text-[10px]" style="background: ${markerColor}; border-color: ${isSelected ? '#ffffff' : '#0f172a'};">
              ${ticket.upvoteCount > 1 ? ticket.upvoteCount : '•'}
            </div>
          </div>
        `,
        iconSize: [28, 28]
      });

      const marker = L.marker([ticket.location.lat, ticket.location.lng], {
        icon: customIcon
      });

      // Interactive Popup
      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; min-width: 220px; background: #0f172a; color: #f8fafc; padding: 8px; border-radius: 12px; border: 1px solid #334155;">
          <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 2px;">#${ticket.taxonomyId} • ${ticket.subCategory}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">${ticket.address}</div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 8px;">
            <span style="color: #4ade80; font-weight: 600;">👍 ${ticket.upvoteCount} Upvotes</span>
            <span style="color: #fb7185; font-weight: 600;">${ticket.priority}</span>
          </div>
          <button id="inspect-btn-${ticket.id}" style="width: 100%; background: #0284c7; color: white; border: none; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer;">
            Inspect Grievance Details
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`inspect-btn-${ticket.id}`);
        if (btn) {
          btn.onclick = () => onSelectTicket(ticket);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [tickets, selectedTicket, onSelectTicket]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl dark-map">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
