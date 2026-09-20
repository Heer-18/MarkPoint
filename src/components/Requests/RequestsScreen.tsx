import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  List, 
  ThumbsUp, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Search,
  Eye,
  Building2,
  Check
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';
import { ProblemMap } from '../Common/ProblemMap';
import { LikeReportConfirmModal } from '../CitizenView/LikeReportConfirmModal';
import { triggerHapticImpact, triggerHapticSelection } from '../../services/hapticsService';

interface RequestsScreenProps {
  tickets: CivicIssue[];
  onSelectTicket: (ticket: CivicIssue) => void;
  onUpvoteTicket: (ticketId: string) => void;
  selectedCity: string;
  centerCoords?: { lat: number; lng: number };
  likedTickets?: string[];
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({
  tickets,
  onSelectTicket,
  onUpvoteTicket,
  selectedCity,
  centerCoords,
  likedTickets = []
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedVertical, setSelectedVertical] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [filterText, setFilterText] = useState<string>('');
  const [pendingLikeTicket, setPendingLikeTicket] = useState<CivicIssue | null>(null);

  const handleLikeClick = (e: React.MouseEvent, ticket: CivicIssue) => {
    e.stopPropagation();
    const isAlreadyLiked = likedTickets.includes(ticket.id);
    if (isAlreadyLiked) {
      // Direct 2nd click removes like and removes from profile
      onUpvoteTicket(ticket.id);
    } else {
      // First click opens prompt/popup asking user to co-report and add to profile
      setPendingLikeTicket(ticket);
    }
  };

  const handleConfirmCoReport = (ticket: CivicIssue) => {
    onUpvoteTicket(ticket.id);
    setPendingLikeTicket(null);
  };

  const filteredTickets = tickets.filter((t) => {
    if (selectedVertical !== 'ALL') {
      if (selectedVertical === 'OTHER' && (t.vertical === 'ROADS_MOBILITY' || t.vertical === 'SOLID_WASTE' || t.vertical === 'WATER_BODIES_ECOLOGY' || t.vertical === 'CIVIC_ASSETS')) {
        return false;
      } else if (selectedVertical !== 'OTHER' && t.vertical !== selectedVertical) {
        return false;
      }
    }
    if (selectedStatus === 'ACTIVE' && (t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO')) return false;
    if (selectedStatus === 'FIXED' && t.status !== 'VERIFIED_RESOLVED' && t.status !== 'RESOLVED_DEMO') return false;
    if (selectedStatus === 'BREACHED' && t.status !== 'ESCALATED_SLA_BREACH') return false;
    if (filterText && !t.subCategory.toLowerCase().includes(filterText.toLowerCase()) && !t.address.toLowerCase().includes(filterText.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Sort so that tickets in the currently selected city appear at the top, while keeping all location tickets accessible
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aMatches = a.address.toLowerCase().includes(selectedCity.toLowerCase()) ? 1 : 0;
    const bMatches = b.address.toLowerCase().includes(selectedCity.toLowerCase()) ? 1 : 0;
    return bMatches - aMatches;
  });

  return (
    <div className="space-y-4 pb-28 max-w-3xl mx-auto animate-in fade-in duration-300 overflow-x-hidden">
      
      {/* Header & View Switcher */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black tracking-tight text-white truncate">
            Civic Problem Map & Requests
          </h2>
          <p className="text-xs text-slate-400 truncate">
            {filteredTickets.length} total issues across all locations
          </p>
        </div>

        {/* Map / List View Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 flex-shrink-0">
          <button
            type="button"
            onClick={() => { triggerHapticSelection(); setViewMode('map'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
          
          <button
            type="button"
            onClick={() => { triggerHapticSelection(); setViewMode('list'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {[
          { id: 'ALL', label: 'All Issues' },
          { id: 'ROADS_MOBILITY', label: '🛣️ Roads & Potholes' },
          { id: 'SOLID_WASTE', label: '🗑️ Garbage & Bins' },
          { id: 'WATER_BODIES_ECOLOGY', label: '🌊 Water & Drains' },
          { id: 'CIVIC_ASSETS', label: '💡 Power & Trees' },
          { id: 'OTHER', label: '📌 Other' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { triggerHapticSelection(); setSelectedVertical(tab.id); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedVertical === tab.id
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View 1: Map View */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <ProblemMap
            tickets={sortedTickets}
            selectedTicket={null}
            onSelectTicket={(t) => { triggerHapticImpact('light'); onSelectTicket(t); }}
            centerCoords={centerCoords}
            heightClass="h-[420px] sm:h-[480px]"
          />

          {/* Quick List Below Map */}
          <div className="space-y-2">
            {sortedTickets.length > 0 ? (
              <>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Issues ({sortedTickets.length} total, {selectedCity} first)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sortedTickets.slice(0, 6).map((ticket) => {
                    const isLiked = likedTickets.includes(ticket.id);
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                        className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between shadow-md overflow-hidden"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                          <img
                            src={ticket.imageUrl}
                            alt={ticket.subCategory}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate break-words">
                              {ticket.subCategory}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate break-words">
                              {ticket.address}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleLikeClick(e, ticket)}
                          title={isLiked ? "Click to remove like" : "Click to like / upvote"}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                            isLiked 
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{ticket.upvoteCount}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-2.5 shadow-xl">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">No Issues Reported in this Category</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    There are currently no active complaints for this category. Area status is clear!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {sortedTickets.length > 0 ? (
            sortedTickets.map((ticket) => {
              const isResolved = ticket.status === 'VERIFIED_RESOLVED' || ticket.status === 'RESOLVED_DEMO';
              const isBreached = ticket.status === 'ESCALATED_SLA_BREACH';
              const isLiked = likedTickets.includes(ticket.id);

              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer active:scale-[0.99] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg overflow-hidden"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1 w-full sm:w-auto">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700">
                      <img
                        src={ticket.imageUrl}
                        alt={ticket.subCategory}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-xs font-bold text-white truncate max-w-[200px] break-words">
                          {ticket.subCategory}
                        </span>
                        {isResolved ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex-shrink-0">
                            Fixed
                          </span>
                        ) : isBreached ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold animate-pulse flex-shrink-0">
                            Escalated
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex-shrink-0">
                            In Progress
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1 truncate break-words">
                        <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{ticket.address}</span>
                      </p>

                      <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-slate-500 mt-1">
                        <span className="truncate max-w-[170px]">{ticket.assignedDepartment}</span>
                        <span>•</span>
                        <span className="flex-shrink-0">SLA: {ticket.slaHours}h</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleLikeClick(e, ticket)}
                      title={isLiked ? "Click to remove like" : "Click to like / co-report"}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                        isLiked
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{ticket.upvoteCount} {isLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTicket(ticket)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex-shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-2.5 shadow-xl">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Issues Reported in this Category</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                No active civic complaints match the selected filter in <strong className="text-emerald-400">{selectedCity}</strong>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal when liking an issue to co-report and add to profile */}
      {pendingLikeTicket && (
        <LikeReportConfirmModal
          isOpen={!!pendingLikeTicket}
          ticket={pendingLikeTicket}
          onConfirmReport={handleConfirmCoReport}
          onCancel={() => setPendingLikeTicket(null)}
        />
      )}

    </div>
  );
};
