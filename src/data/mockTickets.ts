import { CivicIssue } from '../types/civic';

/**
 * Curated initial tickets for Surat (Master demo city)
 * Active tickets: 5 (18, 12, 31, 22, 15) => Total reports = 98
 * Resolved tickets: 1 (9) => Fixed today = 1
 */
export const INITIAL_MOCK_TICKETS: CivicIssue[] = [
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
    reporterName: 'Heer Khunt',
    reporterDeviceHash: 'sha256-a9f872c01e',
    location: { lat: 21.1780, lng: 72.8350, accuracy: 3.8 },
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
    detectedObjects: [{ label: 'Deep Asphalt Cavity', confidence: 0.96, box: [20, 25, 75, 75] }],
    detectedCvTriggers: ['Asphalt cavity', 'Edge depth shadow', 'Circular depression pattern'],
    formalComplaintDraft: 'FORMAL GRIEVANCE // SMC-RD-01\nTo: Executive Engineer (Roads), SMC\nLocation: Ring Road Majura Gate [21.1780, 72.8350]\nDepth > 85mm. Rapid cold-mix patching requested.',
    citizenVoiceTranscript: 'Deep pothole on Ring Road near Majura Gate. Two wheelers are swerving dangerously.'
  },
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
    location: { lat: 21.1920, lng: 72.7950, accuracy: 3.2 },
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
    detectedObjects: [{ label: 'Overflowing Municipal Bin', confidence: 0.95, box: [15, 20, 85, 80] }],
    detectedCvTriggers: ['Bin brim overflow volume > 85%', 'Spill periphery footprint'],
    formalComplaintDraft: 'FORMAL GRIEVANCE // SMC-SW-02\nTo: Zonal Sanitation Superintendent, West Zone\nLocation: Adajan Patia [21.1920, 72.7950]\nOverflow > 90%. Compactor truck dispatch requested.',
    citizenVoiceTranscript: 'The green waste bin at Adajan market is overflowing onto the road.'
  },
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
    location: { lat: 21.2150, lng: 72.8450, accuracy: 5.0 },
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
    detectedObjects: [{ label: 'Toxic Chemical Froth', confidence: 0.98, box: [25, 10, 70, 90] }],
    detectedCvTriggers: ['Chromatic water discoloration', 'Chemical lather/froth', 'Effluent outfall'],
    formalComplaintDraft: 'STATUTORY ESCALATION // GPCB-WB-02\nTo: Regional Environmental Officer\nLocation: Tapi Riverfront Causeway [21.2150, 72.8450]\nStatus: SLA EXCEEDED. Immediate sample collection and outfall plug required.',
    citizenVoiceTranscript: 'Chemical foam and dark wastewater spilling into Tapi river near Causeway.'
  },
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
    reporterName: 'Heer Khunt',
    reporterDeviceHash: 'sha256-004318deaa',
    location: { lat: 21.1540, lng: 72.7750, accuracy: 2.5 },
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
    detectedObjects: [{ label: 'Missing Manhole Cover', confidence: 0.97, box: [30, 30, 75, 75] }],
    detectedCvTriggers: ['Open circular aperture', 'Exposed sewer flow', 'Missing chamber cover'],
    formalComplaintDraft: 'EMERGENCY DISPATCH // DRAIN-RD-03\nTo: Superintending Engineer (Drainage), SMC\nLocation: Vesu Canal Road [21.1540, 72.7750]\n600mm open drainage aperture on active pedestrian walkway.',
    citizenVoiceTranscript: 'The manhole cover is completely broken on Vesu canal road sidewalk.'
  },
  {
    id: 'TKT-SRT-5590',
    taxonomyId: 'PA-01',
    category: 'Civic Assets',
    subCategory: 'Fallen Tree / Roadway Obstruction',
    vertical: 'CIVIC_ASSETS',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    slaHours: 6,
    slaDeadline: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    reporterId: 'usr-339',
    reporterName: 'Rohit Kulkarni',
    reporterDeviceHash: 'sha256-99381ea55',
    location: { lat: 21.1750, lng: 72.8150, accuracy: 3.1 },
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
    detectedObjects: [{ label: 'Uprooted Trunk Obstruction', confidence: 0.94, box: [20, 15, 80, 85] }],
    detectedCvTriggers: ['Tree trunk horizontal carriage obstruction', 'Green foliage canopy fall'],
    formalComplaintDraft: 'EMERGENCY DISPATCH // HORT-PA-01\nTo: Superintendent of Parks\nLocation: Athwa Lines [21.1750, 72.8150]\nCarriageway blocked by fallen trunk.',
    citizenVoiceTranscript: 'Large tree branch fell on the main road at Athwa lines.'
  },
  {
    id: 'TKT-SRT-4401',
    taxonomyId: 'RD-01',
    category: 'Roads & Mobility',
    subCategory: 'Asphalt Road Pothole Remediation',
    vertical: 'ROADS_MOBILITY',
    status: 'VERIFIED_RESOLVED',
    priority: 'HIGH',
    slaHours: 24,
    slaDeadline: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    reporterId: 'usr-901',
    reporterName: 'Manish Patel',
    reporterDeviceHash: 'sha256-srt440',
    location: { lat: 21.1820, lng: 72.8280, accuracy: 3.0 },
    address: 'Ring Road Flyover Access Ramp, Surat',
    upvoteCount: 9,
    upvotedBy: ['usr-901', 'usr-902'],
    assignedDepartment: 'Surat Municipal Corporation (PWD)',
    l2EscalationRole: 'Executive Engineer (Roads)',
    geofenceZone: 'Surat Central Ring Road Zone',
    isEscalated: false,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    imageAfterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 0.96,
    detectedObjects: [{ label: 'Repaired Asphalt Layer', confidence: 0.98, box: [20, 20, 80, 80] }],
    detectedCvTriggers: ['Smooth cold-mix bitumen surface', 'Level road grading'],
    formalComplaintDraft: 'RESOLVED DISPATCH // SMC-RD-01\nPothole patched and surface restored.',
    citizenVoiceTranscript: 'Pothole on flyover ramp has been filled and smoothed.'
  }
];

