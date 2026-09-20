import React, { useState } from 'react';
import { ArrowLeft, X, MapPin, Search, ChevronDown, Check, Crosshair, Sparkles } from 'lucide-react';

interface TopSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCitySelect: (city: string) => void;
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const CITIES = [
  { name: 'Surat', lat: 21.1702, lng: 72.8311, state: 'Gujarat', defaultArea: 'Majura Gate & Ring Road' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat', defaultArea: 'SG Highway & Riverfront' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', defaultArea: 'Bandra & Andheri' },
  { name: 'Delhi NCR', lat: 28.6345, lng: 77.2182, state: 'Delhi', defaultArea: 'Connaught Place & Ring Road' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka', defaultArea: 'Indiranagar & Koramangala' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', defaultArea: 'Shivajinagar & Kothrud' }
];

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCitySelect,
  onLocateMe,
  isLocating
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/80 px-4 pt-safe pt-3 pb-2.5 transition-all">
      <div className="max-w-3xl mx-auto space-y-2">
        
        {/* Main Header & Search Row */}
        <div className="flex items-center space-x-2.5">
          
          {/* MarkPoint App Logo Icon */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300 font-black text-xs tracking-tight">
                  MP
                </span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 flex items-center bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 rounded-2xl shadow-lg px-3.5 py-2 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
            
            <button 
              type="button" 
              onClick={() => onSearchChange('')}
              className="text-slate-400 hover:text-slate-200 mr-2 transition-colors flex-shrink-0"
            >
              {searchQuery ? (
                <ArrowLeft className="w-4 h-4 text-slate-300" />
              ) : (
                <Search className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search problem, street or ward..."
              className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-100 placeholder-slate-400 focus:outline-none min-w-0"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setIsDropdownOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City / GPS Selector Button in Top Right */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Switch City or Use GPS Location"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-700/90 text-xs font-bold text-emerald-400 shadow-md transition-all flex-shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate max-w-[80px]">{selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          </button>
        </div>

        {/* City Dropdown & GPS Menu */}
        {isDropdownOpen && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
            <div className="flex items-center justify-between px-1 mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Your City
              </span>
              <button
                type="button"
                onClick={() => {
                  onLocateMe();
                  setIsDropdownOpen(false);
                }}
                className="text-xs text-emerald-400 font-bold hover:underline flex items-center space-x-1 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting GPS...' : 'Use Current GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CITIES.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => {
                    onCitySelect(city.name);
                    onSearchChange('');
                    setIsDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    selectedCity === city.name
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-bold">{city.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">{city.state}</div>
                  </div>
                  {selectedCity === city.name && (
                    <Check className="w-4 h-4 text-emerald-400 ml-1 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
