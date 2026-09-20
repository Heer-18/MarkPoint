import React, { useState } from 'react';
import { Mail, Bell, AlertTriangle, CheckCircle2, Calendar, MapPin, Building2, X, ChevronRight, Info, Zap } from 'lucide-react';
import { triggerHapticImpact, triggerHapticSelection } from '../../services/hapticsService';

interface Notice {
  id: string;
  title: string;
  department: string;
  date: string;
  type: 'URGENT' | 'UPDATE' | 'INFO';
  content: string;
  location: string;
  details?: string;
}

interface NoticesScreenProps {
  selectedCity: string;
  onNoticeRead?: (id: string) => void;
  readNoticeIds?: string[];
}

export const NoticesScreen: React.FC<NoticesScreenProps> = ({ selectedCity, onNoticeRead, readNoticeIds = [] }) => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const notices: Notice[] = [
    {
      id: 'NTC-01',
      title: 'Monsoon Stormwater Drain De-silting Drive',
      department: 'Drainage & Flood Control Wing',
      date: 'Today • 09:00 AM',
      type: 'URGENT',
      content: 'Intensive mechanical de-silting of trunk stormwater drains is underway across Sector 4 to 8. Please report any clogged culverts or open manholes immediately.',
      location: 'Central Arterial Zone',
      details: `Intensive mechanical de-silting of trunk stormwater drains is currently underway across Sector 4 to 8 in ${selectedCity}.\n\nKey details:\n• De-silting machines deployed at 12 critical locations\n• Estimated completion: 3 days\n• Citizens should avoid parking near drain covers\n• Report open manholes via the MarkPoint app immediately\n\nFor emergencies, contact the Drainage Control Room at the municipal helpline.`
    },
    {
      id: 'NTC-02',
      title: 'Night Asphalt Patching on Outer Ring Road',
      department: 'Public Works Department (PWD)',
      date: 'Yesterday',
      type: 'UPDATE',
      content: 'Mastic cold-mix pothole repairs will be carried out between 11:00 PM and 05:00 AM. Lane 2 will experience rolling diversions.',
      location: 'Outer Ring Road Corridor',
      details: `Mastic cold-mix pothole repairs will be carried out on the Outer Ring Road between 11:00 PM and 05:00 AM for the next 5 nights.\n\nAffected areas:\n• Lane 2 (inbound) from Junction A to Junction D\n• Rolling diversions in place — expect 5–10 minute delays\n• Heavy vehicles to use alternate route via SH-7\n\nWork is being done in off-peak hours to minimize disruption. The ${selectedCity} Municipal Corporation appreciates your cooperation.`
    },
    {
      id: 'NTC-03',
      title: 'Community Waste Segregation & Collection Schedule',
      department: 'Health & Sanitation Wing',
      date: '2 days ago',
      type: 'INFO',
      content: 'New 1.1m³ automated compactor collection bins have been deployed in wholesale market areas. All wet waste must be segregated at source.',
      location: 'Wholesale Market Ward',
      details: `New 1.1m³ automated compactor collection bins have been deployed across ${selectedCity}'s wholesale market areas.\n\nWhat you need to do:\n• Segregate wet waste (kitchen, food) separately\n• Dry recyclables (plastic, paper, metal) in the blue bin\n• Hazardous waste (batteries, medicines) in the red bin\n\nCollection timings:\n• Wet waste: 6:00 AM – 8:00 AM daily\n• Dry waste: Mondays & Thursdays\n\nNon-compliance may attract a fine under the ${selectedCity} Municipal Solid Waste Management Bye-laws.`
    }
  ];

  const handleOpen = (notice: Notice) => {
    triggerHapticImpact('light');
    setSelectedNotice(notice);
    if (onNoticeRead && !readNoticeIds.includes(notice.id)) {
      onNoticeRead(notice.id);
    }
  };

  const typeConfig = {
    URGENT: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> },
    UPDATE: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: <Bell className="w-3.5 h-3.5 text-cyan-400" /> },
    INFO:   { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: <Info className="w-3.5 h-3.5 text-emerald-400" /> },
  };

  const unreadCount = notices.filter(n => !readNoticeIds.includes(n.id)).length;

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-white">
          Municipal Notices & Broadcasts
        </h2>
        <p className="text-xs text-slate-400">
          Official civic updates from {selectedCity} Municipal Corporation
          {unreadCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      <div className="space-y-3">
        {notices.map((notice) => {
          const isRead = readNoticeIds.includes(notice.id);
          const cfg = typeConfig[notice.type];
          return (
            <button
              key={notice.id}
              type="button"
              onClick={() => handleOpen(notice)}
              className={`w-full text-left p-4 rounded-2xl border transition-all shadow-lg space-y-2 cursor-pointer active:scale-[0.99] ${
                isRead
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/90 border-slate-700 hover:border-slate-600 ring-1 ring-cyan-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    {cfg.icon}
                    <span>{notice.type}</span>
                  </span>
                  {!isRead && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                  )}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{notice.date}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>

              <h3 className={`text-sm font-bold ${isRead ? 'text-slate-300' : 'text-white'}`}>
                {notice.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {notice.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{notice.department}</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{notice.location}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 pt-[max(env(safe-area-inset-top,24px),24px)] pb-[max(env(safe-area-inset-bottom,24px),24px)] animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 ${
              selectedNotice.type === 'URGENT' ? 'bg-rose-950/40' :
              selectedNotice.type === 'UPDATE' ? 'bg-cyan-950/40' : 'bg-emerald-950/30'
            }`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border ${typeConfig[selectedNotice.type].bg} ${typeConfig[selectedNotice.type].text} ${typeConfig[selectedNotice.type].border}`}>
                    {typeConfig[selectedNotice.type].icon}
                    <span>{selectedNotice.type}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{selectedNotice.date}</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{selectedNotice.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="flex-shrink-0 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              {/* Department + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Department</div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="leading-tight font-medium">{selectedNotice.department}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Location</div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="leading-tight font-medium">{selectedNotice.location}</span>
                  </div>
                </div>
              </div>

              {/* Full Details */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Notice</div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {selectedNotice.details || selectedNotice.content}
                </div>
              </div>

              {/* CTA */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center space-x-2.5 text-[11px] text-emerald-300">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>See a related issue? Use the <strong>Report</strong> tab to submit a complaint.</span>
              </div>
            </div>

            {/* Modal Footer with Close Button */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg transition-all text-center active:scale-95"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
