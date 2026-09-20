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
  Layers
} from 'lucide-react';
import { CVAnalysisResult, CivicIssue } from '../../types/civic';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 text-white shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            Gemini Multimodal AI Ingestion Complete
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">
          Automated Grievance Classification & Dispatch Draft
        </h3>

        {/* Top Grid: Image + Detected Class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video">
            <img
              src={imageUrl}
              alt="Reported Issue"
              className="w-full h-full object-cover"
            />
            {/* Object Detection Overlay Bounding Box */}
            <div className="absolute inset-4 border-2 border-dashed border-emerald-400 rounded-lg bg-emerald-500/10 pointer-events-none flex items-start justify-start p-1.5">
              <span className="px-1.5 py-0.5 text-[9px] font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-400/40 rounded">
                {analysis.detectedObjects[0]?.label || 'Identified Hazard'} ({Math.round(analysis.confidence * 100)}%)
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Taxonomy #{analysis.taxonomyId}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
              
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{analysis.responsibleDepartment}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>SLA Resolution Window: {analysis.slaHours} Hours</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">L2 Authority: {analysis.l2EscalationRole}</span>
                </div>
              </div>
            </div>

            {/* Triggers Matched */}
            <div className="mt-3 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Computer Vision Triggers Matched:
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
              Auto-Generated Official Bureaucratic Draft
            </h5>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto">
            {analysis.formalComplaintDraft}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirmSubmit}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Commit Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
