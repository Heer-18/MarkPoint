import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Sparkles, 
  Crosshair, 
  RefreshCw, 
  AlertTriangle,
  Upload,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CivicIssue } from '../../types/civic';
import { DiffSlider } from '../Shared/DiffSlider';
import { verifyWorkSubmission, VerificationResponse } from '../../services/diffVerification';

interface VerificationStudioProps {
  ticket: CivicIssue;
  onClose: () => void;
  onResolvedSuccessfully: (ticketId: string, result: any) => void;
}

export const VerificationStudio: React.FC<VerificationStudioProps> = ({
  ticket,
  onClose,
  onResolvedSuccessfully
}) => {
  const [afterImage, setAfterImage] = useState<string>(
    ticket.imageAfterUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  );
  const [workerLat, setWorkerLat] = useState<number>(ticket.location.lat + 0.00004); // ~4.5m distance
  const [workerLng, setWorkerLng] = useState<number>(ticket.location.lng + 0.00003);
  const [workerNotes, setWorkerNotes] = useState('Repaired road cavity using hot-mix mastic asphalt patch. Compacted with vibrating roller.');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);

  const runAiVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await verifyWorkSubmission({
        ticket,
        imageAfterUrl: afterImage,
        uploadLocation: { lat: workerLat, lng: workerLng },
        workerNotes
      });

      setVerificationResult(response);

      if (response.verified) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApplyResolution = () => {
    if (verificationResult?.verified) {
      onResolvedSuccessfully(ticket.id, verificationResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[max(env(safe-area-inset-top,28px),28px)] pb-[max(env(safe-area-inset-bottom,28px),28px)] bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 text-white shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                AI "No Fake Closures" Verification Studio
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Ground Remediation Proof-of-Work Audit
            </h3>
            <p className="text-xs text-slate-400">
              Ticket #{ticket.id} • {ticket.subCategory} • {ticket.assignedDepartment}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>

        {/* Dual Interactive Split Slider */}
        <div className="mb-5">
          <DiffSlider
            beforeImage={ticket.imageUrl}
            afterImage={afterImage}
            beforeLabel="CITIZEN REPORT (BEFORE)"
            afterLabel="FIELD REPAIR (AFTER)"
            heightClass="h-72 sm:h-80"
          />
        </div>

        {/* Quick Test Scenarios for Verification */}
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-slate-400">Test Scenarios:</span>
          
          <button
            onClick={() => {
              setAfterImage('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80');
              setWorkerLat(ticket.location.lat + 0.00004);
              setWorkerLng(ticket.location.lng + 0.00003);
              setWorkerNotes('Freshly patched asphalt road surface with roller compaction.');
              setVerificationResult(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] hover:bg-emerald-900"
          >
            ✓ Genuine Fix (Within 5m)
          </button>

          <button
            onClick={() => {
              setAfterImage('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
              setWorkerLat(ticket.location.lat);
              setWorkerLng(ticket.location.lng);
              setWorkerNotes('Deceptive fake submission (Same unfixed pothole).');
              setVerificationResult(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/30 text-rose-300 text-[11px] hover:bg-rose-900"
          >
            ✗ Deceptive Fake Photo
          </button>

          <button
            onClick={() => {
              setWorkerLat(ticket.location.lat + 0.001); // 110m away
              setWorkerLng(ticket.location.lng + 0.001);
              setWorkerNotes('Offsite photo upload attempt.');
              setVerificationResult(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[11px] hover:bg-amber-900"
          >
            ⚠ Geofence Breach (&gt;15m)
          </button>
        </div>

        {/* Telemetry Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-mono block mb-1">
              Field Crew GPS Upload Lock
            </span>
            <div className="flex items-center space-x-2 text-slate-300 font-mono">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>{workerLat.toFixed(5)}, {workerLng.toFixed(5)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-mono block mb-1">
              Field Worker Execution Log
            </span>
            <p className="text-slate-300 italic truncate">
              "{workerNotes}"
            </p>
          </div>
        </div>

        {/* Verification Result Banner */}
        {verificationResult && (
          <div className={`p-4 rounded-xl mb-5 border animate-in zoom-in-95 ${
            verificationResult.verified
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
          }`}>
            <div className="flex items-start space-x-3">
              {verificationResult.verified ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">
                    {verificationResult.verified ? 'AI Verification PASSED: Genuine Fix Confirmed' : 'AI Verification REJECTED'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 font-mono">
                    Diff Score: {Math.round(verificationResult.diffScore * 100)}%
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-200 leading-relaxed">
                  {verificationResult.reasoning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            disabled={isVerifying}
            onClick={runAiVerification}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Computer Vision Diff...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Diff & Geofence Match</span>
              </>
            )}
          </button>

          {verificationResult?.verified && (
            <button
              onClick={handleApplyResolution}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize Ticket Closure</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
