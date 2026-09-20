import React, { useState } from 'react';
import { 
  MapPin, 
  Smartphone, 
  Layers, 
  Key, 
  Volume2, 
  VolumeX, 
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeView: 'citizen' | 'command_center';
  setActiveView: (view: 'citizen' | 'command_center') => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  spamPreventedCount: number;
  totalResolved: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  apiKey,
  setApiKey,
  soundEnabled,
  setSoundEnabled,
  spamPreventedCount,
  totalResolved
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand: MarkPoint */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              <MapPin className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">MarkPoint</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                  Smart Civic
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Vision Ingestion • 25m Anti-Spam • SLA Routing
              </p>
            </div>
          </div>

          {/* Live Telemetry Pill */}
          <div className="hidden md:flex items-center space-x-4 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{spamPreventedCount} Duplicates Prevented</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center space-x-1.5 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              <span>{totalResolved} Fixed & Verified</span>
            </div>
          </div>

          {/* Mode Switcher & Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setActiveView('citizen')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'citizen'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Citizen View</span>
              </button>

              <button
                onClick={() => setActiveView('command_center')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'command_center'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Command Center</span>
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Speech' : 'Enable Speech'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              title="Configure Gemini API Key"
              className={`p-2 rounded-lg border transition-colors ${
                apiKey ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 text-white shadow-2xl">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold">Gemini Vision API Configuration</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              MarkPoint comes pre-configured with active Gemini AI keys. You can also specify a custom API Key below.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  GEMINI_API_KEY
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AQ.Ab8RN..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setApiKey(tempKey);
                    setShowKeyModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/40"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
