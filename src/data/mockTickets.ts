import { CivicIssue } from '../types/civic';

export const INITIAL_MOCK_TICKETS: CivicIssue[] = [
  // 1. Surat - Roads & Mobility (Pothole)
  {
    id: 'TKT-SRT-8812',
    taxonomyId: 'RD-01',
    category: 'Roads & Mobility',
    subCategory: 'Potholes (Deep / Hazardous)',
    vertical: 'ROADS_MOBILITY',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    slaHours: 48,
    slaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reporterId: 'usr-current',
    reporterName: 'Heer Patel',
    reporterDeviceHash: 'sha256-a9f872c01e',
    location: {
      lat: 21.1780,
      lng: 72.8350,
      accuracy: 3.8
    },
    address: 'Ring Road Flyover Junction, Near Majura Gate, Surat',
    upvoteCount: 18,
    upvotedBy: ['usr-901', 'usr-902', 'usr-905', 'usr-current'],
    assignedDepartment: 'Surat Municipal Corporation (PWD / Roads)',
    l2EscalationRole: 'Executive Engineer (Roads)',
    geofenceZone: 'Surat Central Ring Road Zone',
    isEscalated: false,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    imageAfterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 0.95,
    detectedObjects: [
      { label: 'Deep Asphalt Cavity', confidence: 0.96, box: [20, 25, 75, 75] }
    ],
    detectedCvTriggers: ['Asphalt cavity', 'Edge depth shadow', 'Circular depression pattern'],
    formalComplaintDraft: 'FORMAL GRIEVANCE // SMC-RD-01\nTo: Executive Engineer (Roads), SMC\nLocation: Ring Road Majura Gate [21.1780, 72.8350]\nDepth > 85mm. Rapid cold-mix patching requested.',
    citizenVoiceTranscript: 'Deep pothole on Ring Road near Majura Gate. Two wheelers are swerving dangerously.'
  },

  // 2. Surat - Solid Waste (Overflowing Community Bin)
  {
    id: 'TKT-SRT-9041',
    taxonomyId: 'SW-02',
    category: 'Solid Waste',
    subCategory: 'Overflowing Community Waste Bin',
    vertical: 'SOLID_WASTE',
    status: 'WORK_SUBMITTED',
    priority: 'URGENT',
    slaHours: 6,
    slaDeadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    reporterId: 'usr-842',
    reporterName: 'Priya Shah',
    reporterDeviceHash: 'sha256-c33190ab71',
    location: {
      lat: 21.1920,
      lng: 72.7950,
      accuracy: 3.2
    },
    address: 'Adajan Patia Main Market, Near Star Bazaar, Surat',
    upvoteCount: 12,
    upvotedBy: ['usr-842', 'usr-845', 'usr-850'],
    assignedDepartment: 'SMC Health & Sanitation Division (West Zone)',
    l2EscalationRole: 'Zonal Sanitation Superintendent',
    geofenceZone: 'Adajan West Municipal Ward',
    isEscalated: false,
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    imageAfterUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 0.94,
    detectedObjects: [
      { label: 'Overflowing Municipal Bin', confidence: 0.95, box: [15, 20, 85, 80] }
    ],
    detectedCvTriggers: ['Bin brim overflow volume > 85%', 'Spill periphery footprint'],
    formalComplaintDraft: 'FORMAL GRIEVANCE // SMC-SW-02\nTo: Zonal Sanitation Superintendent, West Zone\nLocation: Adajan Patia [21.1920, 72.7950]\nOverflow > 90%. Compactor truck dispatch requested.',
    citizenVoiceTranscript: 'The green waste bin at Adajan market is overflowing onto the road.'
  },

  // 3. Surat - Water Bodies & Drainage (Clogged Tapi River Drain)
  {
    id: 'TKT-SRT-7734',
    taxonomyId: 'WB-02',
    category: 'Water Bodies',
    subCategory: 'Industrial Chemical Effluent Discharge',
    vertical: 'WATER_BODIES_ECOLOGY',
    status: 'ESCALATED_SLA_BREACH',
    priority: 'CRITICAL',
    slaHours: 12,
    slaDeadline: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    reporterId: 'usr-412',
    reporterName: 'Vikram Desai',
    reporterDeviceHash: 'sha256-fa70195e2d',
    location: {
      lat: 21.2150,
      lng: 72.8450,
      accuracy: 5.0
    },
    address: 'Tapi Riverfront Promenade, Near Causeway, Surat',
    upvoteCount: 31,
    upvotedBy: ['usr-412', 'usr-415', 'usr-420', 'usr-431'],
    assignedDepartment: 'Gujarat Pollution Control Board (GPCB) / SMC Drainage',
    l2EscalationRole: 'Regional Environmental Officer (GPCB)',
    geofenceZone: 'Tapi River Eco-Buffer Zone',
    isEscalated: true,
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    imageAfterUrl: null,
    aiConfidence: 0.97,
    detectedObjects: [
      { label: 'Toxic Chemical Froth', confidence: 0.98, box: [25, 10, 70, 90] }
    ],
    detectedCvTriggers: ['Chromatic water discoloration', 'Chemical lather/froth', 'Effluent outfall'],
    formalComplaintDraft: 'STATUTORY ESCALATION // GPCB-WB-02\nTo: Regional Environmental Officer\nLocation: Tapi Riverfront Causeway [21.2150, 72.8450]\nStatus: SLA EXCEEDED. Immediate sample collection and outfall plug required.',
    citizenVoiceTranscript: 'Chemical foam and dark wastewater spilling into Tapi river near Causeway.'
  },

  // 4. Surat - Public Utilities (Open Manhole on Walkway)
  {
    id: 'TKT-SRT-6102',
    taxonomyId: 'RD-03',
    category: 'Roads & Mobility',
    subCategory: 'Open / Broken Manhole',
    vertical: 'ROADS_MOBILITY',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    slaHours: 6,
    slaDeadline: new Date(Date.now() + 1.5 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reporterId: 'usr-current',
    reporterName: 'Heer Patel',
    reporterDeviceHash: 'sha256-004318deaa',
    location: {
      lat: 21.1540,
      lng: 72.7750,
      accuracy: 2.5
    },
    address: 'Vesu Canal Road, Opposite University Campus, Surat',
    upvoteCount: 22,
    upvotedBy: ['usr-118', 'usr-120', 'usr-current'],
    assignedDepartment: 'SMC Drainage & Sewerage Operations Cell',
    l2EscalationRole: 'Superintending Engineer (Drainage)',
    geofenceZone: 'Vesu South-West Ward Grid',
    isEscalated: false,
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    imageAfterUrl: null,
    aiConfidence: 0.96,
    detectedObjects: [
      { label: 'Missing Manhole Cover', confidence: 0.97, box: [30, 30, 75, 75] }
    ],
    detectedCvTriggers: ['Open circular aperture', 'Exposed sewer flow', 'Missing chamber cover'],
    formalComplaintDraft: 'EMERGENCY DISPATCH // DRAIN-RD-03\nTo: Superintending Engineer (Drainage), SMC\nLocation: Vesu Canal Road [21.1540, 72.7750]\n600mm open drainage aperture on active pedestrian walkway.',
    citizenVoiceTranscript: 'The manhole cover is completely broken on Vesu canal road sidewalk.'
  },

  // 5. Surat - Civic Assets (Fallen Tree Hazard - Resolved)
  {
    id: 'TKT-SRT-5590',
    taxonomyId: 'PA-01',
    category: 'Civic Assets',
    subCategory: 'Fallen Tree / Roadway Obstruction',
    vertical: 'CIVIC_ASSETS',
    status: 'VERIFIED_RESOLVED',
    priority: 'URGENT',
    slaHours: 6,
    slaDeadline: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    reporterId: 'usr-339',
    reporterName: 'Rohit Kulkarni',
    reporterDeviceHash: 'sha256-99381ea55',
    location: {
      lat: 21.1750,
      lng: 72.8150,
      accuracy: 3.1
    },
    address: 'Athwa Lines Main Road, Near Chowpatty, Surat',
    upvoteCount: 15,
    upvotedBy: ['usr-339', 'usr-342'],
    assignedDepartment: 'SMC Parks & Horticulture Wing / Fire Brigade',
    l2EscalationRole: 'Superintendent of Parks',
    geofenceZone: 'Athwa Zonal Ward Grid',
    isEscalated: false,
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
    imageAfterUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 0.93,
    detectedObjects: [
      { label: 'Uprooted Trunk Obstruction', confidence: 0.94, box: [20, 15, 80, 85] }
    ],
    detectedCvTriggers: ['Tree trunk horizontal carriage obstruction', 'Green foliage canopy fall'],
    formalComplaintDraft: 'RESOLVED DISPATCH // HORT-PA-01\nTo: Superintendent of Parks\nLocation: Athwa Lines [21.1750, 72.8150]\nObstruction cleared and carriageway reopened.',
    citizenVoiceTranscript: 'Large tree branch fell on the main road at Athwa lines.',
    verificationResult: {
      verified: true,
      confidence: 0.94,
      reasoning: 'AI Computer Vision Diff verified complete clearing of tree trunk, restore of unobstructed asphalt road surface.',
      distanceMeters: 3.4,
      diffScore: 0.92,
      verifiedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString()
    }
  },

  // 6. Surat - Streetlight Outage (Public Utilities)
  {
    id: 'TKT-SRT-4419',
    taxonomyId: 'RD-04',
    category: 'Roads & Mobility',
    subCategory: 'Streetlight Outage / Dark Spot',
    vertical: 'PUBLIC_UTILITIES',
    status: 'PENDING_INTERNAL',
    priority: 'HIGH',
    slaHours: 24,
    slaDeadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reporterId: 'usr-604',
    reporterName: 'Sunita Patel',
    reporterDeviceHash: 'sha256-887102ccaa',
    location: {
      lat: 21.2180,
      lng: 72.8650,
      accuracy: 4.0
    },
    address: 'Varachha Main Road, Near Diamond Market, Surat',
    upvoteCount: 7,
    upvotedBy: ['usr-604', 'usr-608'],
    assignedDepartment: 'DGVCL / SMC Electrical Division',
    l2EscalationRole: 'Assistant Engineer (Electrical)',
    geofenceZone: 'Varachha East Zone',
    isEscalated: false,
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    imageAfterUrl: null,
    aiConfidence: 0.91,
    detectedObjects: [
      { label: 'Non-functional Streetlight Pole', confidence: 0.92, box: [20, 20, 80, 80] }
    ],
    detectedCvTriggers: ['Street pole asset tag match', 'Dark spot telemetry'],
    formalComplaintDraft: 'FORMAL GRIEVANCE // ELEC-RD-04\nTo: Assistant Engineer (Electrical)\nLocation: Varachha Diamond Market [21.2180, 72.8650]\n3 consecutive LED poles non-functional at night.',
    citizenVoiceTranscript: 'Streetlights on Varachha main road are completely off at night.'
  }
];
