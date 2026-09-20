import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  X, 
  ThumbsUp, 
  Layers, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface DeduplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterTicket: CivicIssue;
  distanceMeters: number;
  newImageUrl: string;
}

export const DeduplicationModal: React.FC<DeduplicationModalProps> = ({
  isOpen,
  onClose,
  masterTicket,
  distanceMeters,
  newImageUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[max(env(safe-area-inset-top,28px),28px)] pb-[max(env(safe-area-inset-bottom,28px),28px)] bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-xl p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 text-white shadow-2xl relative overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400 animate-bounce" />
          <span className="text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            PostGIS ST_DWithin (25m) Anti-Spam Active
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Spatial Duplicate Aggregated Successfully!
        </h3>
        
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          Your report matches an active issue within <strong className="text-emerald-400">{distanceMeters} meters</strong>. 
          To prevent overwhelming municipal crews with multiple redundant tickets for the same problem, your report has been <strong>automatically bundled into the master ticket as a high-priority upvote</strong>.
        </p>

        {/* Master Ticket Comparison Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200">
                Master Ticket #{masterTicket.id}
              </span>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                {masterTicket.subCategory}
              </p>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Priority Score: {masterTicket.upvoteCount} Upvotes</span>
            </div>
          </div>

          {/* Dual Thumbnails */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="relative rounded-lg overflow-hidden border border-slate-700 aspect-video">
              <img
                src={masterTicket.imageUrl}
                alt="Master Report"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[9px] font-mono text-slate-300 rounded">
                Original #{masterTicket.id}
              </span>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-emerald-500/50 aspect-video">
              <img
                src={newImageUrl}
                alt="Your Report"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-950/80 text-[9px] font-mono text-emerald-300 rounded border border-emerald-500/30">
                Your Confirmation (+1 Upvote)
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{masterTicket.address}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Assigned: {masterTicket.assignedDepartment}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got it, Track Community Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
