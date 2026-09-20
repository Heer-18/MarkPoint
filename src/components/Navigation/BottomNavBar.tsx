import React from 'react';
import { Home, Mail, Plus, ListFilter, User, MapPin } from 'lucide-react';

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-1.5 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Notices */}
        <button
          type="button"
          onClick={() => onTabChange('notices')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'notices'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Notices</span>
          <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* 3. New Request (Prominent Center Button) */}
        <button
          type="button"
          onClick={() => onTabChange('new_request')}
          className="flex flex-col items-center -mt-5 group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-1">Report</span>
        </button>

        {/* 4. Requests / Problem Map */}
        <button
          type="button"
          onClick={() => onTabChange('requests')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'requests'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListFilter className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Requests</span>
          {unresolvedCount > 0 && (
            <span className="absolute top-1 right-2 px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full">
              {unresolvedCount}
            </span>
          )}
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>

      </div>
    </nav>
  );
};
