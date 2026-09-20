import React from 'react';
import { 
  PlusCircle, 
  MapPin, 
  ListFilter, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  Volume2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';
import { ProblemMap } from '../Common/ProblemMap';
import { DiffSlider } from '../Shared/DiffSlider';
import { triggerHapticImpact, triggerHapticSelection } from '../../services/hapticsService';

interface HomeScreenProps {
  onNavigateTab: (tab: 'home' | 'notices' | 'new_request' | 'requests' | 'profile') => void;
  tickets: CivicIssue[];
  selectedCity: string;
  onSelectTicket: (ticket: CivicIssue) => void;
  spamPreventedCount: number;
  centerCoords?: { lat: number; lng: number };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  tickets,
  selectedCity,
  onSelectTicket,
  spamPreventedCount,
  centerCoords
}) => {
  const cityTickets = tickets.filter(
    (t) =>
      t.address.toLowerCase().includes(selectedCity.toLowerCase()) ||
      t.id.toLowerCase().includes(selectedCity.substring(0, 3).toLowerCase())
  );
  const activeCityTickets = cityTickets.filter(
    (t) => t.status !== 'VERIFIED_RESOLVED' && t.status !== 'RESOLVED_DEMO'
  );
  const resolvedTickets = tickets.filter(
    (t) => t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO'
  );

  const sampleResolved = resolvedTickets[0] || tickets[0];

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. Hero Welcome Card inspired by Reference Screenshot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600/90 via-orange-600 to-amber-700 p-6 sm:p-8 text-white shadow-2xl border border-orange-400/30">
        
        {/* Heart Wrench Icon Badge */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white mb-4 shadow-lg">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          Let's improve our neighborhoods.
        </h2>
        
        <p className="text-sm text-amber-100/90 max-w-md leading-relaxed mb-6">
          Report broken roads, overflowing waste bins, or water leaks in seconds. No tedious paperwork or forms required.
        </p>

        {/* 3 Core Action Buttons matching screenshot */}
        <div className="space-y-2.5 sm:space-y-0 sm:grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { triggerHapticSelection(); onNavigateTab('new_request'); }}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-amber-50 transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center space-x-2.5">
              <PlusCircle className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
              <span>Report an Issue</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => { triggerHapticSelection(); onNavigateTab('requests'); }}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-black/25 hover:bg-black/35 border border-white/25 text-white font-bold text-sm backdrop-blur-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-center space-x-2.5">
              <ListFilter className="w-5 h-5 text-amber-300" />
              <span>View Nearby Requests</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-200" />
          </button>
        </div>

        {/* Subtle Decorative Circle */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl" />
      </div>

      {/* 2. City Impact Telemetry Bar (Updated: total reported problem, active in <City>, fixed today) */}
      <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <div className="p-2">
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {tickets.length}
          </div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5 leading-tight">
            Total Reported Problem
          </div>
        </div>

        <div className="p-2 border-x border-slate-800">
          <div className="text-xl sm:text-2xl font-black text-cyan-400">
            {activeCityTickets.length}
          </div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5 leading-tight">
            Active in {selectedCity}
          </div>
        </div>

        <div className="p-2">
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            {resolvedTickets.length}
          </div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5 leading-tight">
            Fixed Today
          </div>
        </div>
      </div>

      {/* 3. Problem Map Widget (Showing Problem Locations) */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Live Problem Map: {selectedCity}
              </h3>
              <p className="text-[11px] text-slate-400">
                Potholes, garbage piles, and waterlogging across city sectors
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('requests')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>Full Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Embedded Problem Map */}
        <ProblemMap
          tickets={tickets}
          selectedTicket={null}
          onSelectTicket={onSelectTicket}
          centerCoords={centerCoords}
          heightClass="h-64 sm:h-80"
        />
      </div>

      {/* 4. How It Works (3 Core Architecture Steps) */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            How MarkPoint Works in 3 Simple Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-sm mb-2">
              1
            </div>
            <h4 className="text-xs font-bold text-white mb-1">
              AI Vision & Auto-Dispatch
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Snap a photo of the civic issue. Computer Vision detects severity, generates the formal complaint, and routes to the right municipal team.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 font-black text-sm mb-2">
              2
            </div>
            <h4 className="text-xs font-bold text-white mb-1">
              25m Spatial Anti-Spam
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If multiple citizens report the same issue within 25 meters, reports are merged into 1 prioritized master ticket with combined community upvotes.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-black text-sm mb-2">
              3
            </div>
            <h4 className="text-xs font-bold text-white mb-1">
              70% Citizen Verification
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When municipal crews upload repair proof, citizens vote with a 70% satisfaction consensus before official closure. No fake closures.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Recently Fixed Showcase (Before / After Slider) */}
      {sampleResolved.imageAfterUrl && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Recently Fixed by Municipal Crew
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              AI Verified
            </span>
          </div>

          <DiffSlider
            beforeImage={sampleResolved.imageUrl}
            afterImage={sampleResolved.imageAfterUrl}
            heightClass="h-56 sm:h-64"
          />

          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <span>{sampleResolved.subCategory} • {sampleResolved.address}</span>
            <span className="text-emerald-400 font-semibold">Resolved in {sampleResolved.slaHours}h</span>
          </div>
        </div>
      )}

    </div>
  );
};
