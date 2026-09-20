import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  AlertOctagon, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface StatsOverviewProps {
  tickets: CivicIssue[];
  spamPreventedCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  tickets,
  spamPreventedCount
}) => {
  const totalReports = tickets.length + spamPreventedCount;
  const activeTickets = tickets.filter(t => t.status !== 'VERIFIED_RESOLVED' && t.status !== 'RESOLVED_DEMO');
  const resolvedTickets = tickets.filter(t => t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO');
  const breachedTickets = tickets.filter(t => t.status === 'ESCALATED_SLA_BREACH');

  const totalUpvotes = tickets.reduce((acc, t) => acc + t.upvoteCount, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Spatial Anti-Spam Saved */}
      <div className="p-4 rounded-2xl glass-panel-glow border border-emerald-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between text-emerald-400 mb-1">
          <span className="text-[11px] font-bold tracking-wider uppercase">25m Anti-Spam</span>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {spamPreventedCount}
        </div>
        <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center space-x-1">
          <TrendingUp className="w-3 h-3" />
          <span>PostGIS ST_DWithin Deduplication</span>
        </div>
      </div>

      {/* 2. Active Grievances */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between text-cyan-400 mb-1">
          <span className="text-[11px] font-bold tracking-wider uppercase">Active Master Tickets</span>
          <MapPin className="w-4 h-4" />
        </div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {activeTickets.length}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          {totalUpvotes} Citizen Endorsements
        </div>
      </div>

      {/* 3. SLA Escalated Alerts */}
      <div className="p-4 rounded-2xl glass-panel-hazard border border-rose-500/30 relative overflow-hidden">
        <div className="flex items-center justify-between text-rose-400 mb-1">
          <span className="text-[11px] font-bold tracking-wider uppercase">L2 Escalated Breaches</span>
          <AlertOctagon className="w-4 h-4" />
        </div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {breachedTickets.length}
        </div>
        <div className="text-[11px] text-rose-400/80 mt-1">
          Statutory Alert to Commissioners
        </div>
      </div>

      {/* 4. Resolved & AI Verified */}
      <div className="p-4 rounded-2xl glass-panel border border-indigo-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between text-indigo-400 mb-1">
          <span className="text-[11px] font-bold tracking-wider uppercase">Verified Resolved</span>
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {resolvedTickets.length}
        </div>
        <div className="text-[11px] text-indigo-300 mt-1 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>No Fake Closures Verified</span>
        </div>
      </div>

    </div>
  );
};
