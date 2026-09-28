import React from 'react';
import { Opportunity, FilterState } from '../types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { FilterBar } from './FilterBar';
import { getDaysRemaining } from '../utils/storage';
import { SlidersHorizontal } from 'lucide-react';

interface ExplorePageProps {
  opportunities: Opportunity[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  userInterests?: string[];
  onOpenInterests?: () => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  opportunities,
  filters,
  onFilterChange,
  onResetFilters,
  bookmarkedIds,
  onToggleBookmark,
  onSelectOpportunity,
  userInterests,
  onOpenInterests
}) => {
  // Apply filtering
  const filtered = opportunities.filter(opp => {
    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchOrg = opp.organization.toLowerCase().includes(q);
      const matchDesc = (opp.shortDescription || opp.description || '').toLowerCase().includes(q);
      const matchTags = (opp.tags || opp.skills || []).some(t => t.toLowerCase().includes(q));
      const matchDomain = (opp.domain || '').toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchDesc && !matchTags && !matchDomain) {
        return false;
      }
    }

    // 2. Category
    if (filters.category !== 'All' && opp.category !== filters.category) {
      return false;
    }

    // 3. Domain
    if (filters.domain !== 'All' && opp.domain !== filters.domain) {
      return false;
    }

    // 4. Mode
    if (filters.mode !== 'All') {
      const oppMode = opp.mode;
      if (filters.mode === 'Online') {
        if (oppMode !== 'Online' && oppMode !== 'Remote') return false;
      } else if (filters.mode === 'Offline') {
        if (oppMode !== 'Offline' && oppMode !== 'On-Site') return false;
      } else if (oppMode !== filters.mode) {
        return false;
      }
    }

    // 5. Deadline Range
    if (filters.deadlineRange !== 'All') {
      const daysLeft = getDaysRemaining(opp.deadline);
      if (filters.deadlineRange === '48h' && (daysLeft < 0 || daysLeft > 2)) return false;
      if (filters.deadlineRange === '7d' && (daysLeft < 0 || daysLeft > 7)) return false;
      if (filters.deadlineRange === '30d' && (daysLeft < 0 || daysLeft > 30)) return false;
      if (filters.deadlineRange === '60d+' && daysLeft < 60) return false;
    }

    // 6. Reward Only
    if (filters.rewardOnly && !opp.hasFinancialReward) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    if (filters.sortBy === 'deadline') {
      return getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline);
    }
    if (filters.sortBy === 'popular') {
      return (b.applicantsCount || 0) - (a.applicantsCount || 0);
    }
    if (filters.sortBy === 'newest') {
      const dateB = new Date(b.postedDate || b.createdAt || 0).getTime();
      const dateA = new Date(a.postedDate || a.createdAt || 0).getTime();
      return dateB - dateA;
    }
    if (filters.sortBy === 'reward') {
      return (b.hasFinancialReward ? 1 : 0) - (a.hasFinancialReward ? 1 : 0);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Find your next opportunity
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Explore student hackathons, fellowships, research roles, and internships with verified deadlines.
        </p>
      </div>

      {/* Subtle interest banner if student hasn't selected interests */}
      {userInterests && userInterests.length === 0 && onOpenInterests && (
        <div className="mb-5 p-3.5 rounded-lg bg-[#141414] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-zinc-300">
            <span className="font-semibold text-white">Choose your interests</span> to get more relevant opportunities tailored to your technical field.
          </div>
          <button
            onClick={onOpenInterests}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1B1B1B] hover:bg-[#222222] border border-[#2B2B2B] text-zinc-200 hover:text-white font-medium transition-colors cursor-pointer self-start sm:self-center shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Choose interests</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        totalCount={opportunities.length}
        filteredCount={sorted.length}
      />

      {/* Opportunity Grid or Clean Empty State */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg bg-[#111111] border border-[#262626] my-4">
          <h3 className="text-sm font-semibold text-white mb-1">
            No opportunities match your filters.
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
            Try adjusting your search terms or resetting the active filters to see all available listings.
          </p>
          <button
            onClick={onResetFilters}
            className="px-3.5 py-1.5 rounded-md bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((opportunity, idx) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              index={idx}
              isBookmarked={bookmarkedIds.includes(opportunity.id)}
              onToggleBookmark={onToggleBookmark}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      )}
    </div>
  );
};
