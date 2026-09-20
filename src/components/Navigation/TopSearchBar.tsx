import React from 'react';
import { ArrowLeft, X, MapPin, Search, Crosshair } from 'lucide-react';

interface TopSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCitySelect: (city: string) => void;
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const CITIES = [
  { name: 'Surat', lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  { name: 'Delhi NCR', lat: 28.6345, lng: 77.2182, state: 'Delhi' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' }
];

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCitySelect,
  onLocateMe,
  isLocating
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-3xl mx-auto flex items-center space-x-2">
        
        {/* Search Bar Container matching user's screenshot */}
        <div className="relative flex-1 flex items-center bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 rounded-2xl shadow-lg px-3 py-2 transition-all focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20">
          
          {/* Back / Search Icon */}
          <button 
            type="button" 
            onClick={() => onSearchChange('')}
            className="text-slate-400 hover:text-slate-200 mr-2.5 transition-colors"
          >
            {searchQuery ? (
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search city, street or neighborhood (e.g. Surat, Ring Road)..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-100 placeholder-slate-400 focus:outline-none"
          />

          {/* Clear Button */}
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

          {/* Active City Pill */}
          <div className="hidden sm:flex items-center space-x-1 pl-2 ml-2 border-l border-slate-700 text-xs text-emerald-400 font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{selectedCity}</span>
          </div>
        </div>

        {/* GPS Current Location Quick Button */}
        <button
          type="button"
          onClick={onLocateMe}
          title="Use current GPS location"
          className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all shadow-md flex-shrink-0"
        >
          <Crosshair className={`w-5 h-5 ${isLocating ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* City Dropdown Filter */}
      {isDropdownOpen && (
        <div className="max-w-3xl mx-auto mt-2 p-2 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Popular Cities & Municipal Wards
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1">
            {CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  onCitySelect(city.name);
                  onSearchChange(city.name);
                  setIsDropdownOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                  selectedCity === city.name
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
