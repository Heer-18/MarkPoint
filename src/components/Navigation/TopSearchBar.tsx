import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, MapPin, Search, ChevronDown, Check, Crosshair, Loader2, Navigation } from 'lucide-react';
import { searchPlacesLive, CityLocation, POPULAR_CITIES } from '../../services/citySearchService';

export { POPULAR_CITIES as CITIES };

interface TopSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCitySelect: (city: string, coords?: { lat: number; lng: number }) => void;
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCitySelect,
  onLocateMe,
  isLocating
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [searchResults, setSearchResults] = useState<CityLocation[]>(POPULAR_CITIES.slice(0, 12));
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<any>(null);

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

  // Live place search with debounce (Google Maps style)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(POPULAR_CITIES.slice(0, 12));
      setIsSearchingLive(false);
      return;
    }

    setIsSearchingLive(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchPlacesLive(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.warn('Place search error:', err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 200);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelectPlace = (place: CityLocation) => {
    onCitySelect(place.name, { lat: place.lat, lng: place.lng });
    onSearchChange('');
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/80 px-3.5 pt-[max(env(safe-area-inset-top,0px),44px)] pb-2 transition-all">
      <div ref={containerRef} className="max-w-3xl mx-auto space-y-2">
        
        {/* Main Header & Search Row */}
        <div className="flex items-center space-x-2">
          
          {/* Clean MarkPoint App Logo */}
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
              placeholder="Search any city, town, ward (e.g. Nadiad)..."
              className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-100 placeholder-slate-400 focus:outline-none min-w-0"
            />

            {isSearchingLive && (
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin mr-1 flex-shrink-0" />
            )}

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
            <span className="whitespace-nowrap font-bold max-w-[110px] truncate">{selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-0.5" />
          </button>
        </div>

        {/* Google Maps-Style Autocomplete Results List */}
        {isDropdownOpen && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50 max-h-80 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>{searchQuery ? `Places matching "${searchQuery}"` : 'Popular Cities'}</span>
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

            {/* Google Maps Style Autocomplete Row Items */}
            <div className="space-y-1 pt-1">
              {searchResults.map((place, idx) => {
                const isSelected = selectedCity.toLowerCase() === place.name.toLowerCase();
                return (
                  <button
                    key={`${place.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelectPlace(place)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'hover:bg-slate-800 text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white truncate">
                            {place.name}
                          </span>
                          {place.type && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                              {place.type}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {place.fullName}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 ml-2 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
