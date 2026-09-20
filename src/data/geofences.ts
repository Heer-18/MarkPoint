import { GeofencePolygon } from '../types/civic';

export const CITY_GEOFENCES: GeofencePolygon[] = [
  {
    id: 'GEO-NHAI-01',
    name: 'National Highway NH-44 Corridor Grid',
    type: 'NHAI_HIGHWAY',
    color: '#ef4444',
    fillOpacity: 0.15,
    authority: 'NHAI Project Director (National Highway Command)',
    coordinates: [
      [28.6650, 77.2000],
      [28.6750, 77.2300],
      [28.6680, 77.2500],
      [28.6550, 77.2200],
      [28.6650, 77.2000],
    ]
  },
  {
    id: 'GEO-PWD-01',
    name: 'State Highway Arterial Corridor (Ring Road PWD)',
    type: 'STATE_PWD',
    color: '#f97316',
    fillOpacity: 0.15,
    authority: 'Executive Engineer (State PWD Roads Circle-1)',
    coordinates: [
      [28.6300, 77.1900],
      [28.6450, 77.2200],
      [28.6380, 77.2500],
      [28.6200, 77.2200],
      [28.6300, 77.1900],
    ]
  },
  {
    id: 'GEO-MCD-01',
    name: 'Central Municipal Ward & Colony Grid',
    type: 'MUNICIPAL_ARTERIAL',
    color: '#06b6d4',
    fillOpacity: 0.12,
    authority: 'Municipal Corporation (Central Zone Civil Desk)',
    coordinates: [
      [28.6100, 77.2000],
      [28.6300, 77.2200],
      [28.6250, 77.2400],
      [28.6050, 77.2300],
      [28.6100, 77.2000],
    ]
  },
  {
    id: 'GEO-RIVER-01',
    name: 'Yamuna River & Riparian Eco-Buffer (100m)',
    type: 'RIVER_BUFFER',
    color: '#3b82f6',
    fillOpacity: 0.2,
    authority: 'State Pollution Control Board / Irrigation Wing',
    coordinates: [
      [28.6800, 77.2400],
      [28.6700, 77.2600],
      [28.6200, 77.2700],
      [28.6100, 77.2500],
      [28.6400, 77.2450],
      [28.6800, 77.2400],
    ]
  },
  {
    id: 'GEO-SANI-01',
    name: 'Industrial & Wholesale Market Sanitation Sector',
    type: 'SANITATION_ZONE',
    color: '#10b981',
    fillOpacity: 0.15,
    authority: 'Chief Sanitation Officer / Concessionaire Fleet',
    coordinates: [
      [28.6400, 77.1700],
      [28.6600, 77.1900],
      [28.6500, 77.2100],
      [28.6350, 77.1900],
      [28.6400, 77.1700],
    ]
  }
];
