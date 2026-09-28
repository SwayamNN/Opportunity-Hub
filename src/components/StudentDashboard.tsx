import React, { useState } from 'react';
import { Opportunity, StudentPreferences } from '../types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { 
  Sparkles, 
  Bookmark, 
  Clock, 
  Eye, 
  SlidersHorizontal, 
  ArrowRight, 
  Compass, 
  GraduationCap, 
  School,
  CheckCircle2,
  Calendar,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDeadlineRelative, getDaysRemaining } from '../utils/storage';

interface StudentDashboardProps {
  opportunities: Opportunity[];
  preferences: StudentPreferences;
  bookmarkedIds: string[];
  recentlyViewedIds: string[];
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onOpenPreferences: () => void;
  onExploreAll: () => void;
  onOpenProfile: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  opportunities,
  preferences,
  bookmarkedIds,
  recentlyViewedIds,
  onToggleBookmark,
  onSelectOpportunity,
  onOpenPreferences,
  onExploreAll,
  onOpenProfile
}) => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'saved' | 'deadlines' | 'recent'>('all');

  const hasInterests = Array.isArray(userProfile?.interests) && userProfile.interests.length > 0;

  // Filter 1: Recommended opportunities (scoring based on student preferences)
  const scoredOpportunities = opportunities.map(opp => {
    let score = 50;
    if (opp.domain && preferences.domains.includes(opp.domain)) score += 30;
    if (preferences.categories.includes(opp.category)) score += 20;
    if (preferences.modes.includes(opp.mode)) score += 10;
    if (preferences.onlyWithReward && opp.hasFinancialReward) score += 10;
    if (opp.featured) score += 5;
    return { opp, score: Math.min(score, 99) };
  }).sort((a, b) => b.score - a.score);

  const recommendedOpps = scoredOpportunities
    .filter(item => item.score >= 70)
    .slice(0, 6)
    .map(item => item.opp);

  // Fallback to top opportunities if preferences match few
  const displayRecommended = recommendedOpps.length > 0 
    ? recommendedOpps 
    : scoredOpportunities.slice(0, 4).map(item => item.opp);

  // Filter 2: Saved opportunities
  const savedOpps = opportunities.filter(opp => bookmarkedIds.includes(opp.id));

  // Filter 3: Upcoming deadlines (closing within 14 days, sorted ascending)
  const upcomingDeadlineOpps = opportunities
    .filter(opp => {
      const days = getDaysRemaining(opp.deadline);
      return days >= 0 && days <= 14;
    })
    .sort((a, b) => getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline))
    .slice(0, 6);

  // Filter 4: Recently viewed opportunities
  const recentlyViewedOpps = recentlyViewedIds
    .map(id => opportunities.find(o => o.id === id))
    .filter((opp): opp is Opportunity => !!opp)
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Student Welcome Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#181818] via-[#141414] to-[#1a0e0e] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Edition · Class of {userProfile?.gradYear || '2027'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {userProfile?.name || userProfile?.displayName || 'Student Builder'}! 👋
            </h1>
            
            <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <School className="w-4 h-4 text-red-500" />
                {userProfile?.organizationName || 'University Member'}
              </span>
              <span className="text-zinc-600">•</span>
              <span>{userProfile?.degree || 'Engineering & Computer Science'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              title="View and edit your student profile"
            >
              <User className="w-4 h-4 text-red-500" />
              <span>Profile</span>
            </button>
            <button
              onClick={onOpenPreferences}
              className="px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-500" />
              <span>My Interests</span>
              {hasInterests && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 text-[10px] font-mono">
                  {userProfile?.interests?.length}
                </span>
              )}
            </button>
            <button
              onClick={onExploreAll}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-950/60 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Catalog</span>
            </button>
            <button
              onClick={signOut}
              className="px-3.5 py-2.5 rounded-xl bg-[#222222] hover:bg-red-950/50 text-zinc-300 hover:text-white border border-white/10 hover:border-red-800/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Sign out of Opportunity Hub"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'recommended'
              ? 'bg-red-950/20 border-red-500/60 shadow-md shadow-red-950/30'
              : 'bg-[#141414] border-white/10 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Recommended</span>
            <Sparkles className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-white">{displayRecommended.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Personalized matches</div>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-red-950/20 border-red-500/60 shadow-md shadow-red-950/30'
              : 'bg-[#141414] border-white/10 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Saved Watchlist</span>
            <Bookmark className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-white">{savedOpps.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Bookmarked items</div>
        </button>

        <button
          onClick={() => setActiveTab('deadlines')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'deadlines'
              ? 'bg-red-950/20 border-red-500/60 shadow-md shadow-red-950/30'
              : 'bg-[#141414] border-white/10 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Upcoming Deadlines</span>
            <Clock className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-white">{upcomingDeadlineOpps.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Closing within 14d</div>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'recent'
              ? 'bg-red-950/20 border-red-500/60 shadow-md shadow-red-950/30'
              : 'bg-[#141414] border-white/10 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Recently Viewed</span>
            <Eye className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-white">{recentlyViewedOpps.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Inspected opportunities</div>
        </button>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-red-600 text-white font-semibold'
              : 'text-zinc-400 hover:text-white bg-[#181818]'
          }`}
        >
          All Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'recommended'
              ? 'bg-red-600 text-white font-semibold'
              : 'text-zinc-400 hover:text-white bg-[#181818]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span>Recommended ({displayRecommended.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'bg-red-600 text-white font-semibold'
              : 'text-zinc-400 hover:text-white bg-[#181818]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-red-400" />
          <span>Saved ({savedOpps.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('deadlines')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'deadlines'
              ? 'bg-red-600 text-white font-semibold'
              : 'text-zinc-400 hover:text-white bg-[#181818]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span>Upcoming Deadlines ({upcomingDeadlineOpps.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'recent'
              ? 'bg-red-600 text-white font-semibold'
              : 'text-zinc-400 hover:text-white bg-[#181818]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span>Recently Viewed ({recentlyViewedOpps.length})</span>
        </button>
      </div>

      {/* SECTION 1: RECOMMENDED OPPORTUNITIES */}
      {(activeTab === 'all' || activeTab === 'recommended') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Recommended For You</h2>
                <p className="text-xs text-zinc-400">Curated based on your selected tech domains and degree</p>
              </div>
            </div>

            <button
              onClick={onOpenPreferences}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{hasInterests ? 'Refine Interests' : 'Customize Interests'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!hasInterests ? (
            <div className="p-8 rounded-2xl bg-gradient-to-r from-[#181818] via-[#151515] to-[#201010] border border-red-900/40 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto text-red-500">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">You haven't selected your interests yet</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Customize your technical and program interests (such as AI/ML, Hackathons, VLSI, or Embedded Systems) to receive personalized recommendations curated for your degree and career goals.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenPreferences}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-950/60 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Set Up My Interests</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayRecommended.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isBookmarked={bookmarkedIds.includes(opp.id)}
                  onToggleBookmark={onToggleBookmark}
                  onSelect={onSelectOpportunity}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: SAVED OPPORTUNITIES */}
      {(activeTab === 'all' || activeTab === 'saved') && (
        <section className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Saved Opportunities ({savedOpps.length})</h2>
                <p className="text-xs text-zinc-400">Your personal bookmarked watchlist for upcoming applications</p>
              </div>
            </div>

            <button
              onClick={onExploreAll}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {savedOpps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedOpps.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isBookmarked={true}
                  onToggleBookmark={onToggleBookmark}
                  onSelect={onSelectOpportunity}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-sm font-bold text-white">No saved opportunities yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Bookmark hackathons, scholarships, and internships while browsing to keep track of their deadlines right here.
              </p>
              <button
                onClick={onExploreAll}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition-colors cursor-pointer"
              >
                Browse Opportunities
              </button>
            </div>
          )}
        </section>
      )}

      {/* SECTION 3: UPCOMING DEADLINES */}
      {(activeTab === 'all' || activeTab === 'deadlines') && (
        <section className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Upcoming Deadlines</h2>
                <p className="text-xs text-zinc-400">Applications locking in the next 14 days</p>
              </div>
            </div>

            <button
              onClick={onExploreAll}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingDeadlineOpps.map(opp => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isBookmarked={bookmarkedIds.includes(opp.id)}
                onToggleBookmark={onToggleBookmark}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: RECENTLY VIEWED OPPORTUNITIES */}
      {(activeTab === 'all' || activeTab === 'recent') && (
        <section className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Recently Viewed</h2>
                <p className="text-xs text-zinc-400">Opportunities you inspected recently</p>
              </div>
            </div>
          </div>

          {recentlyViewedOpps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentlyViewedOpps.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isBookmarked={bookmarkedIds.includes(opp.id)}
                  onToggleBookmark={onToggleBookmark}
                  onSelect={onSelectOpportunity}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#141414] border border-white/5 text-center text-xs text-zinc-500">
              You haven't clicked to view any opportunity details yet.
            </div>
          )}
        </section>
      )}

    </div>
  );
};
