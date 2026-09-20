import React from 'react';
import { 
  Zap, 
  AlertCircle, 
  Trash2, 
  Waves, 
  TreePine, 
  ShieldAlert, 
  Radio
} from 'lucide-react';
import { SpatialCoordinate } from '../../types/civic';

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  category: string;
  subCategory: string;
  taxonomyId: string;
  imageUrl: string;
  voiceTranscript: string;
  location: SpatialCoordinate;
  address: string;
  isDuplicateTarget?: boolean;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset-pothole',
    title: 'Hazardous Pothole (Ring Road)',
    subtitle: 'Deep asphalt cavity • Carriageway risk',
    icon: AlertCircle,
    category: 'Roads & Mobility',
    subCategory: 'Potholes (Deep / Hazardous)',
    taxonomyId: 'RD-01',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    voiceTranscript: 'Deep dangerous pothole right in the middle lane near pillar 42. Two-wheelers are swerving dangerously!',
    location: { lat: 28.6346, lng: 77.2183, accuracy: 3.5 }, // Within 15m of existing ticket to test 25m deduplication!
    address: 'Ring Road Outer Flyover Pillar 42',
    isDuplicateTarget: true
  },
  {
    id: 'preset-bin',
    title: 'Overflowing Waste Bin (Market)',
    subtitle: '1.1m³ bin overflow >85% • Vector risk',
    icon: Trash2,
    category: 'Solid Waste',
    subCategory: 'Overflowing Community Waste Bin',
    taxonomyId: 'SW-02',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    voiceTranscript: 'Commercial dumpster is overflowing all over the pavement, attracting stray animals and blocking the sidewalk.',
    location: { lat: 28.6482, lng: 77.1852, accuracy: 4.1 },
    address: 'Block C Community Center, Wholesale Market Road',
    isDuplicateTarget: true
  },
  {
    id: 'preset-river',
    title: 'Chemical Effluent (Yamuna River)',
    subtitle: 'Toxic lather & foam • Outfall discharge',
    icon: Waves,
    category: 'Water Bodies',
    subCategory: 'Industrial Chemical Effluent Discharge',
    taxonomyId: 'WB-02',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    voiceTranscript: 'Untreated chemical foam and black industrial discharge flowing directly into the river stream near the barrage.',
    location: { lat: 28.6521, lng: 77.2552, accuracy: 5.0 },
    address: 'Yamuna Barrage Drain Outfall #7',
    isDuplicateTarget: true
  },
  {
    id: 'preset-manhole',
    title: 'Open Sewer Manhole (New Report)',
    subtitle: 'Cast-iron cover missing • 6h Critical SLA',
    icon: ShieldAlert,
    category: 'Roads & Mobility',
    subCategory: 'Open / Broken Manhole',
    taxonomyId: 'RD-03',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    voiceTranscript: 'Uncovered deep drainage hole right on the pedestrian crossing. Extremely dangerous at night.',
    location: { lat: 28.6720, lng: 77.2250, accuracy: 2.8 }, // Unique coordinate to create fresh ticket
    address: 'Civil Lines Northern Arterial Walkway',
    isDuplicateTarget: false
  },
  {
    id: 'preset-tree',
    title: 'Uprooted Fallen Tree (New Report)',
    subtitle: 'Carriageway blocked • Horticulture Wing',
    icon: TreePine,
    category: 'Civic Assets',
    subCategory: 'Fallen Tree / Roadway Obstruction',
    taxonomyId: 'PA-01',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    voiceTranscript: 'Heavy tree trunk collapsed across two traffic lanes after storm winds. Road completely blocked.',
    location: { lat: 28.6080, lng: 77.2400, accuracy: 3.2 },
    address: 'Lodhi Colony Main Road, Near Park Gate 2',
    isDuplicateTarget: false
  }
];

interface QuickPresetsProps {
  onSelectPreset: (preset: PresetScenario) => void;
  isLoading: boolean;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({
  onSelectPreset,
  isLoading
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-slate-300">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Quick Sandbox Scenarios (One-Tap Test Ingestion)
          </h4>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          5 Presets Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PRESET_SCENARIOS.map((scenario) => {
          const IconComponent = scenario.icon;
          return (
            <button
              key={scenario.id}
              disabled={isLoading}
              onClick={() => onSelectPreset(scenario)}
              className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group disabled:opacity-50"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden relative border border-slate-700 group-hover:border-emerald-500/60">
                <img
                  src={scenario.imageUrl}
                  alt={scenario.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                    {scenario.title}
                  </span>
                  {scenario.isDuplicateTarget && (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      25m Duplicate
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {scenario.subtitle}
                </p>
                <div className="text-[10px] text-emerald-400/80 font-mono mt-1 flex items-center space-x-1">
                  <Radio className="w-3 h-3" />
                  <span>Tap to ingest & analyze</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
