import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  ThumbsUp, 
  MapPin, 
  Sliders, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface ProfileScreenProps {
  tickets: CivicIssue[];
  spamPreventedCount: number;
  apiKey: string;
  setApiKey: (key: string) => void;
  onOpenVerificationStudio: (ticket: CivicIssue) => void;
  selectedCity: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  tickets,
  spamPreventedCount,
  apiKey,
  setApiKey,
  onOpenVerificationStudio,
  selectedCity
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const pendingVerification = tickets.find((t) => t.status === 'WORK_SUBMITTED') || tickets[0];
  const totalUpvotesGiven = tickets.reduce((acc, t) => acc + t.upvoteCount, 0);

  return (
    <div className="space-y-5 pb-24 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. Citizen Profile Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20">
            CP
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Citizen Commuter</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Verified Guardian
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Ward 14 • {selectedCity}</span>
            </p>
          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-lg font-black text-emerald-400">12</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Reports</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-lg font-black text-cyan-400">{spamPreventedCount}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Spam Bundled</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-lg font-black text-amber-400">940</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Karma Pts</div>
          </div>
        </div>
      </div>

      {/* 2. Municipal Staff Portal / Verification Studio Callout */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Municipal Staff Verification Portal
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            Audit Mode
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Test the <strong>"No Fake Closures"</strong> engine. Review repair photos against citizen reports with the interactive Before/After diff slider and 15m geofence audit.
        </p>

        <button
          type="button"
          onClick={() => onOpenVerificationStudio(pendingVerification)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all"
        >
          <Sliders className="w-4 h-4" />
          <span>Launch AI Before/After Verification Studio</span>
        </button>
      </div>

      {/* 3. API Key & Developer Settings */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <Key className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Gemini Vision API Key</div>
            <div className="text-[11px] text-slate-400">
              {apiKey ? 'Personal API Key Connected' : 'Using Built-in Edge Vision Engine'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
        >
          {apiKey ? 'Manage' : 'Configure'}
        </button>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              Gemini Vision API Key (Optional)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              MarkPoint comes pre-configured with active Gemini AI keys. You can also specify a custom API Key below.
            </p>

            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setApiKey(tempKey);
                  setShowKeyModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
