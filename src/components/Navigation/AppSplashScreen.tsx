import React, { useEffect, useState } from 'react';

interface AppSplashScreenProps {
  onComplete: () => void;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050811] transition-opacity duration-500 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* Glowing concentric pulse rings */}
        <div className="absolute w-32 h-32 rounded-full bg-emerald-500/15 animate-ping opacity-75" />
        <div className="absolute w-24 h-24 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />

        {/* Minimal Iconic Centerpiece */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2px] shadow-[0_0_40px_rgba(16,185,129,0.35)] animate-in zoom-in-75 duration-700">
          <div className="w-full h-full bg-[#070d19] rounded-2xl flex items-center justify-center relative overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-10 h-10 text-emerald-400 transform transition-transform duration-700 hover:scale-110"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" fill="#10b981" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center space-y-1 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-1.5">
          <span>MarkPoint</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        </h1>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
          Smart Civic Reporting
        </p>
      </div>

      <div className="absolute bottom-8 flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>INITIALIZING SENSORS & AI</span>
      </div>
    </div>
  );
};
