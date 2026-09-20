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
import { TicketDetailModal } from './components/Shared/TicketDetailModal';
import { AppSplashScreen } from './components/Navigation/AppSplashScreen';

import { INITIAL_MOCK_TICKETS, getTicketsForCity, ALL_LOCATIONS_INITIAL_TICKETS } from './data/mockTickets';
import { CivicIssue, CVAnalysisResult, SpatialCoordinate } from './types/civic';
import { checkSpatialDeduplication, getGeofenceZoneForLocation } from './services/postgisEngine';
import { runCvInference } from './services/cvInference';
import { triggerHapticImpact, triggerHapticNotification, triggerHapticSelection } from './services/hapticsService';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Surat');
  const [selectedCityCoords, setSelectedCityCoords] = useState<{ lat: number; lng: number }>({ lat: 21.1702, lng: 72.8311 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Tickets & Telemetry State: Preserves all location reports across all cities
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [tickets, setTickets] = useState<CivicIssue[]>(ALL_LOCATIONS_INITIAL_TICKETS);
  const [likedTickets, setLikedTickets] = useState<string[]>([]);
  const [spamPreventedCount, setSpamPreventedCount] = useState<number>(42);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  // Notices & Requests read-state
  const TOTAL_NOTICE_IDS = ['NTC-01', 'NTC-02', 'NTC-03'];
  const [hasSeenNoticesTab, setHasSeenNoticesTab] = useState<boolean>(false);
  const [hasSeenRequestsTab, setHasSeenRequestsTab] = useState<boolean>(false);
  const [readNoticeIds, setReadNoticeIds] = useState<string[]>([]);
  const hasUnreadNotices = !hasSeenNoticesTab && TOTAL_NOTICE_IDS.some(id => !readNoticeIds.includes(id));
  const handleNoticeRead = (id: string) => {
    setReadNoticeIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

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

  // Compute Active City Coordinates
  const currentCityCoords = useMemo(() => {
    return selectedCityCoords;
  }, [selectedCityCoords]);

  const handleCitySelect = (cityName: string, coords?: { lat: number; lng: number }) => {
    setSelectedCity(cityName);
    let targetCoords = coords;
    if (!targetCoords) {
      const matched = CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
      if (matched) {
        targetCoords = { lat: matched.lat, lng: matched.lng };
      } else {
        targetCoords = selectedCityCoords;
      }
    }
    setSelectedCityCoords(targetCoords);

    // If this city is not yet in our tickets dataset, generate and append its tickets so all location reports are preserved
    setTickets((prev) => {
      const hasCityTickets = prev.some((t) =>
        t.address.toLowerCase().includes(cityName.toLowerCase()) ||
        t.id.toLowerCase().includes(cityName.substring(0, 3).toLowerCase())
      );
      if (!hasCityTickets) {
        const newCityTickets = getTicketsForCity(cityName, targetCoords!);
        return [...newCityTickets, ...prev];
      }
      return prev;
    });

    triggerHapticSelection();
  };

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

  // Android Hardware Back Button Handler
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
  }, [dedupModalData, aiAnalysisModalData, inspectTicket, activeTab]);

  // GPS Locate Me Handler with City Name Detection
  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setIsLocating(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setGpsCoords({ lat, lng });
          setSelectedCityCoords({ lat, lng });

          // 1. Find closest city from CITIES list
          let detectedCity = 'Surat';
          let minDistance = 999999;
          for (const c of CITIES) {
            const dist = Math.hypot(lat - c.lat, lng - c.lng);
            if (dist < minDistance) {
              minDistance = dist;
              detectedCity = c.name;
            }
          }

          // 2. If closest known city is close, use it directly
          if (minDistance < 0.45) {
            setSelectedCity(detectedCity);
            setSearchQuery('');
            triggerHapticNotification('success');
            return;
          }

          // 3. Otherwise try reverse geocode from OpenStreetMap
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const cityFound = addr.city || addr.town || addr.municipality || addr.district || addr.county || detectedCity;
              setSelectedCity(cityFound);
              setSearchQuery('');
              triggerHapticNotification('success');
              return;
            }
          } catch (e) {
            console.warn('Reverse geocode error:', e);
          }

          setSelectedCity(detectedCity);
          setSearchQuery('');
          triggerHapticNotification('success');
        },
        () => {
          setIsLocating(false);
          setSelectedCity('Surat');
          triggerHapticNotification('warning');
        },
        { enableHighAccuracy: true, timeout: 8000 }
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
      triggerHapticImpact('light');
    } else {
      setLikedTickets((prev) => [...prev, ticketId]);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, upvoteCount: t.upvoteCount + 1 } : t
        )
      );
      triggerHapticImpact('medium');
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
      reporterName: 'Heer Khunt',
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
              user: 'Heer Khunt (You)',
              text: citizenRemark || (approved ? 'Confirmed fixed by citizen inspection.' : 'Defect still persists on site.'),
              votedApproved: approved,
              time: 'Just now'
            }
          ];

          // 70% threshold rule
          let newStatus: any = t.status;
          if (approvalPct >= 70 && newTotal >= 2) {
            newStatus = 'VERIFIED_RESOLVED';
            triggerHapticNotification('success');
          } else if (approvalPct < 70) {
            newStatus = 'RE_DISPATCHED_TO_GOV';
            triggerHapticNotification('warning');
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
    triggerHapticNotification('success');
  };

  const handleTabChange = (tab: NavTab) => {
    triggerHapticSelection();
    setActiveTab(tab);
    if (tab === 'notices') {
      setHasSeenNoticesTab(true);
    }
    if (tab === 'requests') {
      setHasSeenRequestsTab(true);
    }
  };

  // Badge only counts unresolved tickets that belong to the currently selected city (cleared once viewed)
  const unresolvedCount = hasSeenRequestsTab
    ? 0
    : tickets.filter(
        (t) =>
          t.status !== 'VERIFIED_RESOLVED' &&
          t.status !== 'RESOLVED_DEMO' &&
          t.address.toLowerCase().includes(selectedCity.toLowerCase())
      ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Search Bar matching reference screenshot with MarkPoint logo */}
      <TopSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      {/* Main Tab Screen Content */}
      <main className="flex-1 px-4 sm:px-6 pt-3">
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateTab={handleTabChange}
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
          <NoticesScreen
            selectedCity={selectedCity}
            readNoticeIds={readNoticeIds}
            onNoticeRead={handleNoticeRead}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            tickets={tickets}
            likedTickets={likedTickets}
            spamPreventedCount={spamPreventedCount}
            onSelectTicket={setInspectTicket}
            selectedCity={selectedCity}
            onVoteOnGovResolution={handleVoteOnGovResolution}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unresolvedCount={unresolvedCount}
        hasUnreadNotices={hasUnreadNotices}
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
