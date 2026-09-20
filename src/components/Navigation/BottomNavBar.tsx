import React from 'react';
import { Home, Mail, Plus, ListFilter, User } from 'lucide-react';

export type NavTab = 'home' | 'notices' | 'new_request' | 'requests' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unresolvedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  unresolvedCount = 0
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 pt-1.5 pb-6 sm:pb-3 px-4 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-between px-2">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'home'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Home</span>
        </button>

        {/* 2. Notices */}
        <button
          type="button"
          onClick={() => onTabChange('notices')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all relative ${
            activeTab === 'notices'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Notices</span>
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950" />
        </button>

        {/* 3. New Request (Prominent Center Action) */}
        <button
          type="button"
          onClick={() => onTabChange('new_request')}
          className="flex flex-col items-center -mt-6 group focus:outline-none"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/40 group-hover:scale-110 group-active:scale-95 transition-all border-4 border-slate-950">
            <Plus className="w-8 h-8 stroke-[3]" />
          </div>
          <span className="text-[11px] font-bold text-emerald-400 mt-0.5">Report</span>
        </button>

        {/* 4. Requests / Problem Map */}
        <button
          type="button"
          onClick={() => onTabChange('requests')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all relative ${
            activeTab === 'requests'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListFilter className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Requests</span>
          {unresolvedCount > 0 && (
            <span className="absolute top-1 right-2.5 px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full shadow-sm">
              {unresolvedCount}
            </span>
          )}
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'profile'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Profile</span>
        </button>

      </div>
    </nav>
  );
};
