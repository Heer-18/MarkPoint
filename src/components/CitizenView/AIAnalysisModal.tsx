import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Building2, 
  FileText, 
  X, 
  Send,
  AlertTriangle,
  Layers,
  Camera,
  RotateCcw
} from 'lucide-react';
import { CVAnalysisResult } from '../../types/civic';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CVAnalysisResult | null;
  onConfirmSubmit: () => void;
  imageUrl: string;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onConfirmSubmit,
  imageUrl
}) => {
  if (!isOpen || !analysis) return null;

  const isNonCivic = analysis.isValid === false || analysis.taxonomyId === 'NON-CIVIC';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pt-[max(env(safe-area-inset-top,24px),24px)] pb-[max(env(safe-area-inset-bottom,24px),24px)] bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700/80 text-white shadow-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
          {isNonCivic ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
          ) : (
            <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          )}
          <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            isNonCivic 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {isNonCivic ? 'Visual Validation Notice' : 'AI Inspection Verified'}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 pr-8">
          {isNonCivic ? 'No Municipal Hazard Detected in Photo' : 'Automated Grievance Classification & Dispatch'}
        </h3>

        {/* Top Grid: Image + Detected Class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video">
            <img
              src={imageUrl}
              alt="Reported Issue"
              className="w-full h-full object-cover"
            />
            {/* Overlay Box */}
            <div className={`absolute inset-4 border-2 border-dashed rounded-xl pointer-events-none flex items-start justify-start p-1.5 ${
              isNonCivic ? 'border-amber-400 bg-amber-500/10' : 'border-emerald-400 bg-emerald-500/10'
            }`}>
              <span className={`px-2 py-0.5 text-[9px] font-mono rounded ${
                isNonCivic ? 'bg-amber-950/90 text-amber-300 border border-amber-400/40' : 'bg-emerald-950/90 text-emerald-300 border border-emerald-400/40'
              }`}>
                {analysis.detectedObjects[0]?.label || 'Analyzed Photo'}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  {analysis.taxonomyId}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isNonCivic ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  analysis.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  analysis.priority === 'URGENT' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}>
                  {analysis.priority} Priority
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {analysis.subCategory}
              </h4>
              
              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{analysis.responsibleDepartment}</span>
                </div>
                {!isNonCivic && (
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>SLA Resolution Window: {analysis.slaHours} Hours</span>
                  </div>
                )}
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">Authority: {analysis.l2EscalationRole}</span>
                </div>
              </div>
            </div>

            {/* Triggers Matched */}
            <div className="mt-3 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Vision Telemetry:
              </span>
              <div className="flex flex-wrap gap-1">
                {analysis.detectedTriggers.map((t, idx) => (
                  <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bureaucratic Letter Draft Preview */}
        <div className="mb-5">
          <div className="flex items-center space-x-2 text-slate-300 mb-1.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider">
              {isNonCivic ? 'Submission Notice' : 'Auto-Generated Official Municipal Notice'}
            </h5>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
            {analysis.formalComplaintDraft}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isNonCivic ? 'Take New Photo' : 'Cancel'}</span>
          </button>
          
          {!isNonCivic && (
            <button
              type="button"
              onClick={onConfirmSubmit}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Commit Ticket</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