// Hyper-local street areas for major Indian cities
const CITY_AREAS: { [city: string]: string[] } = {
  Ahmedabad: [
    'SG Highway, Near Iscon Cross Roads, Ahmedabad',
    'Sabarmati Riverfront Promenade, Paldi Sector, Ahmedabad',
    'CG Road, Near Navrangpura Bus Stand, Ahmedabad',
    'Vastrapur Lake Outer Circle, Ahmedabad',
    'Maninagar Railway Station Road, Ahmedabad',
    'Bopal Main Road, Near South Bopal Junction, Ahmedabad',
    'Science City Road, Sola Sector, Ahmedabad',
    'Ashram Road, Near Vadaj Circle, Ahmedabad'
  ],
  Vadodara: [
    'Alkapuri Main Avenue, Near Railway Station, Vadodara',
    'Sayaji Baug Gate 2, Kala Ghoda Circle, Vadodara',
    'Old Padra Road, Near Akota Bridge, Vadodara',
    'Manjalpur Main Market Road, Vadodara',
    'Fatehgunj University Circle, Vadodara',
    'Waghodia Road, Near Parul University Junction, Vadodara'
  ],
  Rajkot: [
    'Yagnik Road, Near Jagnath Plot, Rajkot',
    'Kalawad Road, Near KKV Hall Flyover, Rajkot',
    '150 Feet Ring Road, Near Mahila College Chowk, Rajkot',
    'Race Course Ring Road, Near Airport Gate, Rajkot',
    'Kothariya Main Road, Sector 4, Rajkot',
    'University Road, Near Saurashtra University, Rajkot'
  ],
  Nadiad: [
    'Santram Mandir Road, Station Area, Nadiad',
    'College Road, Near DDU Campus, Nadiad',
    'Mission Road & Petlad Highway Junction, Nadiad',
    'Dumas Road Junction, Near City Point, Nadiad'
  ],
  Gandhinagar: [
    'CH Road, Near Sector 11 Secretariat, Gandhinagar',
    'Gh-5 Circle, Sector 21 Shopping Centre, Gandhinagar',
    'Kudasan Main Road, Near PDPU Bridge, Gandhinagar',
    'Infocity Main Gate, Sector 0, Gandhinagar',
    'Sector 7 Bus Terminal Corridor, Gandhinagar'
  ],
  Bhavnagar: [
    'Waghawadi Road, Near Victoria Park Gate, Bhavnagar',
    'Crescent Circle & Station Road, Bhavnagar',
    'Ghogha Circle, Near City Hospital, Bhavnagar',
    'Kalanala Main Bazaar Corridor, Bhavnagar'
  ],
  Jamnagar: [
    'Lakhota Lake Promenade, Near Khambhalia Gate, Jamnagar',
    'Patel Colony Main Road, Sector 3, Jamnagar',
    'Digjam Circle & Aerodrome Road, Jamnagar',
    'Gurudwara Road, Near Town Hall, Jamnagar'
  ],
  Junagadh: [
    'Zanzarda Road, Near Platinum Complex, Junagadh',
    'Moti Baug Road, Near Agricultural University, Junagadh',
    'Girnar Taleti Road, Bhavnath Sector, Junagadh',
    'Station Road, Near Circle Chowk, Junagadh'
  ],
  Anand: [
    'Amul Dairy Road, Near Anand Junction, Anand',
    'VV Nagar Main Road, Near Sardar Patel Statue, Anand',
    'Bhai Kaka Nagar, Sector 2, Anand',
    'Ganesh Chokdi & Borsad Highway, Anand'
  ],
  Navsari: [
    'Dudhhiya Talav Promenade, Station Road, Navsari',
    'Lunsikui Ground Road, Near City Bus Stand, Navsari',
    'Sayaji Road, Near Tower Clock, Navsari',
    'Mahuva Road Junction, Sector 1, Navsari'
  ],
  Valsad: [
    'Tithal Beach Road, Near Circuit House, Valsad',
    'Stadium Road, Near Railway Colony, Valsad',
    'Dharampur Road, Near Civil Hospital, Valsad',
    'Halar Road, Station Area, Valsad'
  ],
  Bharuch: [
    'Zadeshwar Road, Near Golden Bridge, Bharuch',
    'Station Road, Near Shaktinagar Society, Bharuch',
    'Link Road, Near ABC Circle, Bharuch',
    'Bholav GIDC Main Road, Bharuch'
  ],
  Mehsana: [
    'Radhanpur Road, Near Modhera Cross Road, Mehsana',
    'Dairy Road, Near Dudhsagar Dairy, Mehsana',
    'Nagaland Colony & Highway Corridor, Mehsana',
    'Town Hall Road, Mehsana'
  ],
  Morbi: [
    'Sanala Road, Near New Bus Stand, Morbi',
    'Lakhdhirpur Road, Ceramic Zone Gate 1, Morbi',
    'Kandla Highway Bypass Junction, Morbi',
    'Ravapar Road, Near Shakti Plot, Morbi'
  ],
  Mumbai: [
    'SV Road, Near Bandra Station West, Mumbai',
    'Andheri Kurla Road, Near Chakala Metro, Mumbai',
    'Eastern Express Highway, Near Chembur Naka, Mumbai',
    'Link Road, Near Infinity Mall, Malad West, Mumbai',
    'Marine Drive Promenade, Nariman Point, Mumbai',
    'LBS Marg, Near Ghatkopar West, Mumbai',
    'Sion Circle Flyover Descent, Mumbai',
    'Dadar TT Circle, Dr. Ambedkar Road, Mumbai',
    'Borivali West, Near Shimpoli Signal, Mumbai',
    'Vashi Sector 17 Main Market, Navi Mumbai'
  ],
  Pune: [
    'JM Road, Near Deccan Gymkhana, Shivajinagar, Pune',
    'FC Road, Near Goodluck Chowk, Pune',
    'Baner Road, Near Balewadi High Street, Pune',
    'Koregaon Park North Main Road, Pune',
    'Hinjawadi Phase 1, Near Wipro Circle, Pune',
    'Viman Nagar Main Avenue, Near Phoenix Mall, Pune',
    'Hadapsar Magarpatta City Gate 1, Pune'
  ],
  'Delhi NCR': [
    'Connaught Place Outer Circle, Near M-Block, New Delhi',
    'Ring Road Near Lodhi Road Flyover, New Delhi',
    'Vikas Marg, Near Laxmi Nagar Metro, East Delhi',
    'MG Road, Near Cyber City Phase 2, Gurugram',
    'Golf Course Extension Road, Sector 56, Gurugram',
    'Noida Sector 18 Market Avenue, Noida',
    'Noida Expressway, Near Sector 62, Noida',
    'Outer Ring Road, Near Nehru Place Flyover, New Delhi',
    'Rohini Sector 13 Main Chowk, North Delhi',
    'Dwarka Sector 10 Main Market, New Delhi'
  ],
  Bengaluru: [
    '100 Feet Road, Near 12th Main Junction, Indiranagar, Bengaluru',
    'Outer Ring Road, Near Bellandur EcoSpace, Bengaluru',
    'MG Road, Near Brigade Road Junction, Bengaluru',
    'Koramangala 5th Block, Near Jyoti Nivas College, Bengaluru',
    'Whitefield Main Road, Near ITPL Gate 2, Bengaluru',
    'Bannerghatta Road, Near Jayadeva Hospital Flyover, Bengaluru',
    'Hebbal Flyover Junction, Outer Ring Road, Bengaluru',
    'HSR Layout Sector 1, 27th Main Road, Bengaluru'
  ],
  Jaipur: [
    'MI Road, Near Ajmeri Gate, Jaipur',
    'Tonk Road, Near Rambagh Circle, Jaipur',
    'JL N Marg, Near World Trade Park, Malviya Nagar, Jaipur',
    'Vaishali Nagar Main Market Road, Jaipur',
    'Raja Park Main Commercial Street, Jaipur',
    'Ajmer Road Flyover Junction, Jaipur'
  ],
  Indore: [
    'AB Road, Near Palasia Square, Indore',
    'MG Road, Near Chhappan Dukan, Indore',
    'Vijay Nagar Square, Near C21 Mall, Indore',
    'Bhawarkua Main Junction, Indore',
    'Rajwada Chowk, Near Sarafa Bazaar, Indore',
    'Super Corridor, Sector 3, Indore'
  ],
  Hyderabad: [
    'Hitec City Main Road, Near Cyber Towers, Hyderabad',
    'Gachibowli Flyover Junction, Near ORR, Hyderabad',
    'Banjara Hills Road No 12, Hyderabad',
    'Jubilee Hills Check Post Circle, Hyderabad',
    'Necklace Road Promenade, Hussain Sagar, Hyderabad',
    'Kukatpally Housing Board Main Road, Hyderabad',
    'Madhapur 100 Feet Road, Hyderabad'
  ],
  Chennai: [
    'Anna Salai, Near Thousand Lights, Chennai',
    'OMR IT Corridor, Near Tidel Park, Tharamani, Chennai',
    'Pondy Bazaar Main Pedestrian Plaza, T. Nagar, Chennai',
    'Besant Nagar Beach Road, Near 6th Avenue, Chennai',
    'Velachery Main Road, Near Vijayanagar Bus Terminus, Chennai',
    'GST Road, Near Guindy Kathipara Flyover, Chennai'
  ],
  Kolkata: [
    'Park Street, Near Camac Street Crossing, Kolkata',
    'EM Bypass, Near Ruby General Hospital, Kolkata',
    'Salt Lake Sector V, Near College More, Kolkata',
    'Gariahat Commercial Junction, South Kolkata',
    'New Town Major Arterial Road, Action Area 1, Kolkata',
    'Shyambazar Five Point Crossing, North Kolkata',
    'Strand Road, Near Babughat, Kolkata'
  ]
};

