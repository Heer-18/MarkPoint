import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Filter,
  MessageSquare
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface CommunityFeedProps {
  tickets: CivicIssue[];
  onUpvote: (ticketId: string) => void;
  onSelectTicket: (ticket: CivicIssue) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  tickets,
  onUpvote,
  onSelectTicket
}) => {
  const [filterVertical, setFilterVertical] = useState<string>('ALL');

  const filteredTickets = tickets.filter((t) => {
    if (filterVertical === 'ALL') return true;
    return t.vertical === filterVertical;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Neighborhood Activity Feed</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
              Live Feed
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time citizen upvotes & municipal resolution status
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {['ALL', 'ROADS_MOBILITY', 'SOLID_WASTE', 'WATER_BODIES_ECOLOGY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterVertical(tab)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterVertical === tab
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Issues' :
               tab === 'ROADS_MOBILITY' ? 'Roads' :
               tab === 'SOLID_WASTE' ? 'Waste' : 'Water'}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => {
          const isResolved = ticket.status === 'VERIFIED_RESOLVED' || ticket.status === 'RESOLVED_DEMO';
          const isBreached = ticket.status === 'ESCALATED_SLA_BREACH';

          return (
            <div
              key={ticket.id}
              className="p-4 rounded-2xl glass-panel hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Card Top: Image + Status Tag */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.subCategory}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Overlay Badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                    {isResolved ? (
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Fixed & AI Verified</span>
                      </span>
                    ) : isBreached ? (
                      <span className="bg-rose-950/80 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        <span>SLA Escalated (L2)</span>
                      </span>
                    ) : (
                      <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>In Progress</span>
                      </span>
                    )}
                  </div>

                  {/* Taxonomy code */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-slate-300 border border-slate-700">
                    #{ticket.taxonomyId}
                  </div>
                </div>

                {/* Title & Info */}
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {ticket.subCategory}
                </h4>

                <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{ticket.address}</span>
                </p>

                {ticket.citizenVoiceTranscript && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-lg mt-2 border border-slate-800/80 line-clamp-2">
                    "{ticket.citizenVoiceTranscript}"
                  </p>
                )}
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                {/* Upvote Button */}
                <button
                  onClick={() => onUpvote(ticket.id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ticket.upvoteCount} Upvotes</span>
                </button>

                {/* Inspect Details Button */}
                <button
                  onClick={() => onSelectTicket(ticket)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
