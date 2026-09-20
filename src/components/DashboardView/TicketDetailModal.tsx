import React from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  Clock, 
  ShieldAlert, 
  ThumbsUp, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Sliders,
  ExternalLink,
  Crosshair
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface TicketDetailModalProps {
  ticket: CivicIssue | null;
  onClose: () => void;
  onOpenVerificationStudio: (ticket: CivicIssue) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onOpenVerificationStudio
}) => {
  if (!ticket) return null;

  const isResolved = ticket.status === 'VERIFIED_RESOLVED' || ticket.status === 'RESOLVED_DEMO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[max(env(safe-area-inset-top,28px),28px)] pb-[max(env(safe-area-inset-bottom,28px),28px)] bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700/80 text-white shadow-2xl relative my-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
          <span>MASTER TICKET #{ticket.id}</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">TAXONOMY {ticket.taxonomyId}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {ticket.subCategory}
        </h3>

        <p className="text-xs text-slate-400 flex items-center space-x-1.5 mb-5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>{ticket.address}</span>
        </p>

        {/* 2 Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          
          {/* Column 1: Image & CV Triggers */}
          <div>
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video mb-3">
              <img
                src={ticket.imageUrl}
                alt={ticket.subCategory}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-mono text-emerald-300">
                AI Confidence: {Math.round(ticket.aiConfidence * 100)}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Computer Vision Telemetry Triggers:
              </span>
              <div className="flex flex-wrap gap-1">
                {ticket.detectedCvTriggers.map((trig, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    ✓ {trig}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Department Dispatch & SLAs */}
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Severity / Priority:</span>
                <span className="font-bold text-rose-400 uppercase">{ticket.priority}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Target Department:</span>
                <span className="font-semibold text-slate-200 text-right">{ticket.assignedDepartment}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">L2 Escalation Role:</span>
                <span className="font-semibold text-amber-400 text-right">{ticket.l2EscalationRole}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Geofenced Zone:</span>
                <span className="font-mono text-cyan-300 text-right">{ticket.geofenceZone}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">COMMUNITY ENDORSEMENTS</span>
                <span className="text-base font-bold text-emerald-400">👍 {ticket.upvoteCount} Upvotes</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">SLA WINDOW</span>
                <span className="text-base font-bold text-cyan-400">{ticket.slaHours} Hours</span>
              </div>
            </div>

            {ticket.citizenVoiceTranscript && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 italic text-[11px] text-slate-300">
                "{ticket.citizenVoiceTranscript}"
              </div>
            )}
          </div>

        </div>

        {/* Official Grievance Draft */}
        <div className="mb-5">
          <div className="flex items-center space-x-2 text-slate-300 mb-1.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              Statutory Bureaucratic Payload
            </h5>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
            {ticket.formalComplaintDraft}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Reported: {new Date(ticket.reportedAt).toLocaleString()}
          </div>

          <div className="flex items-center space-x-2">
            {!isResolved && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVerificationStudio(ticket);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 transition-all"
              >
                <Sliders className="w-4 h-4" />
                <span>Open Verification Studio</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
