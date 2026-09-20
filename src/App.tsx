import React, { useState, useEffect, useMemo } from 'react';
import Lenis from 'lenis';
import { App as CapacitorApp } from '@capacitor/app';
import { TopSearchBar, CITIES } from './components/Navigation/TopSearchBar';
import { BottomNavBar, NavTab } from './components/Navigation/BottomNavBar';
import { HomeScreen } from './components/Home/HomeScreen';
import { RequestsScreen } from './components/Requests/RequestsScreen';
import { NewRequestScreen } from './components/NewRequest/NewRequestScreen';
import { NoticesScreen } from './components/Notices/NoticesScreen';
import { ProfileScreen } from './components/Profile/ProfileScreen';
import { DeduplicationModal } from './components/CitizenView/DeduplicationModal';
import { AIAnalysisModal } from './components/CitizenView/AIAnalysisModal';
import { TicketDetailModal } from './components/DashboardView/TicketDetailModal';
import { VerificationStudio } from './components/DashboardView/VerificationStudio';
import { AppSplashScreen } from './components/Navigation/AppSplashScreen';

import { INITIAL_MOCK_TICKETS } from './data/mockTickets';
import { CivicIssue, CVAnalysisResult, SpatialCoordinate } from './types/civic';
import { checkSpatialDeduplication, getGeofenceZoneForLocation } from './services/postgisEngine';
import { runCvInference } from './services/cvInference';
import { speakText } from './services/voiceService';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Surat');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Tickets & Telemetry State
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [tickets, setTickets] = useState<CivicIssue[]>(INITIAL_MOCK_TICKETS);
  const [likedTickets, setLikedTickets] = useState<string[]>(['TKT-101', 'TKT-103']);
  const [spamPreventedCount, setSpamPreventedCount] = useState<number>(42);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  // Modals
  const [dedupModalData, setDedupModalData] = useState<{
    masterTicket: CivicIssue;
    distanceMeters: number;
    newImageUrl: string;
  } | null>(null);

  const [aiAnalysisModalData, setAiAnalysisModalData] = useState<{
    analysis: CVAnalysisResult;
    imageUrl: string;
    location: SpatialCoordinate;
    voiceTranscript?: string;
  } | null>(null);

  const [inspectTicket, setInspectTicket] = useState<CivicIssue | null>(null);
  const [verificationTicket, setVerificationTicket] = useState<CivicIssue | null>(null);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Android Hardware Back Button Handler (Prevents app exiting when switching tabs/closing modals)
  useEffect(() => {
    let handlerPromise: any = null;
    try {
      handlerPromise = CapacitorApp.addListener('backButton', () => {
        if (dedupModalData) {
          setDedupModalData(null);
        } else if (aiAnalysisModalData) {
          setAiAnalysisModalData(null);
        } else if (inspectTicket) {
          setInspectTicket(null);
        } else if (verificationTicket) {
          setVerificationTicket(null);
        } else if (activeTab !== 'home') {
          setActiveTab('home');
        } else {
          CapacitorApp.exitApp();
        }
      });
    } catch (e) {
      console.warn('Capacitor backButton listener unavailable in browser environment:', e);
    }

    return () => {
      if (handlerPromise && typeof handlerPromise.then === 'function') {
        handlerPromise.then((h: any) => h?.remove?.());
      }
    };
  }, [dedupModalData, aiAnalysisModalData, inspectTicket, verificationTicket, activeTab]);

  // Compute Active City Coordinates
  const currentCityCoords = useMemo(() => {
    if (gpsCoords && selectedCity === 'Your Location') {
      return gpsCoords;
    }
    const matched = CITIES.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
    return matched ? { lat: matched.lat, lng: matched.lng } : { lat: 21.1702, lng: 72.8311 }; // Surat default
  }, [selectedCity, gpsCoords]);

  // GPS Locate Me Handler
  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSelectedCity('Your Location');
          setSearchQuery('Current GPS Location');
        },
        () => {
          setIsLocating(false);
          setSelectedCity('Surat');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Toggle Upvote / Like Handler (1 click = like, 2nd click = remove like)
  const handleToggleUpvote = (ticketId: string) => {
    const alreadyLiked = likedTickets.includes(ticketId);

    if (alreadyLiked) {
      setLikedTickets((prev) => prev.filter((id) => id !== ticketId));
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, upvoteCount: Math.max(0, t.upvoteCount - 1) } : t
        )
      );
      speakText('Upvote removed.');
    } else {
      setLikedTickets((prev) => [...prev, ticketId]);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, upvoteCount: t.upvoteCount + 1 } : t
        )
      );
      speakText('Priority upvote added.');
    }
  };

  // Ingest Report Handler (Camera, Gallery or Preset + Additional Comment)
  const handleIngestReport = async (payload: {
    imageUrl: string;
    location: SpatialCoordinate;
    voiceTranscript: string;
    userComment?: string;
    presetHint?: string;
  }) => {
    setIsLoadingAnalysis(true);

    try {
      const combinedHints = [payload.voiceTranscript, payload.userComment, payload.presetHint]
        .filter(Boolean)
        .join(' | ');

      // 1. Run AI Vision Screening
      const analysis = await runCvInference(payload.imageUrl, {
        apiKey,
        voiceTranscript: combinedHints,
        presetHint: payload.presetHint
      });

      // 2. Run 25-Meter Spatial Anti-Spam Check
      const dedupCheck = checkSpatialDeduplication(
        payload.location,
        analysis.taxonomyId,
        tickets
      );

      if (dedupCheck.isDuplicate && dedupCheck.masterTicket) {
        // Increment Master Ticket Upvotes
        const masterId = dedupCheck.masterTicket.id;
        if (!likedTickets.includes(masterId)) {
          setLikedTickets((prev) => [...prev, masterId]);
        }
        setTickets((prev) =>
          prev.map((t) =>
            t.id === masterId
              ? { ...t, upvoteCount: t.upvoteCount + 1 }
              : t
          )
        );
        setSpamPreventedCount((prev) => prev + 1);

        setDedupModalData({
          masterTicket: dedupCheck.masterTicket,
          distanceMeters: dedupCheck.distanceMeters,
          newImageUrl: payload.imageUrl
        });
      } else {
        // New ticket confirmation modal
        setAiAnalysisModalData({
          analysis,
          imageUrl: payload.imageUrl,
          location: payload.location,
          voiceTranscript: combinedHints,
        });
      }
    } catch (err) {
      console.error('Ingestion error:', err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Commit New Master Ticket
  const handleCommitNewTicket = () => {
    if (!aiAnalysisModalData) return;
    const { analysis, imageUrl, location, voiceTranscript } = aiAnalysisModalData;

    const geofence = getGeofenceZoneForLocation(location);
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: CivicIssue = {
      id: newId,
      taxonomyId: analysis.taxonomyId,
      category: analysis.category,
      subCategory: analysis.subCategory,
      vertical: analysis.vertical,
      status: 'PENDING_INTERNAL',
      priority: analysis.priority,
      slaHours: analysis.slaHours,
      slaDeadline: new Date(Date.now() + analysis.slaHours * 3600 * 1000).toISOString(),
      reportedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      reporterId: 'usr-current',
      reporterName: 'Heer Patel',
      reporterDeviceHash: 'sha256-auth',
      location,
      address: `${selectedCity}, ${geofence.zoneName}`,
      upvoteCount: 1,
      upvotedBy: ['usr-current'],
      assignedDepartment: analysis.responsibleDepartment,
      l2EscalationRole: analysis.l2EscalationRole,
      geofenceZone: geofence.zoneName,
      isEscalated: false,
      imageUrl,
      aiConfidence: analysis.confidence,
      detectedObjects: analysis.detectedObjects,
      detectedCvTriggers: analysis.detectedTriggers,
      formalComplaintDraft: analysis.formalComplaintDraft,
      citizenVoiceTranscript: voiceTranscript,
      citizenComment: voiceTranscript,
      communityVotes: {
        totalVotes: 1,
        approvedVotes: 0,
        rejectedVotes: 0,
        citizenRemarks: []
      }
    };

    setTickets((prev) => [newTicket, ...prev]);
    setLikedTickets((prev) => [...prev, newId]);
    setAiAnalysisModalData(null);
    setActiveTab('requests'); // Switch to map and focus on the new report!
  };

  // Simulate Government Crew Uploading Repair Photo & AI Check
  const handleSimulateGovFix = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'GOV_RESOLVED_PENDING_VOTE',
            imageAfterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            govResolutionDetails: {
              resolvedByWorker: 'Municipal Ground Rapid Response Unit #4',
              department: t.assignedDepartment,
              resolvedAt: new Date().toISOString(),
              repairNotes: 'Applied high-grade cold asphalt mix and roller compaction to seal cavity.',
              imageAfterUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
              aiProofScore: 94,
              aiAuthenticityCheck: 'PASSED_GENUINE'
            },
            communityVotes: t.communityVotes || {
              totalVotes: 3,
              approvedVotes: 2,
              rejectedVotes: 0,
              citizenRemarks: [
                { user: 'Suresh M.', text: 'Road surface is smooth now.', votedApproved: true, time: '10m ago' },
                { user: 'Priya K.', text: 'Checked during morning commute, cavity closed.', votedApproved: true, time: '5m ago' }
              ]
            }
          };
        }
        return t;
      })
    );
    speakText('Government work proof uploaded. AI authenticity verified. Awaiting citizen voting.');
  };

  // Citizen 70% Consensus Voting Handler
  const handleVoteOnGovResolution = (ticketId: string, approved: boolean, citizenRemark?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const currentVotes = t.communityVotes || { totalVotes: 2, approvedVotes: 1, rejectedVotes: 0, citizenRemarks: [] };
          const newApproved = approved ? currentVotes.approvedVotes + 1 : currentVotes.approvedVotes;
          const newRejected = !approved ? currentVotes.rejectedVotes + 1 : currentVotes.rejectedVotes;
          const newTotal = currentVotes.totalVotes + 1;
          const approvalPct = Math.round((newApproved / newTotal) * 100);

          const updatedRemarks = [
            ...(currentVotes.citizenRemarks || []),
            {
              user: 'Heer Patel (You)',
              text: citizenRemark || (approved ? 'Confirmed fixed by citizen inspection.' : 'Defect still persists on site.'),
              votedApproved: approved,
              time: 'Just now'
            }
          ];

          // 70% threshold rule
          let newStatus: any = t.status;
          if (approvalPct >= 70 && newTotal >= 2) {
            newStatus = 'VERIFIED_RESOLVED';
            speakText('Resolution verified with over 70 percent citizen approval.');
          } else if (approvalPct < 70) {
            newStatus = 'RE_DISPATCHED_TO_GOV';
            speakText('Citizen satisfaction below 70 percent. Re-dispatched to department.');
          }

          return {
            ...t,
            status: newStatus,
            resolvedAt: newStatus === 'VERIFIED_RESOLVED' ? new Date().toISOString() : t.resolvedAt,
            communityVotes: {
              totalVotes: newTotal,
              approvedVotes: newApproved,
              rejectedVotes: newRejected,
              citizenRemarks: updatedRemarks
            }
          };
        }
        return t;
      })
    );
  };

  // Resolve Ticket in Verification Studio
  const handleResolveTicket = (ticketId: string, result: any) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'VERIFIED_RESOLVED',
              resolvedAt: new Date().toISOString(),
              verificationResult: result
            }
          : t
      )
    );
  };

  const unresolvedCount = tickets.filter(
    (t) => t.status !== 'VERIFIED_RESOLVED' && t.status !== 'RESOLVED_DEMO'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Search Bar matching reference screenshot with MarkPoint logo */}
      <TopSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCitySelect={setSelectedCity}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      {/* Main Tab Screen Content */}
      <main className="flex-1 px-4 sm:px-6 pt-3">
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateTab={setActiveTab}
            tickets={tickets}
            selectedCity={selectedCity}
            centerCoords={currentCityCoords}
            onSelectTicket={setInspectTicket}
            spamPreventedCount={spamPreventedCount}
          />
        )}

        {activeTab === 'requests' && (
          <RequestsScreen
            tickets={tickets}
            onSelectTicket={setInspectTicket}
            onUpvoteTicket={handleToggleUpvote}
            selectedCity={selectedCity}
            centerCoords={currentCityCoords}
            likedTickets={likedTickets}
          />
        )}

        {activeTab === 'new_request' && (
          <NewRequestScreen
            onCaptureAndIngest={handleIngestReport}
            isLoading={isLoadingAnalysis}
            selectedCity={selectedCity}
            userCoords={currentCityCoords}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesScreen selectedCity={selectedCity} />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            tickets={tickets}
            likedTickets={likedTickets}
            spamPreventedCount={spamPreventedCount}
            onOpenVerificationStudio={(t) => setVerificationTicket(t)}
            onSelectTicket={setInspectTicket}
            selectedCity={selectedCity}
            onVoteOnGovResolution={handleVoteOnGovResolution}
            onSimulateGovFix={handleSimulateGovFix}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unresolvedCount={unresolvedCount}
      />

      {/* Modal 1: 25m Spatial Anti-Spam Duplicate Alert */}
      {dedupModalData && (
        <DeduplicationModal
          isOpen={!!dedupModalData}
          onClose={() => setDedupModalData(null)}
          masterTicket={dedupModalData.masterTicket}
          distanceMeters={dedupModalData.distanceMeters}
          newImageUrl={dedupModalData.newImageUrl}
        />
      )}

      {/* Modal 2: AI Vision Classification & Complaint Confirmation */}
      {aiAnalysisModalData && (
        <AIAnalysisModal
          isOpen={!!aiAnalysisModalData}
          onClose={() => setAiAnalysisModalData(null)}
          analysis={aiAnalysisModalData.analysis}
          imageUrl={aiAnalysisModalData.imageUrl}
          onConfirmSubmit={handleCommitNewTicket}
        />
      )}

      {/* Modal 3: Ticket Inspection Details Modal */}
      {inspectTicket && (
        <TicketDetailModal
          ticket={inspectTicket}
          onClose={() => setInspectTicket(null)}
          onOpenVerificationStudio={(t) => {
            setInspectTicket(null);
            setVerificationTicket(t);
          }}
        />
      )}

      {/* Modal 4: AI "No Fake Closures" Verification Studio */}
      {verificationTicket && (
        <VerificationStudio
          ticket={verificationTicket}
          onClose={() => setVerificationTicket(null)}
          onResolvedSuccessfully={handleResolveTicket}
        />
      )}

      {/* Opening Splash Animation */}
      {showSplash && (
        <AppSplashScreen onComplete={() => setShowSplash(false)} />
      )}

    </div>
  );
};

export default App;
