export type IssueVertical = 
  | 'ROADS_MOBILITY'
  | 'SOLID_WASTE'
  | 'WATER_BODIES_ECOLOGY'
  | 'PUBLIC_UTILITIES'
  | 'CIVIC_ASSETS';

export type TicketStatus = 
  | 'PENDING_INTERNAL'
  | 'IN_REVIEW'
  | 'IN_PROGRESS'
  | 'WORK_SUBMITTED'
  | 'RESOLVED_DEMO'
  | 'VERIFIED_RESOLVED'
  | 'ESCALATED_SLA_BREACH'
  | 'REJECTED';

export type SeverityPriority = 'CRITICAL' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface SpatialCoordinate {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number | null;
}

export interface CivicTaxonomyItem {
  id: string; // e.g. 'RD-01', 'SW-02'
  vertical: IssueVertical;
  category: string;
  subCategory: string;
  responsibleDepartment: string;
  l2EscalationRole: string;
  defaultPriority: SeverityPriority;
  slaHours: number;
  cvTriggers: string[];
  description: string;
  suggestedAction: string;
}

export interface CivicIssue {
  id: string;
  taxonomyId: string;
  category: string;
  subCategory: string;
  vertical: IssueVertical;
  status: TicketStatus;
  priority: SeverityPriority;
  slaHours: number;
  slaDeadline: string; // ISO string
  reportedAt: string; // ISO string
  lastUpdatedAt: string; // ISO string
  resolvedAt?: string | null;
  
  // Reporter & Spatial Data
  reporterId: string;
  reporterName: string;
  reporterDeviceHash: string;
  location: SpatialCoordinate;
  address: string;
  upvoteCount: number;
  upvotedBy: string[];
  
  // Department & Routing
  assignedDepartment: string;
  l2EscalationRole: string;
  geofenceZone: string;
  isEscalated: boolean;
  
  // Vision & AI Analysis
  imageUrl: string;
  imageAfterUrl?: string | null;
  aiConfidence: number;
  detectedObjects: {
    label: string;
    confidence: number;
    box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
  }[];
  detectedCvTriggers: string[];
  formalComplaintDraft: string;
  citizenVoiceTranscript?: string;
  
  // Verification Info (No Fake Closures)
  verificationResult?: {
    verified: boolean;
    confidence: number;
    reasoning: string;
    distanceMeters: number;
    diffScore: number;
    verifiedAt: string;
  } | null;
}

export interface GeofencePolygon {
  id: string;
  name: string;
  type: 'NHAI_HIGHWAY' | 'STATE_PWD' | 'MUNICIPAL_ARTERIAL' | 'WARD_COLONY' | 'RIVER_BUFFER' | 'SANITATION_ZONE' | 'PARKS_ZONE';
  color: string;
  fillOpacity: number;
  coordinates: [number, number][]; // [lat, lng] points
  authority: string;
}

export interface DeduplicationMatch {
  isDuplicate: boolean;
  masterTicket?: CivicIssue;
  distanceMeters: number;
  upvoteCountAfterMatch: number;
  message: string;
}

export interface CVAnalysisResult {
  isValid: boolean;
  taxonomyId: string;
  category: string;
  subCategory: string;
  vertical: IssueVertical;
  priority: SeverityPriority;
  slaHours: number;
  confidence: number;
  responsibleDepartment: string;
  l2EscalationRole: string;
  detectedTriggers: string[];
  detectedObjects: {
    label: string;
    confidence: number;
    box?: [number, number, number, number];
  }[];
  formalComplaintDraft: string;
  rejectionReason?: string;
}
