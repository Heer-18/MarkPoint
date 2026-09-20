import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, X, MapPin, Search, ChevronDown, Check, Crosshair } from 'lucide-react';

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
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812, state: 'Gujarat', defaultArea: 'Alkapuri & Sayajigunj' },
  { name: 'Rajkot', lat: 22.3039, lng: 70.8022, state: 'Gujarat', defaultArea: 'Kalawad Road & Yagnik Road' },
  { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369, state: 'Gujarat', defaultArea: 'Infocity & Sector 21' },
  { name: 'Bhavnagar', lat: 21.7645, lng: 72.1519, state: 'Gujarat', defaultArea: 'Waghawadi Road' },
  { name: 'Jamnagar', lat: 22.4707, lng: 70.0577, state: 'Gujarat', defaultArea: 'Digjam & Town Hall' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', defaultArea: 'Bandra & Andheri' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', defaultArea: 'Shivajinagar & Kothrud' },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra', defaultArea: 'Dharampeth & Civil Lines' },
  { name: 'Nashik', lat: 19.9975, lng: 73.7898, state: 'Maharashtra', defaultArea: 'College Road & Panchavati' },
  { name: 'Thane', lat: 19.2183, lng: 72.9781, state: 'Maharashtra', defaultArea: 'Ghubunder Road' },
  { name: 'Delhi NCR', lat: 28.6345, lng: 77.2182, state: 'Delhi', defaultArea: 'Connaught Place & Ring Road' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka', defaultArea: 'Indiranagar & Koramangala' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana', defaultArea: 'Hitec City & Banjara Hills' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', defaultArea: 'T. Nagar & Anna Nagar' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal', defaultArea: 'Salt Lake & Park Street' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', defaultArea: 'Malviya Nagar & C-Scheme' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', defaultArea: 'Hazratganj & Gomti Nagar' },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Punjab / Haryana', defaultArea: 'Sector 17 & 35' },
  { name: 'Indore', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', defaultArea: 'Vijay Nagar & Palasia' },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', defaultArea: 'MP Nagar & Arera Colony' },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, state: 'Bihar', defaultArea: 'Boring Road & Kankarbagh' },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala', defaultArea: 'MG Road & Kakkanad' },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', defaultArea: 'Beach Road & MVP Colony' },
  { name: 'Goa', lat: 15.2993, lng: 74.1240, state: 'Goa', defaultArea: 'Panaji & Margao' },
  { name: 'Dehradun', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand', defaultArea: 'Rajpur Road & Clock Tower' }
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITIES;
    const q = searchQuery.toLowerCase().trim();
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectCity = (cityName: string) => {
    onCitySelect(cityName);
    onSearchChange('');
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/80 px-3.5 pt-[max(env(safe-area-inset-top,0px),44px)] pb-2 transition-all">
      <div ref={containerRef} className="max-w-3xl mx-auto space-y-2">
        
        {/* Main Header & Search Row */}
        <div className="flex items-center space-x-2">
          
          {/* Clean MarkPoint App Logo (No outer box frame) */}
          <div className="flex items-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" fill="#10b981" />
            </svg>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 flex items-center bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 rounded-2xl shadow-lg px-3 py-1.5 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
            
            <button 
              type="button" 
              onClick={() => {
                onSearchChange('');
                setIsDropdownOpen(false);
              }}
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
              placeholder="Search city, ward or problem..."
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

          {/* City Selector Button in Top Right */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Switch City or Use GPS Location"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-700/90 text-xs font-bold text-emerald-400 shadow-md transition-all flex-shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="whitespace-nowrap font-bold">{selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-0.5" />
          </button>
        </div>

        {/* City Dropdown & Search Suggestions Menu */}
        {isDropdownOpen && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50 max-h-80 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {searchQuery ? `Matching Cities (${filteredCities.length})` : 'Select City'}
              </span>
              <button
                type="button"
                onClick={() => {
                  onLocateMe();
                  setIsDropdownOpen(false);
                  onSearchChange('');
                }}
                className="text-xs text-emerald-400 font-bold hover:underline flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting City...' : 'Use Current GPS'}</span>
              </button>
            </div>

            {/* City Grid */}
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredCities.map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => handleSelectCity(city.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      selectedCity.toLowerCase() === city.name.toLowerCase()
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{city.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">{city.state}</div>
                    </div>
                    {selectedCity.toLowerCase() === city.name.toLowerCase() && (
                      <Check className="w-4 h-4 text-emerald-400 ml-1 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-300">
                  No predefined city found for "<strong className="text-emerald-400">{searchQuery}</strong>"
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectCity(searchQuery.trim())}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Set Location to "{searchQuery.trim()}"
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
