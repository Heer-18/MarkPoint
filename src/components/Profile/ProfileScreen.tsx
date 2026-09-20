import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  ThumbsUp, 
  MapPin, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  Lock,
  Eye,
  FileText,
  Sparkles
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface ProfileScreenProps {
  tickets: CivicIssue[];
  spamPreventedCount: number;
  onOpenVerificationStudio: (ticket: CivicIssue) => void;
  onSelectTicket: (ticket: CivicIssue) => void;
  selectedCity: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  tickets,
  spamPreventedCount,
  onOpenVerificationStudio,
  onSelectTicket,
  selectedCity
}) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('heer.patel@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Heer Patel');
  const [activeReportTab, setActiveReportTab] = useState<'ALL' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');

  // Filter user's own reports (reports with reporterId 'usr-current' or all tickets)
  const myReports = tickets.filter(
    (t) => t.reporterId === 'usr-current' || t.reporterName.includes('Heer')
  );

  const pendingCount = myReports.filter((t) => t.status !== 'VERIFIED_RESOLVED').length;
  const resolvedCount = myReports.filter((t) => t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO').length;

  const filteredReports = myReports.filter((t) => {
    if (activeReportTab === 'IN_PROGRESS') return t.status !== 'VERIFIED_RESOLVED' && t.status !== 'RESOLVED_DEMO';
    if (activeReportTab === 'RESOLVED') return t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO';
    return true;
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="space-y-5 pb-28 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. If Not Logged In: Interactive Login / Register Form */}
      {!isLoggedIn ? (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              MP
            </div>
            <h2 className="text-xl font-bold text-white pt-2">
              {authMode === 'login' ? 'Welcome Back to MarkPoint' : 'Create a MarkPoint Account'}
            </h2>
            <p className="text-xs text-slate-400">
              Track your reported potholes, garbage cleanups, and community updates
            </p>
          </div>

          {/* Login / Register Toggle */}
          <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Heer Patel"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@surat.org"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all mt-2"
            >
              {authMode === 'login' ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>
        </div>
      ) : (
        /* 2. Logged In Profile View */
        <>
          {/* Citizen Account Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
                  {name.split(' ').map((n) => n[0]).join('')}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">{name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Verified Citizen
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>{email}</span>
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => setIsLoggedIn(false)}
                title="Sign Out"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-xl font-black text-emerald-400">{myReports.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">My Submitted Reports</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-xl font-black text-cyan-400">{resolvedCount}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Verified Resolved</div>
              </div>
            </div>
          </div>

          {/* 3. My Submitted Reports with Process Tracking */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  My Submitted Reports ({myReports.length})
                </h3>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveReportTab('ALL')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeReportTab === 'ALL'
                      ? 'bg-slate-800 text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({myReports.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('IN_PROGRESS')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeReportTab === 'IN_PROGRESS'
                      ? 'bg-slate-800 text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Active ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('RESOLVED')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activeReportTab === 'RESOLVED'
                      ? 'bg-slate-800 text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fixed ({resolvedCount})
                </button>
              </div>
            </div>

            {/* List of User's Reports */}
            {filteredReports.length > 0 ? (
              <div className="space-y-2.5">
                {filteredReports.map((report) => {
                  const isDone = report.status === 'VERIFIED_RESOLVED' || report.status === 'RESOLVED_DEMO';
                  const isSubmitted = report.status === 'WORK_SUBMITTED';

                  return (
                    <div
                      key={report.id}
                      onClick={() => onSelectTicket(report)}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={report.imageUrl}
                          alt={report.subCategory}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-700"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white truncate">
                              {report.subCategory}
                            </span>
                            
                            {/* Process Status Badge */}
                            {isDone ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center space-x-1 flex-shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Fixed & Verified</span>
                              </span>
                            ) : isSubmitted ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center space-x-1 flex-shrink-0">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>Fix Submitted</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center space-x-1 flex-shrink-0">
                                <Clock className="w-3 h-3 text-cyan-400" />
                                <span>In Progress</span>
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {report.address}
                          </p>

                          <div className="text-[10px] text-slate-500 mt-1">
                            Assigned to {report.assignedDepartment} • SLA {report.slaHours}h
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(report);
                        }}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex-shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-1">
                <p className="text-xs font-bold text-slate-300">No reports found in this tab</p>
                <p className="text-[11px] text-slate-500">Tap "Report" in the bottom menu to submit your first civic issue</p>
              </div>
            )}
          </div>

          {/* 4. Municipal Staff Verification Mode Callout */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/90 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Municipal Staff Audit Portal</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Test Before vs After repair proof verification
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const target = tickets.find((t) => t.status === 'WORK_SUBMITTED') || tickets[0];
                onOpenVerificationStudio(target);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold whitespace-nowrap"
            >
              Verify Fixes
            </button>
          </div>
        </>
      )}

    </div>
  );
};
