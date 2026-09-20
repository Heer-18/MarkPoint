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
  Building2
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';
import { ProblemMap } from '../Common/ProblemMap';

interface RequestsScreenProps {
  tickets: CivicIssue[];
  onSelectTicket: (ticket: CivicIssue) => void;
  onUpvoteTicket: (ticketId: string) => void;
  selectedCity: string;
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({
  tickets,
  onSelectTicket,
  onUpvoteTicket,
  selectedCity
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedVertical, setSelectedVertical] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [filterText, setFilterText] = useState<string>('');

  const filteredTickets = tickets.filter((t) => {
    if (selectedVertical !== 'ALL' && t.vertical !== selectedVertical) return false;
    if (selectedStatus === 'ACTIVE' && (t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO')) return false;
    if (selectedStatus === 'FIXED' && t.status !== 'VERIFIED_RESOLVED' && t.status !== 'RESOLVED_DEMO') return false;
    if (selectedStatus === 'BREACHED' && t.status !== 'ESCALATED_SLA_BREACH') return false;
    if (filterText && !t.subCategory.toLowerCase().includes(filterText.toLowerCase()) && !t.address.toLowerCase().includes(filterText.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & View Switcher */}
      <div className="flex items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white">
            Civic Problem Map & Requests
          </h2>
          <p className="text-xs text-slate-400">
            {filteredTickets.length} issues reported in {selectedCity}
          </p>
        </div>

        {/* Map / List View Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('map')}
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
            onClick={() => setViewMode('list')}
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

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Issues' },
          { id: 'ROADS_MOBILITY', label: '🛣️ Roads & Potholes' },
          { id: 'SOLID_WASTE', label: '🗑️ Garbage & Bins' },
          { id: 'WATER_BODIES_ECOLOGY', label: '🌊 Water & Drains' },
          { id: 'CIVIC_ASSETS', label: '🌳 Fallen Trees & Assets' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedVertical(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedVertical === tab.id
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
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
            tickets={filteredTickets}
            selectedTicket={null}
            onSelectTicket={onSelectTicket}
            heightClass="h-[420px] sm:h-[480px]"
          />

          {/* Quick List Below Map */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Recent Issues Near You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredTickets.slice(0, 4).map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.subCategory}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {ticket.subCategory}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {ticket.address}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpvoteTicket(ticket.id);
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/40 text-emerald-400 text-xs font-bold transition-all ml-2"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{ticket.upvoteCount}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 2: List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const isResolved = ticket.status === 'VERIFIED_RESOLVED' || ticket.status === 'RESOLVED_DEMO';
            const isBreached = ticket.status === 'ESCALATED_SLA_BREACH';

            return (
              <div
                key={ticket.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.subCategory}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">
                        {ticket.subCategory}
                      </span>
                      {isResolved ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                          Fixed
                        </span>
                      ) : isBreached ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold animate-pulse">
                          Escalated
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                          In Progress
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{ticket.address}</span>
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                      <span>Assigned: {ticket.assignedDepartment}</span>
                      <span>•</span>
                      <span>SLA: {ticket.slaHours}h</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    type="button"
                    onClick={() => onUpvoteTicket(ticket.id)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-emerald-950/40 border border-slate-700 text-emerald-300 text-xs font-bold transition-all"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{ticket.upvoteCount} Upvotes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTicket(ticket)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
