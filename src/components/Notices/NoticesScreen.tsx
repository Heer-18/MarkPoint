import React from 'react';
import { Mail, Bell, AlertTriangle, CheckCircle2, Calendar, MapPin, Building2 } from 'lucide-react';

export const NoticesScreen: React.FC<{ selectedCity: string }> = ({ selectedCity }) => {
  const notices = [
    {
      id: 'NTC-01',
      title: 'Monsoon Stormwater Drain De-silting Drive',
      department: 'Drainage & Flood Control Wing',
      date: 'Today • 09:00 AM',
      type: 'URGENT',
      content: 'Intensive mechanical de-silting of trunk stormwater drains is underway across Sector 4 to 8. Please report any clogged culverts or open manholes immediately.',
      location: 'Central Arterial Zone'
    },
    {
      id: 'NTC-02',
      title: 'Night Asphalt Patching on Outer Ring Road',
      department: 'Public Works Department (PWD)',
      date: 'Yesterday',
      type: 'UPDATE',
      content: 'Mastic cold-mix pothole repairs will be carried out between 11:00 PM and 05:00 AM. Lane 2 will experience rolling diversions.',
      location: 'Outer Ring Road Corridor'
    },
    {
      id: 'NTC-03',
      title: 'Community Waste Segregation & Collection Schedule',
      department: 'Health & Sanitation Wing',
      date: '2 days ago',
      type: 'INFO',
      content: 'New 1.1m³ automated compactor collection bins have been deployed in wholesale market areas. All wet waste must be segregated at source.',
      location: 'Wholesale Market Ward'
    }
  ];

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-white">
          Municipal Notices & Broadcasts
        </h2>
        <p className="text-xs text-slate-400">
          Official civic updates from {selectedCity} Municipal Corporation
        </p>
      </div>

      <div className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                notice.type === 'URGENT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                notice.type === 'UPDATE' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {notice.type}
              </span>
              <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{notice.date}</span>
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">
              {notice.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
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
          </div>
        ))}
      </div>
    </div>
  );
};
