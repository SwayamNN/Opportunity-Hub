import React from 'react';
import { Opportunity } from '../types/opportunity';
import { formatDeadlineRelative } from '../utils/storage';
import { Bookmark, ArrowUpRight, Clock, MapPin } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelect: (opportunity: Opportunity) => void;
  index?: number;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isBookmarked,
  onToggleBookmark,
  onSelect
}) => {
  const deadlineInfo = formatDeadlineRelative(opportunity.deadline);
  const skillsList = opportunity.skills || opportunity.tags || [];

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group flex flex-col justify-between rounded-lg bg-[#111111] border border-[#262626] hover:border-zinc-700 hover:bg-[#141414] p-4 transition-colors duration-150 cursor-pointer shadow-sm"
    >
      <div>
        {/* Organization & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#1C1C1C] border border-[#2B2B2B] text-zinc-200 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              {opportunity.orgInitials || opportunity.organization?.slice(0, 2).toUpperCase() || 'OH'}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-medium text-zinc-400 truncate">
                {opportunity.organization}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <span className="font-semibold text-zinc-300">{opportunity.category}</span>
                {opportunity.domain && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{opportunity.domain}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => onToggleBookmark(opportunity.id, e)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
              isBookmarked
                ? 'text-[#E53935] bg-[#E53935]/10 border border-[#E53935]/30'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-[#1A1A1A] border border-transparent'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
          >
            <Bookmark 
              className="w-4 h-4" 
              fill={isBookmarked ? 'currentColor' : 'none'} 
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {opportunity.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
          {opportunity.shortDescription || opportunity.description}
        </p>

        {/* Metadata Strip: Mode & Location */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-2.5">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="text-zinc-300 font-medium">{opportunity.mode}</span>
          </div>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="truncate text-zinc-400">{opportunity.location}</span>
          {opportunity.stipendOrPrize && (
            <>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="font-mono text-zinc-300 truncate">{opportunity.stipendOrPrize}</span>
            </>
          )}
        </div>

        {/* Relevant Skills (quiet unboxed tags) */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {skillsList.slice(0, 3).map((skill, i) => (
              <span 
                key={i} 
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1A1A1A] text-zinc-400 border border-[#262626]"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 3 && (
              <span className="text-[10px] text-zinc-500 self-center">
                +{skillsList.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Deadline & Action */}
      <div className="pt-2.5 border-t border-[#222222] flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-xs">
          <Clock
            className={`w-3.5 h-3.5 shrink-0 ${
              deadlineInfo.urgent ? 'text-[#E53935]' : 'text-zinc-500'
            }`}
          />
          <span
            className={`font-mono tabular-nums text-[11px] ${
              deadlineInfo.urgent
                ? 'text-[#E53935] font-semibold'
                : 'text-zinc-400'
            }`}
          >
            {deadlineInfo.label}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(opportunity);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-zinc-200 bg-[#1A1A1A] hover:bg-[#242424] hover:text-white border border-[#2B2B2B] transition-colors cursor-pointer"
        >
          <span>View</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};
