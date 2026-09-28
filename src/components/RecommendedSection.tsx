import React from 'react';
import { Opportunity, StudentPreferences } from '../types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { SlidersHorizontal } from 'lucide-react';

interface RecommendedSectionProps {
  opportunities: Opportunity[];
  preferences: StudentPreferences;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelect: (opportunity: Opportunity) => void;
  onOpenPreferences: () => void;
  onExploreAll: () => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  opportunities,
  preferences,
  bookmarkedIds,
  onToggleBookmark,
  onSelect,
  onOpenPreferences,
  onExploreAll
}) => {
  // Score and filter recommendations based on preferences
  const userDomains = preferences.domains || [];

  const recommendedList = opportunities
    .map(opp => {
      let matchScore = 0;
      if (opp.domain && userDomains.includes(opp.domain as any)) {
        matchScore += 3;
      }
      if (opp.skills && opp.skills.some(s => userDomains.some(d => s.toLowerCase().includes(d.toLowerCase())))) {
        matchScore += 2;
      }
      if (preferences.categories && preferences.categories.includes(opp.category)) {
        matchScore += 1;
      }
      return { opp, matchScore };
    })
    .filter(item => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .map(item => item.opp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Recommended for you
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Opportunities matched to your selected fields: <span className="text-zinc-200">{userDomains.length > 0 ? userDomains.join(', ') : 'None selected'}</span>
          </p>
        </div>

        <button
          onClick={onOpenPreferences}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161616] hover:bg-[#202020] border border-[#262626] text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer self-start sm:self-center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E53935]" />
          <span>Edit interests</span>
        </button>
      </div>

      {recommendedList.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg bg-[#111111] border border-[#262626] max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-white mb-1">
            No opportunities match your current interests.
          </h3>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            Update your field interests or explore the full directory to find relevant programs.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onOpenPreferences}
              className="px-3.5 py-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Choose interests
            </button>
            <button
              onClick={onExploreAll}
              className="px-3.5 py-1.5 bg-[#161616] hover:bg-[#202020] text-zinc-300 hover:text-white border border-[#262626] text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              Browse all
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Showing <strong className="text-white font-mono tabular-nums">{recommendedList.length}</strong> matching {recommendedList.length === 1 ? 'opportunity' : 'opportunities'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedList.map((opp, idx) => (
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
