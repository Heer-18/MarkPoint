import { CivicTaxonomyItem } from '../types/civic';

export const CIVIC_TAXONOMY: CivicTaxonomyItem[] = [
  // 1. Roads, Transit & Pedestrian Infrastructure
  {
    id: 'RD-01',
    vertical: 'ROADS_MOBILITY',
    category: 'Roads & Mobility',
    subCategory: 'Potholes (Deep / Hazardous)',
    responsibleDepartment: 'Public Works Department (PWD) / Municipal Roads Division',
    l2EscalationRole: 'Executive Engineer (Roads)',
    defaultPriority: 'URGENT',
    slaHours: 48,
    cvTriggers: ['Asphalt cavity', 'Edge depth shadow', 'Circular depression pattern', 'Exposed aggregate base'],
    description: 'Deep road cavity presenting imminent vehicular axle or two-wheeler skidding hazard.',
    suggestedAction: 'Deploy rapid cold-mix / mastic asphalt patching unit.'
  },
  {
    id: 'RD-02',
    vertical: 'ROADS_MOBILITY',
    category: 'Roads & Mobility',
    subCategory: 'Damaged Sidewalk / Kerbstone',
    responsibleDepartment: 'Municipal Corporation (Civil Engineering)',
    l2EscalationRole: 'Ward Zonal Engineer',
    defaultPriority: 'MEDIUM',
    slaHours: 168, // 7 Days
    cvTriggers: ['Concrete fracture', 'Paving stone displacement', 'Footpath obstruction', 'Tripping hazard edge'],
    description: 'Cracked paver blocks, uplifted tiles, or misaligned kerbstones impeding pedestrian transit.',
    suggestedAction: 'Replace interlocking paver blocks and reset kerb alignment.'
  },
  {
    id: 'RD-03',
    vertical: 'ROADS_MOBILITY',
    category: 'Roads & Mobility',
    subCategory: 'Open / Broken Manhole',
    responsibleDepartment: 'Jal Board / Underground Drainage (Sewerage) Cell',
    l2EscalationRole: 'Superintending Engineer (Drainage)',
    defaultPriority: 'CRITICAL',
    slaHours: 6,
    cvTriggers: ['Open circular aperture', 'Exposed sewer flow', 'Missing chamber cover', 'Pedestrian fall risk'],
    description: 'Missing or dislodged cast-iron/SFRC manhole cover posing catastrophic fall hazard.',
    suggestedAction: 'Immediate barricading within 30 min followed by heavy-duty SFRC cover installation.'
  },
  {
    id: 'RD-04',
    vertical: 'ROADS_MOBILITY',
    category: 'Roads & Mobility',
    subCategory: 'Streetlight Outage / Dark Spot',
    responsibleDepartment: 'Municipal Electrical Division / DisCom (Power Distribution)',
    l2EscalationRole: 'Assistant Engineer (Electrical)',
    defaultPriority: 'HIGH',
    slaHours: 24,
    cvTriggers: ['Street pole asset tag match', 'Night illuminance check (< 5 lux)', 'Broken luminaire housing'],
    description: 'Non-functional street luminaire creating public safety vulnerability and blackspot.',
    suggestedAction: 'Inspect CCMS feeder box, test driver circuit, and replace LED luminaire.'
  },
  {
    id: 'RD-05',
    vertical: 'ROADS_MOBILITY',
    category: 'Roads & Mobility',
    subCategory: 'Monsoon Road Waterlogging',
    responsibleDepartment: 'Stormwater Drainage Wing / Flood Control Room',
    l2EscalationRole: 'Executive Engineer (Drainage)',
    defaultPriority: 'URGENT',
    slaHours: 12,
    cvTriggers: ['Specular water reflection', 'Submerged lane markings', 'Wheel spray', 'Clogged catch-basin'],
    description: 'Submerged carriageway causing traffic gridlock and engine flooding.',
    suggestedAction: 'Deploy high-capacity mobile diesel dewatering pump and de-silt bellmouth drains.'
  },
  {
    id: 'RD-06',
    vertical: 'ROADS_MOBILITY',
    category: 'Roads & Mobility',
    subCategory: 'Damaged / Non-functional Traffic Signal',
    responsibleDepartment: 'City Traffic Police (Engineering Branch)',
    l2EscalationRole: 'Traffic Deputy Commissioner of Police',
    defaultPriority: 'HIGH',
    slaHours: 24,
    cvTriggers: ['Blinker outage', 'Physical pole tilt', 'Signal head destruction', 'Signal conflict indicator'],
    description: 'Compromised junction signal controller causing vehicular conflict and collision risk.',
    suggestedAction: 'Manual traffic constable deployment followed by signal controller replacement.'
  },
  {
    id: 'RD-07',
    vertical: 'ROADS_MOBILITY',
    category: 'Roads & Mobility',
    subCategory: 'Non-IRC / Illegal Speed Bump',
    responsibleDepartment: 'PWD / Regional Road Safety Council',
    l2EscalationRole: 'Zonal Traffic Safety Officer',
    defaultPriority: 'MEDIUM',
    slaHours: 120, // 5 Days
    cvTriggers: ['Non-marked asphalt mound', 'Absence of IRC retroreflective chevron markings', 'Excessive height'],
    description: 'Unsanctioned steep concrete/asphalt hump constructed without IRC:99-1988 guidelines.',
    suggestedAction: 'Milling down excessive hump and applying retroreflective thermoplastic stripes.'
  },

  // 2. Solid Waste & Environmental Sanitation
  {
    id: 'SW-01',
    vertical: 'SOLID_WASTE',
    category: 'Solid Waste',
    subCategory: 'Open Garbage Dumping (Illegal Spot)',
    responsibleDepartment: 'Municipal Health & Sanitation Division',
    l2EscalationRole: 'Chief Sanitation Officer',
    defaultPriority: 'URGENT',
    slaHours: 12,
    cvTriggers: ['Polythene clusters', 'Mixed municipal waste', 'Roadside footprint', 'Decomposition plume'],
    description: 'Unauthorized street-corner dumping site attracting stray vectors and creating foul stench.',
    suggestedAction: 'Deploy mechanical JCB loader, dumper tipper, and sanitize site with lime powder.'
  },
  {
    id: 'SW-02',
    vertical: 'SOLID_WASTE',
    category: 'Solid Waste',
    subCategory: 'Overflowing Community Waste Bin',
    responsibleDepartment: 'Concessionaire Waste Collection Agency / Ward Inspector',
    l2EscalationRole: 'Zonal Sanitation Superintendent',
    defaultPriority: 'URGENT',
    slaHours: 6,
    cvTriggers: ['Bin brim overflow volume > 85%', 'Spill periphery footprint', 'Scavenger scatter'],
    description: 'Public 1.1 m³ bin overflowing onto the pedestrian pathway and road edge.',
    suggestedAction: 'Immediate compactor truck routing for mechanical bin lifting and washdown.'
  },
  {
    id: 'SW-03',
    vertical: 'SOLID_WASTE',
    category: 'Solid Waste',
    subCategory: 'Construction & Demolition (C&D) Debris',
    responsibleDepartment: 'Municipal Town Planning / Enforcement Wing',
    l2EscalationRole: 'Ward Enforcement Officer',
    defaultPriority: 'MEDIUM',
    slaHours: 48,
    cvTriggers: ['Concrete aggregate', 'Brick mounds', 'Sand piles occupying carriage-way', 'Plaster dust'],
    description: 'Illegal dumping of construction malba blocking vehicular lane and creating particulate dust.',
    suggestedAction: 'Dispatch C&D processing transport truck and issue notice to adjacent property.'
  },
  {
    id: 'SW-04',
    vertical: 'SOLID_WASTE',
    category: 'Solid Waste',
    subCategory: 'Animal Carcass Clearance',
    responsibleDepartment: 'Animal Husbandry / Veterinary Sanitation Cell',
    l2EscalationRole: 'Chief Veterinary Officer',
    defaultPriority: 'CRITICAL',
    slaHours: 4,
    cvTriggers: ['Organic body morphology detection', 'Decomposition hazard alert', 'Fly swarm pattern'],
    description: 'Deceased animal on public right-of-way presenting biohazard and zoonotic infection risk.',
    suggestedAction: 'Dedicated sanitised hydraulic retrieval van for deep scientific burial/incineration.'
  },
  {
    id: 'SW-05',
    vertical: 'SOLID_WASTE',
    category: 'Solid Waste',
    subCategory: 'Open Biomass / Trash Burning',
    responsibleDepartment: 'State Pollution Control Board (SPCB) / Local Fire & Ward Cell',
    l2EscalationRole: 'Regional Environmental Officer',
    defaultPriority: 'CRITICAL',
    slaHours: 2,
    cvTriggers: ['Visible flame spectra', 'Smoke plume geometry', 'Black soot deposit', 'Thermal emissions'],
    description: 'Active burning of municipal leaves, plastic or trash generating toxic dioxins and severe AQI spike.',
    suggestedAction: 'Immediate fire squad dousing, photographic penalty issuance under Clean Air Act.'
  },
  {
    id: 'SW-06',
    vertical: 'SOLID_WASTE',
    category: 'Solid Waste',
    subCategory: 'Unsanitary Public Urinal / Toilet',
    responsibleDepartment: 'Municipal Public Health / Public Asset Maintenance',
    l2EscalationRole: 'Sanitary Sub-Inspector',
    defaultPriority: 'HIGH',
    slaHours: 8,
    cvTriggers: ['Standing blackwater', 'Waste accumulation', 'Plumbing failure', 'Stained fixture surfaces'],
    description: 'Choked public sanitation facility overflowing with unhygienic wastewater.',
    suggestedAction: 'High-pressure jetting machine sanitization, plumbing repair, and disinfectant dosing.'
  },

  // 3. Water Bodies, Streams & Ecological Assets
  {
    id: 'WB-01',
    vertical: 'WATER_BODIES_ECOLOGY',
    category: 'Water Bodies',
    subCategory: 'Floating Plastic / Trash in River or Canal',
    responsibleDepartment: 'Irrigation & Water Resources Dept / Clean River Cell',
    l2EscalationRole: 'Executive Engineer (Irrigation)',
    defaultPriority: 'HIGH',
    slaHours: 48,
    cvTriggers: ['Floating debris segmentation', 'Riparian water surface overlap', 'Plastic bottle rafts'],
    description: 'Heavy concentration of solid non-biodegradable plastics choking stream hydraulic flow.',
    suggestedAction: 'Deploy trash skimmer boat and floating boom barrier across canal channel.'
  },
  {
    id: 'WB-02',
    vertical: 'WATER_BODIES_ECOLOGY',
    category: 'Water Bodies',
    subCategory: 'Industrial Chemical Effluent Discharge',
    responsibleDepartment: 'State Pollution Control Board (Enforcement Wing)',
    l2EscalationRole: 'Member Secretary (SPCB)',
    defaultPriority: 'CRITICAL',
    slaHours: 12,
    cvTriggers: ['Chromatic water discoloration', 'Chemical lather/froth', 'Effluent outfall', 'Toxic sheen'],
    description: 'Direct unauthorized discharge of untreated chemical or toxic industrial effluent into watercourse.',
    suggestedAction: 'Immediate flying squad sample collection, outfall plugging, and factory sealing order.'
  },
  {
    id: 'WB-03',
    vertical: 'WATER_BODIES_ECOLOGY',
    category: 'Water Bodies',
    subCategory: 'Lake Eutrophication / Weed Infestation',
    responsibleDepartment: 'Wetland Conservation Authority / Lake Development Cell',
    l2EscalationRole: 'Lake Development Officer',
    defaultPriority: 'MEDIUM',
    slaHours: 240, // 10 Days
    cvTriggers: ['Green algal mat cover', 'Water hyacinth vegetative spread > 30 sq meters', 'Zero dissolved O2 signs'],
    description: 'Excessive invasive hyacinth weed blanket starving lake ecosystem of sunlight and oxygen.',
    suggestedAction: 'Deploy mechanical amphibious weed harvester and aerator fountains.'
  },
  {
    id: 'WB-04',
    vertical: 'WATER_BODIES_ECOLOGY',
    category: 'Water Bodies',
    subCategory: 'Untreated Sewage Drain Entering River',
    responsibleDepartment: 'Water & Sewage Infrastructure Board (STP Operations)',
    l2EscalationRole: 'Superintending Engineer (STP)',
    defaultPriority: 'HIGH',
    slaHours: 168, // 7 Days
    cvTriggers: ['Open gravity sewer outfall', 'Black sludge discharge pattern', 'Turbidity spike'],
    description: 'Raw municipal sewer line emptying straight into river without STP interception.',
    suggestedAction: 'Install inline bio-remediation barrier and divert outfall to trunk sewer interceptor.'
  },
  {
    id: 'WB-05',
    vertical: 'WATER_BODIES_ECOLOGY',
    category: 'Water Bodies',
    subCategory: 'Riparian Zone & Floodplain Encroachment',
    responsibleDepartment: 'District Collectorate (Revenue Department)',
    l2EscalationRole: 'Sub-Divisional Magistrate (SDM)',
    defaultPriority: 'MEDIUM',
    slaHours: 360, // 15 Days
    cvTriggers: ['Earth-fill mounds within high flood lines', 'Temporary masonry structures', 'Illegal bunds'],
    description: 'Unauthorized reclamation or building on designated river floodplain or buffer.',
    suggestedAction: 'Issue immediate stay order, revenue boundary survey, and demolition of illegal earthfill.'
  },

  // 4. Public Utilities & Civic Assets
  {
    id: 'UT-01',
    vertical: 'PUBLIC_UTILITIES',
    category: 'Public Utilities',
    subCategory: 'Water Main Burst / Pipeline Leakage',
    responsibleDepartment: 'City Water Board / Public Health Engineering (PHED)',
    l2EscalationRole: 'Assistant Executive Engineer (Water)',
    defaultPriority: 'URGENT',
    slaHours: 8,
    cvTriggers: ['Pressurized vertical/lateral plume', 'Surface pooling', 'Asphalt cavitation', 'Pressure loss'],
    description: 'Major potable pipeline rupture flooding road surface and disrupting water supply to colony.',
    suggestedAction: 'Isolate upstream sluice valve, excavate break point, and clamp ductile iron sleeve.'
  },
  {
    id: 'UT-02',
    vertical: 'PUBLIC_UTILITIES',
    category: 'Public Utilities',
    subCategory: 'Potable Water Contamination',
    responsibleDepartment: 'Water Quality Assurance Lab / Health Department',
    l2EscalationRole: 'Quality Assurance Director',
    defaultPriority: 'CRITICAL',
    slaHours: 12,
    cvTriggers: ['High turbidity', 'Chemical discoloration', 'Offensive odor telemetry flags', 'Coliform alert'],
    description: 'Contaminated tap water with foul smell or yellow/brown turbidity supplied to residential area.',
    suggestedAction: 'Immediate pipeline super-chlorination, tanker water supply dispatch, and sewer cross-leak test.'
  },
  {
    id: 'PA-01',
    vertical: 'CIVIC_ASSETS',
    category: 'Civic Assets',
    subCategory: 'Fallen Tree / Roadway Obstruction',
    responsibleDepartment: 'Horticulture Wing / Disaster Management & Fire Service',
    l2EscalationRole: 'Superintendent of Horticulture',
    defaultPriority: 'URGENT',
    slaHours: 6,
    cvTriggers: ['Tree trunk horizontal carriage obstruction', 'Green foliage canopy fall', 'Snapped overhead cables'],
    description: 'Uprooted tree blocking main carriageway or crushing overhead utility lines.',
    suggestedAction: 'Deploy motorized chainsaw squad and hydraulic crane for rapid road clearance.'
  },
  {
    id: 'PA-02',
    vertical: 'CIVIC_ASSETS',
    category: 'Civic Assets',
    subCategory: 'Broken Playground Equipment / Park Assets',
    responsibleDepartment: 'Municipal Parks & Gardens Division',
    l2EscalationRole: 'Park Inspector',
    defaultPriority: 'MEDIUM',
    slaHours: 168, // 7 Days
    cvTriggers: ['Metal shearing', 'Broken swing/bench timber', 'Loose anchorage', 'Sharp edge hazard'],
    description: 'Damaged children swing, slide, or public bench in neighborhood park.',
    suggestedAction: 'Weld support struts, replace fractured chains, and repaint with safety coating.'
  },
  {
    id: 'PA-03',
    vertical: 'CIVIC_ASSETS',
    category: 'Civic Assets',
    subCategory: 'Pedestrian Walkway Encroachment',
    responsibleDepartment: 'Municipal Anti-Encroachment Squad / Police Support',
    l2EscalationRole: 'Assistant Commissioner (Enforcement)',
    defaultPriority: 'MEDIUM',
    slaHours: 120, // 5 Days
    cvTriggers: ['Commercial kiosk projection', 'Unauthorized tarpaulin extensions', 'Sidewalk blockage'],
    description: 'Illegal vendor sheds or commercial boards fully obstructing pedestrian walkway.',
    suggestedAction: 'Serve 24-hr eviction notice followed by removal drive.'
  }
];

export function findTaxonomyById(id: string): CivicTaxonomyItem {
  return CIVIC_TAXONOMY.find(item => item.id === id) || CIVIC_TAXONOMY[0];
}

export function findTaxonomyByKeyword(keyword: string): CivicTaxonomyItem {
  const normalized = keyword.toLowerCase();
  const match = CIVIC_TAXONOMY.find(item => 
    item.subCategory.toLowerCase().includes(normalized) ||
    item.category.toLowerCase().includes(normalized) ||
    item.cvTriggers.some(t => t.toLowerCase().includes(normalized)) ||
    item.description.toLowerCase().includes(normalized)
  );
  return match || CIVIC_TAXONOMY[0];
}
