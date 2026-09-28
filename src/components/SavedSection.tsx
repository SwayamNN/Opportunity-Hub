import React from 'react';
import { Opportunity } from '../types/opportunity';
import { OpportunityCard } from './OpportunityCard';

interface SavedSectionProps {
  opportunities: Opportunity[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onClearAllBookmarks: () => void;
  onSelect: (opportunity: Opportunity) => void;
  onExploreAll: () => void;
}

export const SavedSection: React.FC<SavedSectionProps> = ({
  opportunities,
  bookmarkedIds,
  onToggleBookmark,
  onClearAllBookmarks,
  onSelect,
  onExploreAll
}) => {
  const savedOpportunities = opportunities.filter(opp => bookmarkedIds.includes(opp.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Saved Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review upcoming deadlines and manage your saved applications.
          </p>
        </div>

        {savedOpportunities.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAllBookmarks}
              className="text-xs text-zinc-400 hover:text-[#E53935] px-2.5 py-1.5 rounded-md bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] transition-colors cursor-pointer"
            >
              Clear all saved
            </button>
          </div>
        )}
      </div>

      {savedOpportunities.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg bg-[#111111] border border-[#262626] max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-white mb-1">
            You haven't saved any opportunities yet.
          </h3>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            When you find hackathons, internships, or fellowships you're interested in, bookmark them to track deadlines here.
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
            Showing <strong className="text-white font-mono tabular-nums">{savedOpportunities.length}</strong> saved {savedOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOpportunities.map((opp, idx) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                index={idx}
                isBookmarked={true}
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
