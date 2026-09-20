import React from 'react';
import { ThumbsUp, MapPin, Check, X, ShieldCheck, HeartHandshake, Sparkles, Clock } from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface LikeReportConfirmModalProps {
  isOpen: boolean;
  ticket: CivicIssue | null;
  onConfirmReport: (ticket: CivicIssue) => void;
  onCancel: () => void;
}

export const LikeReportConfirmModal: React.FC<LikeReportConfirmModalProps> = ({
  isOpen,
  ticket,
  onConfirmReport,
  onCancel
}) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700/90 text-white shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center space-x-3 pr-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <ThumbsUp className="w-6 h-6 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black tracking-tight text-white truncate">
              Co-Report This Issue?
            </h3>
            <p className="text-xs text-emerald-400 font-medium truncate">
              Add to Profile & track municipal fix
            </p>
          </div>
        </div>

        {/* Issue Card Preview */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
          <img
            src={ticket.imageUrl}
            alt={ticket.subCategory}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {ticket.subCategory}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{ticket.address}</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
              <span className="truncate">{ticket.assignedDepartment}</span>
              <span>•</span>
              <span className="text-cyan-400 font-medium">SLA: {ticket.slaHours}h</span>
            </div>
          </div>
        </div>

        {/* Informative Explanation Box */}
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-emerald-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Community Civic Power</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Liking this issue registers you as an affected citizen. It will appear on your <strong className="text-emerald-300">Profile Tab</strong> so you are alerted when the government uploads repair proof to cast your vote.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => onConfirmReport(ticket)}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-lg shadow-emerald-500/20 transition-all active:scale-98"
          >
            <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Yes, Report & Add to Profile</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-700/80 transition-all"
          >
            Don't Report / Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
