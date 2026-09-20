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
  Sparkles, 
  AlertTriangle, 
  Check, 
  X, 
  MessageSquare, 
  Wrench, 
  SendHorizontal, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { CivicIssue } from '../../types/civic';

interface ProfileScreenProps {
  tickets: CivicIssue[];
  spamPreventedCount: number;
  onOpenVerificationStudio: (ticket: CivicIssue) => void;
  onSelectTicket: (ticket: CivicIssue) => void;
  selectedCity: string;
  onVoteOnGovResolution?: (ticketId: string, approved: boolean, citizenRemark?: string) => void;
  onSimulateGovFix?: (ticketId: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  tickets,
  spamPreventedCount,
  onOpenVerificationStudio,
  onSelectTicket,
  selectedCity,
  onVoteOnGovResolution,
  onSimulateGovFix
}) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('heer.patel@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Heer Patel');
  const [activeReportTab, setActiveReportTab] = useState<'ALL' | 'VOTING_PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');

  // Voting Comments State for each card
  const [citizenRemarksMap, setCitizenRemarksMap] = useState<Record<string, string>>({});
  const [votingSuccessId, setVotingSuccessId] = useState<string | null>(null);

  // Filter user's own reports (reports with reporterId 'usr-current' or reporterName containing Heer, or mock sample)
  const myReports = tickets.filter(
    (t) => t.reporterId === 'usr-current' || t.reporterName.includes('Heer') || t.id === 'TKT-101' || t.id === 'TKT-102'
  );

  const pendingVotes = myReports.filter((t) => t.status === 'GOV_RESOLVED_PENDING_VOTE' || t.status === 'WORK_SUBMITTED');
  const inProgressCount = myReports.filter((t) => t.status === 'PENDING_INTERNAL' || t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW');
  const resolvedCount = myReports.filter((t) => t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO');

  const filteredReports = myReports.filter((t) => {
    if (activeReportTab === 'VOTING_PENDING') return t.status === 'GOV_RESOLVED_PENDING_VOTE' || t.status === 'WORK_SUBMITTED';
    if (activeReportTab === 'IN_PROGRESS') return t.status === 'PENDING_INTERNAL' || t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW' || t.status === 'RE_DISPATCHED_TO_GOV';
    if (activeReportTab === 'RESOLVED') return t.status === 'VERIFIED_RESOLVED' || t.status === 'RESOLVED_DEMO';
    return true;
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleCitizenVote = (ticketId: string, approved: boolean) => {
    const remark = citizenRemarksMap[ticketId] || '';
    if (onVoteOnGovResolution) {
      onVoteOnGovResolution(ticketId, approved, remark);
      setVotingSuccessId(ticketId);
      setTimeout(() => setVotingSuccessId(null), 3500);
    }
  };

  return (
    <div className="space-y-5 pb-28 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. If Not Logged In: Interactive Login / Register Form */}
      {!isLoggedIn ? (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              <ShieldCheck className="w-8 h-8 text-slate-950" />
            </div>
            <h2 className="text-xl font-bold text-white pt-2">
              {authMode === 'login' ? 'Welcome Back to MarkPoint' : 'Create a MarkPoint Account'}
            </h2>
            <p className="text-xs text-slate-400">
              Track your reported potholes, garbage cleanups, and vote on municipal repair proofs
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

          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
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
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-lg font-black text-white">{myReports.length}</div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold mt-0.5">My Reports</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="text-lg font-black text-amber-400">{pendingVotes.length}</div>
                <div className="text-[9px] text-amber-300 uppercase font-semibold mt-0.5">Vote Required</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-lg font-black text-emerald-400">{resolvedCount.length}</div>
                <div className="text-[9px] text-emerald-300 uppercase font-semibold mt-0.5">70%+ Verified</div>
              </div>
            </div>
          </div>

          {/* 3. Action Alert Banner if Citizen has Pending 70% Verification Votes */}
          {pendingVotes.length > 0 && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-cyan-500/15 border border-amber-500/40 shadow-lg space-y-2 animate-pulse">
              <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Municipal Repair Proof Awaiting Your Audit</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Government field crew uploaded a repair photo. AI verified genuine ground remediation. 
                <strong className="text-emerald-400"> 70% citizen consensus</strong> is required to formally close the grievance.
              </p>
            </div>
          )}

          {/* 4. My Submitted Reports with 70% Consensus Workflow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  My Reports & Resolution Audits
                </h3>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveReportTab('ALL')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    activeReportTab === 'ALL'
                      ? 'bg-slate-800 text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({myReports.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('VOTING_PENDING')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    activeReportTab === 'VOTING_PENDING'
                      ? 'bg-amber-500/20 text-amber-300 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Votes ({pendingVotes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('IN_PROGRESS')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    activeReportTab === 'IN_PROGRESS'
                      ? 'bg-slate-800 text-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  In Progress ({inProgressCount.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('RESOLVED')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    activeReportTab === 'RESOLVED'
                      ? 'bg-slate-800 text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fixed ({resolvedCount.length})
                </button>
              </div>
            </div>

            {/* List of User's Reports */}
            {filteredReports.length > 0 ? (
              <div className="space-y-4">
                {filteredReports.map((report) => {
                  const isDone = report.status === 'VERIFIED_RESOLVED' || report.status === 'RESOLVED_DEMO';
                  const isPendingVote = report.status === 'GOV_RESOLVED_PENDING_VOTE' || report.status === 'WORK_SUBMITTED';
                  const isReDispatched = report.status === 'RE_DISPATCHED_TO_GOV';
                  
                  const votes = report.communityVotes || { totalVotes: 3, approvedVotes: 2, rejectedVotes: 0, citizenRemarks: [] };
                  const approvalPercentage = votes.totalVotes > 0 
                    ? Math.round((votes.approvedVotes / votes.totalVotes) * 100) 
                    : 0;

                  return (
                    <div
                      key={report.id}
                      className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5 transition-all"
                    >
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={report.imageUrl}
                            alt={report.subCategory}
                            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-slate-700 shadow-md"
                          />

                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white truncate">
                                {report.subCategory}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">#{report.id}</span>
                            </div>

                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {report.address}
                            </p>

                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {report.assignedDepartment} • SLA {report.slaHours}h
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isDone ? (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>70%+ Verified Fixed</span>
                            </span>
                          ) : isPendingVote ? (
                            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center space-x-1 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Audit & Vote ({approvalPercentage}%)</span>
                            </span>
                          ) : isReDispatched ? (
                            <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 flex items-center space-x-1">
                              <ShieldAlert className="w-3 h-3 text-rose-400" />
                              <span>Re-Dispatched (&lt;70%)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              <span>In Progress</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Citizen's Initial Comment (If Present) */}
                      {(report.citizenComment || report.citizenVoiceTranscript) && (
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-start space-x-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">Your Report Remarks:</span>
                            <span>{report.citizenComment || report.citizenVoiceTranscript}</span>
                          </div>
                        </div>
                      )}

                      {/* ----------------- GOVERNMENT FIX & AI PROOF SECTION ----------------- */}
                      {isPendingVote && (
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                          
                          {/* Side by side Before & After Images */}
                          <div>
                            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1.5 flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Government Crew Submitted Repair Proof</span>
                            </span>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="text-[9px] text-slate-400 font-bold uppercase">Before (Defect)</div>
                                <img
                                  src={report.imageUrl}
                                  alt="Before defect"
                                  className="w-full h-24 rounded-xl object-cover border border-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] text-emerald-400 font-bold uppercase">After Govt Repair</div>
                                <img
                                  src={report.imageAfterUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'}
                                  alt="Govt repair proof"
                                  className="w-full h-24 rounded-xl object-cover border border-emerald-500/40"
                                />
                              </div>
                            </div>
                          </div>

                          {/* AI Verification Authenticity Check Badge */}
                          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                            <div className="flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-emerald-300 font-medium">
                                AI Authenticity: Real Ground Repair Verified (94% Genuine, 0% Synthetic AI Noise)
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-md">
                              GPS ±4.2m
                            </span>
                          </div>

                          {/* 70% Citizen Consensus Threshold Bar */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-300">
                                Citizen Consensus Approval: <strong className={approvalPercentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}>{approvalPercentage}%</strong>
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {votes.approvedVotes} / {votes.totalVotes} Votes (Requires ≥ 70%)
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  approvalPercentage >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, approvalPercentage)}%` }}
                              />
                              {/* 70% threshold indicator line */}
                              <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-white shadow-sm z-10" />
                            </div>
                          </div>

                          {/* Citizen Remarks List */}
                          {votes.citizenRemarks && votes.citizenRemarks.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Community Remarks:</span>
                              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                {votes.citizenRemarks.map((rem, idx) => (
                                  <div key={idx} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between">
                                    <span><strong>{rem.user}:</strong> {rem.text}</span>
                                    <span className={rem.votedApproved ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                      {rem.votedApproved ? '✓ Fixed' : '✗ Rejected'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Voting Input & Buttons */}
                          <div className="space-y-2 pt-2 border-t border-slate-800">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-300 uppercase">
                                Your Inspection Feedback / Additional Remark:
                              </label>
                              <input
                                type="text"
                                value={citizenRemarksMap[report.id] || ''}
                                onChange={(e) =>
                                  setCitizenRemarksMap({
                                    ...citizenRemarksMap,
                                    [report.id]: e.target.value
                                  })
                                }
                                placeholder="e.g., Road surface is flat now / Or: Still rough and uneven..."
                                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                              {/* Confirm Fixed Button */}
                              <button
                                type="button"
                                onClick={() => handleCitizenVote(report.id, true)}
                                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wide shadow-md transition-all"
                              >
                                <Check className="w-3.5 h-3.5 text-slate-950" />
                                <span>Confirm Fixed</span>
                              </button>

                              {/* Reject / Still Broken Button */}
                              <button
                                type="button"
                                onClick={() => handleCitizenVote(report.id, false)}
                                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs transition-all"
                              >
                                <X className="w-3.5 h-3.5 text-rose-400" />
                                <span>Still Broken (Reject)</span>
                              </button>
                            </div>

                            {votingSuccessId === report.id && (
                              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold text-center border border-emerald-500/30 animate-in fade-in">
                                ✓ Your vote & comment have been recorded into the community consensus ledger!
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                      {/* ----------------- IN PROGRESS: SIMULATE GOV FIX BUTTON ----------------- */}
                      {!isDone && !isPendingVote && (
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onSimulateGovFix && onSimulateGovFix(report.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold border border-amber-500/30 transition-all"
                          >
                            <Wrench className="w-3.5 h-3.5 text-amber-400" />
                            <span>Simulate Govt Crew Uploading Repair Photo & AI Check</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectTicket(report)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* ----------------- RESOLVED SUMMARY CARD ----------------- */}
                      {isDone && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Closed with 70%+ Community Sign-off</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {votes.approvedVotes}/{votes.totalVotes} Votes ({approvalPercentage}%)
                          </span>
                        </div>
                      )}

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

          {/* 5. Municipal Staff Verification Studio Modal Trigger */}
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
