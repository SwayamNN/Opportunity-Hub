import React from 'react';
import { Opportunity } from '../types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { getDaysRemaining } from '../utils/storage';

interface ClosingSoonSectionProps {
  opportunities: Opportunity[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelect: (opportunity: Opportunity) => void;
  onExploreAll: () => void;
}

export const ClosingSoonSection: React.FC<ClosingSoonSectionProps> = ({
  opportunities,
  bookmarkedIds,
  onToggleBookmark,
  onSelect,
  onExploreAll
}) => {
  // Filter for items with <= 7 days remaining
  const closingSoonList = opportunities
    .filter(opp => {
      const days = getDaysRemaining(opp.deadline);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Applications closing soon
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Opportunities with deadlines closing within the next 7 days.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer self-start sm:self-center"
        >
          View all opportunities →
        </button>
      </div>

      {closingSoonList.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg bg-[#111111] border border-[#262626] max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-white mb-1">
            No opportunities closing in the next 7 days.
          </h3>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            All currently active opportunities have more than a week before their submission deadline.
          </p>
          <button
            onClick={onExploreAll}
            className="px-4 py-2 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Explore opportunities
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Showing <strong className="text-white font-mono tabular-nums">{closingSoonList.length}</strong> urgent {closingSoonList.length === 1 ? 'deadline' : 'deadlines'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {closingSoonList.map((opp, idx) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                index={idx}
                isBookmarked={bookmarkedIds.includes(opp.id)}
                onToggleBookmark={onToggleBookmark}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