/**
 * Hash function to get deterministic yet varied seed from string
 */
function getCitySeed(cityName: string): number {
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = (hash * 31 + cityName.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

// Preset configuration definitions per city for guaranteed distinct, realistic numbers
interface CityConfig {
  activeCount: number;
  fixedCount: number;
  upvotesList: number[];
}

const CITY_SPECIFIC_PRESETS: { [cityLower: string]: CityConfig } = {
  ahmedabad: {
    activeCount: 6,
    fixedCount: 2,
    upvotesList: [24, 38, 19, 45, 16, 29, 12, 15] // Total active reports = 171
  },
  vadodara: {
    activeCount: 4,
    fixedCount: 2,
    upvotesList: [21, 35, 17, 28, 11, 14] // Total active reports = 101
  },
  rajkot: {
    activeCount: 5,
    fixedCount: 1,
    upvotesList: [14, 27, 33, 19, 23, 10] // Total active reports = 116
  },
  nadiad: {
    activeCount: 3,
    fixedCount: 1,
    upvotesList: [16, 25, 12, 8] // Total active reports = 53
  },
  gandhinagar: {
    activeCount: 4,
    fixedCount: 1,
    upvotesList: [15, 22, 18, 31, 9] // Total active reports = 86
  },
  bhavnagar: {
    activeCount: 3,
    fixedCount: 1,
    upvotesList: [19, 28, 14, 7] // Total active reports = 61
  },
  jamnagar: {
    activeCount: 4,
    fixedCount: 1,
    upvotesList: [12, 26, 34, 18, 8] // Total active reports = 90
  },
  junagadh: {
    activeCount: 3,
    fixedCount: 1,
    upvotesList: [14, 21, 17, 6] // Total active reports = 52
  },
  anand: {
    activeCount: 3,
    fixedCount: 1,
    upvotesList: [11, 29, 15, 7] // Total active reports = 55
  },
  navsari: {
    activeCount: 3,
    fixedCount: 1,
    upvotesList: [13, 24, 18, 8] // Total active reports = 55
  },
  valsad: {
    activeCount: 3,
    fixedCount: 1,
    upvotesList: [16, 22, 19, 9] // Total active reports = 57
  },
  bharuch: {
    activeCount: 4,
    fixedCount: 1,
    upvotesList: [20, 31, 15, 27, 10] // Total active reports = 93
  },
  mehsana: {
    activeCount: 3,
    fixedCount: 1,
    upvotesList: [12, 18, 24, 7] // Total active reports = 54
  },
  morbi: {
    activeCount: 4,
    fixedCount: 1,
    upvotesList: [22, 36, 19, 25, 8] // Total active reports = 102
  },
  mumbai: {
    activeCount: 7,
    fixedCount: 3,
    upvotesList: [42, 35, 58, 29, 44, 31, 26, 18, 21, 15] // Total active reports = 265
  },
  pune: {
    activeCount: 5,
    fixedCount: 2,
    upvotesList: [28, 34, 19, 41, 23, 14, 16] // Total active reports = 145
  },
  'delhi ncr': {
    activeCount: 7,
    fixedCount: 3,
    upvotesList: [39, 48, 27, 52, 33, 41, 25, 16, 19, 22] // Total active reports = 265
  },
  delhi: {
    activeCount: 7,
    fixedCount: 3,
    upvotesList: [39, 48, 27, 52, 33, 41, 25, 16, 19, 22]
  },
  bengaluru: {
    activeCount: 6,
    fixedCount: 2,
    upvotesList: [36, 45, 28, 51, 32, 22, 15, 17] // Total active reports = 214
  },
  jaipur: {
    activeCount: 5,
    fixedCount: 2,
    upvotesList: [25, 33, 18, 29, 21, 11, 13] // Total active reports = 126
  },
  indore: {
    activeCount: 4,
    fixedCount: 2,
    upvotesList: [27, 39, 21, 33, 12, 14] // Total active reports = 120
  },
  hyderabad: {
    activeCount: 6,
    fixedCount: 2,
    upvotesList: [33, 47, 26, 38, 29, 41, 14, 18] // Total active reports = 214
  },
  chennai: {
    activeCount: 5,
    fixedCount: 2,
    upvotesList: [31, 42, 25, 36, 28, 13, 15] // Total active reports = 162
  },
  kolkata: {
    activeCount: 6,
    fixedCount: 2,
    upvotesList: [29, 44, 35, 22, 38, 27, 12, 16] // Total active reports = 195
  }
};

/**
 * Returns localized, realistic civic issues for any selected city.
 * Every city gets unique issue counts, unique report sums, and distinct active/fixed values.
 */
export function getTicketsForCity(cityName: string, coords: { lat: number; lng: number }): CivicIssue[] {
  const normCity = (cityName || 'Surat').trim();
  const cityKey = normCity.toLowerCase();

  // If Surat, return curated initial master list
  if (cityKey === 'surat') {
    return INITIAL_MOCK_TICKETS;
  }

  const seed = getCitySeed(normCity);
  const areas = CITY_AREAS[normCity] || [
    `Main Market Road, Near Town Hall, ${normCity}`,
    `Station Road, Near Central Bus Stand, ${normCity}`,
    `Ring Road Highway Junction, ${normCity}`,
    `Gandhi Chowk & Civil Hospital Road, ${normCity}`,
    `Riverfront / Lake Promenade, ${normCity}`,
    `Industrial GIDC Main Entrance Road, ${normCity}`,
    `College Road & University Gate, ${normCity}`,
    `Outer Bypass Corridor, Sector 5, ${normCity}`,
    `Commercial Hub, MG Road, ${normCity}`
  ];

  const cityDept = `${normCity} Municipal Corporation`;

  // Catalog of issue templates
  const issueCatalog: Partial<CivicIssue>[] = [
    {
      taxonomyId: 'RD-01',
      category: 'Roads & Mobility',
      subCategory: 'Potholes (Deep / Hazardous)',
      vertical: 'ROADS_MOBILITY',
      priority: 'URGENT',
      slaHours: 48,
      assignedDepartment: `${cityDept} (PWD / Roads Division)`,
      l2EscalationRole: 'Executive Engineer (Roads)',
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      imageAfterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      aiConfidence: 0.95,
      detectedObjects: [{ label: 'Deep Asphalt Cavity', confidence: 0.96, box: [20, 25, 75, 75] }],
      detectedCvTriggers: ['Asphalt cavity', 'Edge depth shadow', 'Circular depression pattern']
    },
    {
      taxonomyId: 'SW-02',
      category: 'Solid Waste',
      subCategory: 'Overflowing Community Waste Bin',
      vertical: 'SOLID_WASTE',
      priority: 'URGENT',
      slaHours: 6,
      assignedDepartment: `${cityDept} (Health & Solid Waste Management)`,
      l2EscalationRole: 'Zonal Sanitation Superintendent',
      imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
      imageAfterUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      aiConfidence: 0.94,
      detectedObjects: [{ label: 'Overflowing Municipal Bin', confidence: 0.95, box: [15, 20, 85, 80] }],
      detectedCvTriggers: ['Bin brim overflow volume > 85%', 'Spill periphery footprint']
    },
    {
      taxonomyId: 'WB-02',
      category: 'Water Bodies',
      subCategory: 'Industrial Chemical Effluent Discharge',
      vertical: 'WATER_BODIES_ECOLOGY',
      priority: 'CRITICAL',
      slaHours: 12,
      assignedDepartment: `State Pollution Control Board / ${cityDept} Drainage`,
      l2EscalationRole: 'Regional Environmental Officer (PCB)',
      imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
      aiConfidence: 0.97,
      detectedObjects: [{ label: 'Toxic Chemical Froth', confidence: 0.98, box: [25, 10, 70, 90] }],
      detectedCvTriggers: ['Chromatic water discoloration', 'Effluent outfall']
    },
    {
      taxonomyId: 'RD-03',
      category: 'Roads & Mobility',
      subCategory: 'Open / Broken Sewer Manhole',
      vertical: 'ROADS_MOBILITY',
      priority: 'CRITICAL',
      slaHours: 24,
      assignedDepartment: `${cityDept} (Underground Drainage Dept)`,
      l2EscalationRole: 'Superintending Engineer (Drainage)',
      imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
      aiConfidence: 0.98,
      detectedObjects: [{ label: 'Missing Cast Iron Manhole Cover', confidence: 0.99, box: [30, 30, 70, 70] }],
      detectedCvTriggers: ['Exposed vertical shaft drop > 1.2m', 'Perimeter fracture']
    },
    {
      taxonomyId: 'SW-01',
      category: 'Solid Waste',
      subCategory: 'Illegal Roadside Garbage Dump',
      vertical: 'SOLID_WASTE',
      priority: 'HIGH',
      slaHours: 24,
      assignedDepartment: `${cityDept} (Sanitation & Cleanliness)`,
      l2EscalationRole: 'Chief Sanitary Inspector',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      aiConfidence: 0.93,
      detectedObjects: [{ label: 'Garbage Vulnerable Point', confidence: 0.94, box: [10, 20, 90, 80] }],
      detectedCvTriggers: ['Litter footprint', 'Solid waste density']
    },
    {
      taxonomyId: 'PA-01',
      category: 'Civic Assets',
      subCategory: 'Fallen Tree / Roadway Obstruction',
      vertical: 'CIVIC_ASSETS',
      priority: 'HIGH',
      slaHours: 12,
      assignedDepartment: `${cityDept} (Parks & Horticulture Wing)`,
      l2EscalationRole: 'Superintendent of Parks',
      imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
      imageAfterUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      aiConfidence: 0.94,
      detectedObjects: [{ label: 'Uprooted Trunk Obstruction', confidence: 0.95, box: [20, 20, 80, 80] }],
      detectedCvTriggers: ['Carriageway obstacle', 'Foliage blockage']
    },
    {
      taxonomyId: 'RD-05',
      category: 'Roads & Mobility',
      subCategory: 'Stormwater Drain Clogging & Waterlogging',
      vertical: 'WATER_BODIES_ECOLOGY',
      priority: 'HIGH',
      slaHours: 24,
      assignedDepartment: `${cityDept} (Stormwater Drainage)`,
      l2EscalationRole: 'Executive Engineer (Drainage)',
      imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      imageAfterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      aiConfidence: 0.94,
      detectedObjects: [{ label: 'Silt Blocked Catchpit', confidence: 0.95, box: [20, 30, 80, 70] }],
      detectedCvTriggers: ['Standing water pool', 'Debris accumulation']
    }
  ];

  const preset = CITY_SPECIFIC_PRESETS[cityKey];
  const activeCount = preset ? preset.activeCount : 3 + (seed % 5); // 3 to 7 active
  const fixedCount = preset ? preset.fixedCount : 1 + ((seed >> 2) % 2); // 1 to 2 fixed
  const totalCount = activeCount + fixedCount;

  const cityCode = normCity.length >= 3 ? normCity.substring(0, 3).toUpperCase() : 'CTY';

  // Specific spread offsets around city center
  const offsets = [
    { dLat: 0.0078, dLng: 0.0065 },
    { dLat: -0.0088, dLng: -0.0079 },
    { dLat: 0.0135, dLng: -0.0058 },
    { dLat: -0.0065, dLng: 0.0098 },
    { dLat: 0.0098, dLng: -0.0105 },
    { dLat: -0.0125, dLng: 0.0048 },
    { dLat: 0.0048, dLng: 0.0145 },
    { dLat: -0.0148, dLng: -0.0035 },
    { dLat: 0.0112, dLng: 0.0118 },
    { dLat: -0.0105, dLng: -0.0122 }
  ];

  const cityIssues: CivicIssue[] = [];

  for (let i = 0; i < totalCount; i++) {
    const isResolved = i >= activeCount;
    const templateIndex = (seed + i) % issueCatalog.length;
    const t = issueCatalog[templateIndex];
    const offset = offsets[i % offsets.length];
    const area = areas[i % areas.length];
    const ticketId = `TKT-${cityCode}-${7100 + i * 137 + (seed % 89)}`;

    // Determine upvotes
    let upvotes: number;
    if (preset && preset.upvotesList && i < preset.upvotesList.length) {
      upvotes = preset.upvotesList[i];
    } else {
      upvotes = isResolved ? (6 + (seed + i) % 11) : (12 + ((seed * (i + 3) + i * 17) % 41));
    }

    const status = isResolved
      ? 'VERIFIED_RESOLVED'
      : i === 0
      ? 'IN_PROGRESS'
      : i === 1
      ? 'WORK_SUBMITTED'
      : i === 2
      ? 'ESCALATED_SLA_BREACH'
      : 'IN_PROGRESS';

    cityIssues.push({
      id: ticketId,
      taxonomyId: t.taxonomyId || 'RD-01',
      category: t.category || 'Roads & Mobility',
      subCategory: t.subCategory || 'Civic Issue',
      vertical: t.vertical || 'ROADS_MOBILITY',
      status: status,
      priority: isResolved ? 'NORMAL' : t.priority || 'HIGH',
      slaHours: t.slaHours || 24,
      slaDeadline: isResolved
        ? new Date(Date.now() - 12 * 3600 * 1000).toISOString()
        : new Date(Date.now() + (t.slaHours || 24) * 3600 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - (i + 1) * 4 * 3600 * 1000).toISOString(),
      lastUpdatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      resolvedAt: isResolved ? new Date(Date.now() - 4 * 3600 * 1000).toISOString() : undefined,
      reporterId: i === 0 ? 'usr-current' : `usr-${cityCode.toLowerCase()}-${i + 1}`,
      reporterName: i === 0 ? 'Heer Khunt (You)' : `Citizen ${normCity} #${i + 1}`,
      reporterDeviceHash: `sha256-${cityCode.toLowerCase()}-${i}`,
      location: {
        lat: coords.lat + offset.dLat,
        lng: coords.lng + offset.dLng,
        accuracy: 3.5
      },
      address: area,
      upvoteCount: upvotes,
      upvotedBy: i === 0 ? ['usr-current'] : [],
      assignedDepartment: t.assignedDepartment || `${cityDept}`,
      l2EscalationRole: t.l2EscalationRole || 'Zonal Officer',
      geofenceZone: `${normCity} Municipal Ward ${i + 1}`,
      isEscalated: status === 'ESCALATED_SLA_BREACH',
      imageUrl: t.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      imageAfterUrl: isResolved ? (t.imageAfterUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80') : null,
      aiConfidence: t.aiConfidence || 0.94,
      detectedObjects: t.detectedObjects || [],
      detectedCvTriggers: t.detectedCvTriggers || [],
      formalComplaintDraft: `FORMAL GRIEVANCE // ${ticketId}\nTo: ${t.l2EscalationRole}, ${cityDept}\nLocation: ${area}\nImmediate remediation requested.`,
      citizenVoiceTranscript: `Reported civic defect near ${area}.`
    } as CivicIssue);
  }

  return cityIssues;
}

// Master Pre-Populated Database across major cities so all location reports are loaded instantly
const AHMEDABAD_PRESET = getTicketsForCity('Ahmedabad', { lat: 23.0225, lng: 72.5714 });
const VADODARA_PRESET = getTicketsForCity('Vadodara', { lat: 22.3072, lng: 73.1812 });
const RAJKOT_PRESET = getTicketsForCity('Rajkot', { lat: 22.3039, lng: 70.8022 });
const NADIAD_PRESET = getTicketsForCity('Nadiad', { lat: 22.6916, lng: 72.8634 });
const GANDHINAGAR_PRESET = getTicketsForCity('Gandhinagar', { lat: 23.2156, lng: 72.6369 });
const MUMBAI_PRESET = getTicketsForCity('Mumbai', { lat: 19.0760, lng: 72.8777 });
const PUNE_PRESET = getTicketsForCity('Pune', { lat: 18.5204, lng: 73.8567 });
const DELHI_PRESET = getTicketsForCity('Delhi NCR', { lat: 28.6139, lng: 77.2090 });
const BENGALURU_PRESET = getTicketsForCity('Bengaluru', { lat: 12.9716, lng: 77.5946 });

export const ALL_LOCATIONS_INITIAL_TICKETS: CivicIssue[] = [
  ...INITIAL_MOCK_TICKETS, // Surat tickets (5 active + 1 resolved = 98 reports)
  ...AHMEDABAD_PRESET,     // Ahmedabad (6 active + 2 resolved = 171 reports)
  ...VADODARA_PRESET,      // Vadodara (4 active + 2 resolved = 101 reports)
  ...RAJKOT_PRESET,        // Rajkot (5 active + 1 resolved = 116 reports)
  ...NADIAD_PRESET,        // Nadiad (3 active + 1 resolved = 53 reports)
  ...GANDHINAGAR_PRESET,   // Gandhinagar (4 active + 1 resolved = 86 reports)
  ...MUMBAI_PRESET,        // Mumbai (7 active + 3 resolved = 265 reports)
  ...PUNE_PRESET,          // Pune (5 active + 2 resolved = 145 reports)
  ...DELHI_PRESET,         // Delhi NCR (7 active + 3 resolved = 265 reports)
  ...BENGALURU_PRESET      // Bengaluru (6 active + 2 resolved = 214 reports)
];
