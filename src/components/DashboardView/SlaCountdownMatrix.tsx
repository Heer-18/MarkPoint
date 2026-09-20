import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight, 
  Building2, 
  AlertTriangle
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface SlaCountdownMatrixProps {
  tickets: CivicIssue[];
  onSelectTicket: (ticket: CivicIssue) => void;
}

export const SlaCountdownMatrix: React.FC<SlaCountdownMatrixProps> = ({
  tickets,
  onSelectTicket
}) => {
  const [, setTick] = useState(0);

  // Re-render every second for real-time countdown clocks
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeRemaining = (deadlineIso: string) => {
    const diff = new Date(deadlineIso).getTime() - Date.now();
    if (diff <= 0) {
      const pastSeconds = Math.abs(Math.floor(diff / 1000));
      const hours = Math.floor(pastSeconds / 3600);
      const mins = Math.floor((pastSeconds % 3600) / 60);
      return { isBreached: true, text: `BREACHED (${hours}h ${mins}m ago)` };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return {
      isBreached: false,
      text: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    };
  };

  const activeTickets = tickets.filter(
    (t) => t.status !== 'VERIFIED_RESOLVED' && t.status !== 'RESOLVED_DEMO'
  );

  return (
    <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Live SLA Countdown Matrix & Statutory Escalations
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {activeTickets.length} Monitored Pipelines
        </span>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {activeTickets.map((ticket) => {
          const { isBreached, text } = calculateTimeRemaining(ticket.slaDeadline);

          return (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                isBreached
                  ? 'bg-rose-950/40 hover:bg-rose-900/50 border-rose-500/40 shadow-rose-950/20 shadow-lg'
                  : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800">
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.subCategory}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-200">
                      #{ticket.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {ticket.taxonomyId}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">
                      👍 {ticket.upvoteCount}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white mt-0.5">
                    {ticket.subCategory}
                  </p>

                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-1">
                    <Building2 className="w-3 h-3 text-indigo-400" />
                    <span className="truncate">{ticket.assignedDepartment}</span>
                  </div>
                </div>
              </div>

              {/* Countdown / Escalation Badge */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono sm:text-right">
                  SLA: {ticket.slaHours}h Window
                </div>

                <div className="flex items-center space-x-1 mt-0.5">
                  {isBreached ? (
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold animate-pulse shadow-md shadow-rose-900/40">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>{text}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{text}</span>
                    </div>
                  )}
                </div>

                {isBreached && (
                  <div className="text-[9px] text-rose-300 font-bold uppercase tracking-wider mt-1 sm:text-right">
                    ⚡ Auto-Escalated to {ticket.l2EscalationRole}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
