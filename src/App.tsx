import React, { useState, useEffect } from 'react';
import { Opportunity, FilterState, StudentPreferences, OpportunityCategory, OpportunityMode } from './types/opportunity';
import { 
  DEFAULT_PREFERENCES,
  getAppliedIds,
  markAsApplied,
  getRecentlyViewedIds,
  addRecentlyViewedId
} from './utils/storage';
import { 
  subscribeToPublishedOpportunities,
  getPublishedOpportunities,
  createFirestoreOpportunity, 
  updateFirestoreOpportunity, 
  deleteFirestoreOpportunity 
} from './services/opportunityService';

import { Navbar, AppView } from './components/Navbar';
import { UniversityDashboard } from './components/UniversityDashboard';
import { ExplorePage } from './components/ExplorePage';
import { OpportunityDetail } from './components/OpportunityDetail';
import { ClosingSoonSection } from './components/ClosingSoonSection';
import { RecommendedSection } from './components/RecommendedSection';
import { SavedSection } from './components/SavedSection';
import { InterestModal } from './components/InterestModal';
import { OpportunityFormModal } from './components/OpportunityFormModal';
import { ProfilePage } from './components/ProfilePage';
import { Toast, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthGate } from './components/AuthGate';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const { 
    currentUser, 
    userProfile, 
    loading, 
    updateStudentBookmarks, 
    updateStudentInterests,
    updateStudentApplied,
    updateStudentPreferences
  } = useAuth();

  // Firestore real-time opportunities
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Student state (strictly isolated to the authenticated user's session)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<StudentPreferences>(DEFAULT_PREFERENCES);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Navigation & View state - Students default to 'explore', Universities to 'university_dashboard'
  const [currentView, setCurrentView] = useState<AppView>('explore');
  const [previousView, setPreviousView] = useState<AppView>('explore');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // University Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  // Student Preferences modal
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Filter state for the Explore tab
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    domain: 'All',
    mode: 'All',
    deadlineRange: 'All',
    rewardOnly: false,
    sortBy: 'deadline'
  });

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({
      id: `${Date.now()}`,
      type,
      message
    });
  };

  // Sync isolated bookmarks, interests, preferences, and applied opportunities directly from Firestore
  useEffect(() => {
    if (userProfile && userProfile.role === 'student') {
      setBookmarkedIds(Array.isArray(userProfile.bookmarkedOpportunities) ? userProfile.bookmarkedOpportunities : []);
      setAppliedIds(Array.isArray(userProfile.appliedOpportunities) ? userProfile.appliedOpportunities : getAppliedIds(userProfile.uid));
      setPreferences(userProfile.preferences || {
        ...DEFAULT_PREFERENCES,
        domains: Array.isArray(userProfile.interests) ? (userProfile.interests as any) : []
      });
      setRecentlyViewedIds(getRecentlyViewedIds(userProfile.uid));
    } else if (!userProfile) {
      // Complete state wipe on logout ensuring 100% data isolation between sessions
      setBookmarkedIds([]);
      setRecentlyViewedIds([]);
      setAppliedIds([]);
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, [userProfile?.uid, userProfile?.bookmarkedOpportunities, userProfile?.interests, userProfile?.appliedOpportunities, userProfile?.preferences]);

  // Subscribe to real-time opportunities from Firestore (only when authenticated)
  useEffect(() => {
    if (!currentUser || loading) return;

    // Fresh Firestore query immediately upon authentication/mount
    getPublishedOpportunities()
      .then(opps => setOpportunities(opps))
      .catch(err => console.warn('Fetch published note:', err));

    // Real-time listener for updates
    const unsubscribe = subscribeToPublishedOpportunities(
      (opps) => setOpportunities(opps),
      (err) => console.warn('Real-time subscription alert:', err)
    );
    return () => unsubscribe();
  }, [currentUser?.uid, loading]);

  // Sync default view & enforce role-based access control redirections
  useEffect(() => {
    if (!userProfile) return;

    if (userProfile.role === 'university') {
      // Universities must NOT have access to student-only routes
      if (
        currentView === 'student_dashboard' || 
        currentView === 'closing_soon' || 
        currentView === 'recommended' || 
        currentView === 'saved'
      ) {
        setCurrentView('university_dashboard');
        setSelectedOpportunity(null);
      }
    } else if (userProfile.role === 'student') {
      // Students must NOT have access to the University Management portal
      if (currentView === 'university_dashboard') {
        setCurrentView('explore');
        setSelectedOpportunity(null);
      }
    }
  }, [userProfile, currentView]);

  // Set initial post-login destination once user profile is confirmed
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'university') {
        setCurrentView('university_dashboard');
      } else {
        setCurrentView('explore');
      }
    }
  }, [userProfile?.role]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedOpportunity]);

  const handleNavigate = (view: AppView) => {
    const targetView = view === 'student_dashboard' ? 'explore' : view;

    if (targetView === 'profile') {
      setCurrentView('profile');
      setSelectedOpportunity(null);
      return;
    }

    // Route guard on manual navigation
    if (userProfile?.role === 'student' && targetView === 'university_dashboard') {
      setCurrentView('explore');
      return;
    }
    if (
      userProfile?.role === 'university' && 
      (targetView === 'closing_soon' || targetView === 'recommended' || targetView === 'saved')
    ) {
      setCurrentView('university_dashboard');
      return;
    }

    setCurrentView(targetView);
    setSelectedOpportunity(null);
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    if (currentView !== 'detail') {
      setPreviousView(currentView);
    }
    setSelectedOpportunity(opp);
    setCurrentView('detail');

    // Record in recently viewed for students
    if (userProfile?.role === 'student' && currentUser) {
      const updated = addRecentlyViewedId(opp.id, currentUser.uid);
      setRecentlyViewedIds(updated);
    }
  };

  const handleBackFromDetail = () => {
    setSelectedOpportunity(null);
    const fallback = userProfile?.role === 'university' ? 'university_dashboard' : 'explore';
    const target = (previousView && previousView !== 'detail' && previousView !== 'student_dashboard')
      ? previousView
      : fallback;
    setCurrentView(target);
  };

  const handleToggleBookmark = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // Only authenticated students can bookmark opportunities
    if (!currentUser || userProfile?.role !== 'student') {
      showToast('Bookmarks are reserved for student accounts.', 'info');
      return;
    }
    const isSaved = bookmarkedIds.includes(id);
    const newIds = isSaved ? bookmarkedIds.filter(item => item !== id) : [...bookmarkedIds, id];
    setBookmarkedIds(newIds);
    showToast(isSaved ? 'Removed from saved' : 'Opportunity saved to bookmarks', 'info');

    try {
      await updateStudentBookmarks(newIds);
    } catch (err) {
      console.error('Failed to update bookmarks:', err);
      // Revert if error
      setBookmarkedIds(bookmarkedIds);
      showToast('Could not save bookmark to Firestore.', 'info');
    }
  };

  const handleClearAllBookmarks = async () => {
    if (!currentUser || userProfile?.role !== 'student') return;
    const oldIds = bookmarkedIds;
    setBookmarkedIds([]);
    showToast('Bookmarks cleared', 'info');
    try {
      await updateStudentBookmarks([]);
    } catch (err) {
      setBookmarkedIds(oldIds);
      showToast('Failed to clear bookmarks in Firestore', 'info');
    }
  };

  const handleApply = async (opp: Opportunity) => {
    if (userProfile?.role === 'student' && currentUser) {
      const newApplied = appliedIds.includes(opp.id) ? appliedIds : [...appliedIds, opp.id];
      setAppliedIds(newApplied);
      markAsApplied(opp.id, currentUser.uid);
      try {
        await updateStudentApplied(newApplied);
      } catch (e) {
        console.warn('Failed to update applied list in Firestore:', e);
      }
    }
    showToast('Redirecting to official application portal...', 'success');
    
    const targetUrl = opp.applicationUrl || opp.applyUrl;
    if (targetUrl) {
      try {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('Failed to open application URL', err);
      }
    }
  };

  const handleSavePreferences = async (newPrefs: StudentPreferences) => {
    setPreferences(newPrefs);
    try {
      await updateStudentPreferences(newPrefs);
      showToast('Interests updated and saved to your profile!', 'success');
    } catch (err) {
      console.error('Failed to save interests:', err);
      showToast('Failed to save interests to Firestore', 'info');
    }
  };

  // University Opportunity Handlers (Firestore CRUD)
  const handleCreateOpportunity = async (formData: {
    title: string;
    organization: string;
    category: OpportunityCategory;
    description: string;
    eligibility: string;
    deadline: string;
    mode: OpportunityMode;
    location: string;
    skills: string[];
    applicationUrl: string;
    applicationLink?: string;
    published: boolean;
  }) => {
    if (!currentUser || userProfile?.role !== 'university') {
      showToast('Only verified university representatives can post opportunities.', 'info');
      return;
    }

    try {
      const newOpp = await createFirestoreOpportunity(formData);
      // Immediately reload fresh published opportunities from Firestore
      const freshPublished = await getPublishedOpportunities();
      setOpportunities(freshPublished);
      showToast(formData.published ? 'Opportunity published successfully to Firestore!' : 'Opportunity draft saved to Firestore!', 'success');
      setIsCreateOpen(false);
    } catch (err: any) {
      console.error('Create opportunity error:', err);
      showToast(err?.message || 'Failed to save opportunity to Firestore.', 'info');
      throw err;
    }
  };

  const handleUpdateOpportunity = async (formData: {
    title: string;
    organization: string;
    category: OpportunityCategory;
    description: string;
    eligibility: string;
    deadline: string;
    mode: OpportunityMode;
    location: string;
    skills: string[];
    applicationUrl: string;
    applicationLink?: string;
    published: boolean;
  }) => {
    if (!editingOpp || !currentUser || userProfile?.role !== 'university') return;

    try {
      await updateFirestoreOpportunity(editingOpp.id, formData);
      const freshPublished = await getPublishedOpportunities();
      setOpportunities(freshPublished);
      showToast('Opportunity updated successfully in Firestore.', 'success');
      setEditingOpp(null);
    } catch (err: any) {
      console.error('Update opportunity error:', err);
      showToast(err?.message || 'Failed to update opportunity in Firestore.', 'info');
      throw err;
    }
  };

  const handleDeleteOpportunity = async (oppId: string) => {
    if (!currentUser || userProfile?.role !== 'university') return;

    try {
      await deleteFirestoreOpportunity(oppId);
      const freshPublished = await getPublishedOpportunities();
      setOpportunities(freshPublished);
      showToast('Opportunity permanently removed from Firestore.', 'success');
    } catch (err: any) {
      console.error('Delete opportunity error:', err);
      showToast(err?.message || 'Failed to delete opportunity from Firestore.', 'info');
      throw err;
    }
  };

  const handleRefreshOpportunities = async () => {
    try {
      const freshPublished = await getPublishedOpportunities();
      setOpportunities(freshPublished);
      showToast('Opportunities refreshed from Firestore.', 'info');
    } catch (err) {
      console.warn('Sync error:', err);
    }
  };

  const handleExploreWithFilter = (initialFilter?: { domain?: string; category?: string; query?: string }) => {
    if (initialFilter) {
      setFilters(prev => ({
        ...prev,
        domain: (initialFilter.domain as any) || prev.domain,
        category: (initialFilter.category as any) || prev.category,
        searchQuery: initialFilter.query !== undefined ? initialFilter.query : prev.searchQuery
      }));
    }
    setCurrentView('explore');
    setSelectedOpportunity(null);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      domain: 'All',
      mode: 'All',
      deadlineRange: 'All',
      rewardOnly: false,
      sortBy: 'deadline'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 rounded bg-[#E53935] flex items-center justify-center font-bold text-xs text-white mb-3">
          OH
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E53935]" />
          <span>Loading Opportunity Hub...</span>
        </div>
      </div>
    );
  }

  // Auth gate when user is not authenticated OR when user is authenticated with Google but has no profile document in Firestore yet
  if (!currentUser || !userProfile) {
    return (
      <AuthGate 
        onSuccess={(role) => {
          if (role === 'university') {
            setCurrentView('university_dashboard');
          } else {
            setCurrentView('explore');
          }
        }} 
      />
    );
  }

  // Filter published opportunities for students
  const visibleOpportunities = userProfile.role === 'student'
    ? opportunities.filter(opp => opp.published !== false)
    : opportunities;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white antialiased selection:bg-[#E53935] selection:text-white">
      {/* Top Bar Navigation with Role Adaptation */}
      <Navbar
        currentView={currentView === 'detail' ? previousView : currentView}
        onNavigate={handleNavigate}
        savedCount={bookmarkedIds.length}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenSubmit={() => setIsCreateOpen(true)}
      />

      {/* Main View Router */}
      <main key={currentView} className="flex-1 animate-fade-in">
        
        {/* EXPLORE PAGE (Primary Student Opportunity Discovery) */}
        {(currentView === 'explore' || currentView === 'student_dashboard') && (
          <ExplorePage
            opportunities={visibleOpportunities}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onSelectOpportunity={handleSelectOpportunity}
            userInterests={userProfile.role === 'student' ? userProfile.interests : undefined}
            onOpenInterests={() => setIsPreferencesOpen(true)}
          />
        )}

        {/* UNIVERSITY OPPORTUNITIES (Manage Opportunities) */}
        {currentView === 'university_dashboard' && (
          <UniversityDashboard
            opportunities={opportunities}
            onOpenCreateModal={() => setIsCreateOpen(true)}
            onEditOpportunity={(opp) => setEditingOpp(opp)}
            onDeleteOpportunity={handleDeleteOpportunity}
            onSelectOpportunity={handleSelectOpportunity}
            onOpenProfile={() => handleNavigate('profile')}
            onRefreshOpportunities={handleRefreshOpportunities}
          />
        )}

        {/* CLOSING SOON (Student Only) */}
        {currentView === 'closing_soon' && (
          <ClosingSoonSection
            opportunities={visibleOpportunities}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onSelect={handleSelectOpportunity}
            onExploreAll={() => handleNavigate('explore')}
          />
        )}

        {/* RECOMMENDED FOR YOU (Student Only) */}
        {currentView === 'recommended' && (
          <RecommendedSection
            opportunities={visibleOpportunities}
            preferences={preferences}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onSelect={handleSelectOpportunity}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            onExploreAll={() => handleNavigate('explore')}
          />
        )}

        {/* SAVED OPPORTUNITIES / BOOKMARKS (Student Only) */}
        {currentView === 'saved' && (
          <SavedSection
            opportunities={visibleOpportunities}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onClearAllBookmarks={handleClearAllBookmarks}
            onSelect={handleSelectOpportunity}
            onExploreAll={() => handleNavigate('explore')}
          />
        )}

        {/* PROFILE / ACCOUNT PAGE */}
        {currentView === 'profile' && (
          <ProfilePage
            onBack={() => setCurrentView(userProfile?.role === 'university' ? 'university_dashboard' : 'explore')}
            onOpenInterests={() => setIsPreferencesOpen(true)}
            opportunities={opportunities}
          />
        )}

        {/* OPPORTUNITY DETAIL VIEW */}
        {currentView === 'detail' && selectedOpportunity && (
          <OpportunityDetail
            opportunity={selectedOpportunity}
            onBack={handleBackFromDetail}
            isBookmarked={bookmarkedIds.includes(selectedOpportunity.id)}
            onToggleBookmark={(id) => handleToggleBookmark(id)}
            onApply={handleApply}
            hasApplied={appliedIds.includes(selectedOpportunity.id)}
            onSelectRelated={handleSelectOpportunity}
            allOpportunities={visibleOpportunities}
            onTriggerToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Student Preferences Modal */}
      {userProfile?.role === 'student' && (
        <InterestModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          preferences={preferences}
          onSavePreferences={handleSavePreferences}
        />
      )}

      {/* University Create / Post Opportunity Modal */}
      {userProfile?.role === 'university' && (
        <OpportunityFormModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateOpportunity}
          initialData={null}
        />
      )}

      {/* University Edit Opportunity Modal */}
      {userProfile?.role === 'university' && editingOpp && (
        <OpportunityFormModal
          isOpen={!!editingOpp}
          onClose={() => setEditingOpp(null)}
          onSubmit={handleUpdateOpportunity}
          initialData={editingOpp}
        />
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          toast={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
