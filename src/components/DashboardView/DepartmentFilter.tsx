import React from 'react';
import { Filter, Building, Truck, Waves, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { IssueVertical } from '../../types/civic';

interface DepartmentFilterProps {
  selectedVertical: string;
  onSelectVertical: (vert: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  selectedVertical,
  onSelectVertical,
  selectedStatus,
  onSelectStatus
}) => {
  const verticals = [
    { id: 'ALL', label: 'All Departments', icon: Filter },
    { id: 'ROADS_MOBILITY', label: 'PWD / Roads', icon: Building },
    { id: 'SOLID_WASTE', label: 'Sanitation Wing', icon: Truck },
    { id: 'WATER_BODIES_ECOLOGY', label: 'SPCB / Drainage', icon: Waves },
    { id: 'CIVIC_ASSETS', label: 'Civic Assets', icon: ShieldCheck }
  ];

  const statuses = [
    { id: 'ALL', label: 'All Statuses' },
    { id: 'ACTIVE', label: 'Active Pipeline' },
    { id: 'WORK_SUBMITTED', label: 'Work Submitted' },
    { id: 'ESCALATED_SLA_BREACH', label: 'SLA Breached' },
    { id: 'VERIFIED_RESOLVED', label: 'Verified Resolved' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-slate-800 mb-6">
      
      {/* Vertical Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {verticals.map((v) => {
          const Icon = v.icon;
          const isSelected = selectedVertical === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelectVertical(v.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-1.5">
        <span className="text-[11px] text-slate-500 uppercase font-mono">Status:</span>
        <select
          value={selectedStatus}
          onChange={(e) => onSelectStatus(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};
