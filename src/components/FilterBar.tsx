import React, { useState } from 'react';
import { 
  FilterState, 
  OpportunityCategory, 
  OpportunityDomain, 
  OpportunityMode 
} from '../types/opportunity';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES: (OpportunityCategory | 'All')[] = [
  'All',
  'Hackathon',
  'Internship',
  'Fellowship',
  'Competition',
  'Scholarship',
  'Workshop'
];

const DOMAINS: (OpportunityDomain | 'All')[] = [
  'All',
  'Software Engineering',
  'AI / Machine Learning',
  'Electronics / VLSI',
  'Hardware & Embedded',
  'Cybersecurity',
  'Open Source',
  'Research & Academics'
];

const MODES: { value: OpportunityMode | 'All'; label: string }[] = [
  { value: 'All', label: 'All Modes' },
  { value: 'Online', label: 'Online / Remote' },
  { value: 'Offline', label: 'On-Site' },
  { value: 'Hybrid', label: 'Hybrid' }
];

const DEADLINE_RANGES = [
  { id: 'All', label: 'Any Deadline' },
  { id: '48h', label: 'Closing in 48 Hours' },
  { id: '7d', label: 'Closing in 7 Days' },
  { id: '30d', label: 'Next 30 Days' },
  { id: '60d+', label: '60+ Days' }
] as const;

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFilterCount = 
    (filters.category !== 'All' ? 1 : 0) +
    (filters.domain !== 'All' ? 1 : 0) +
    (filters.mode !== 'All' ? 1 : 0) +
    (filters.deadlineRange !== 'All' ? 1 : 0) +
    (filters.rewardOnly ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="space-y-3 mb-6">
      {/* Search & Top Action Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search opportunities by title, organization, or skills..."
            className="w-full pl-9 pr-8 py-2 rounded-md bg-[#111111] border border-[#262626] text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className={`sm:hidden px-3 py-2 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeFilterCount > 0
              ? 'bg-[#1B1B1B] text-white border-zinc-600'
              : 'bg-[#111111] text-zinc-400 border-[#262626]'
          }`}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#E53935] text-[10px] font-bold text-white flex items-center justify-center font-mono">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Pills (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => onFilterChange({ ...filters, category: cat })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#E53935] text-white font-semibold'
                  : 'bg-[#141414] text-zinc-400 hover:text-white hover:bg-[#1B1B1B] border border-[#262626]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          );
        })}
      </div>

      {/* Filter Row: Category (Mobile) + Deadline + Mode + Field + Reset */}
      <div className={`sm:flex flex-wrap items-center gap-2 pt-1 text-xs ${mobileFilterOpen ? 'flex flex-col sm:flex-row items-stretch' : 'hidden'}`}>
        {/* Category on Mobile */}
        <div className="sm:hidden">
          <label className="block text-[11px] text-zinc-500 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value as OpportunityCategory | 'All' })}
            className="w-full rounded-md py-1.5 px-2 bg-[#141414] border border-[#262626] text-zinc-200 text-xs focus:outline-none"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Deadline filter */}
        <div className="flex-1 sm:flex-none">
          <label className="block sm:hidden text-[11px] text-zinc-500 mb-1">Deadline</label>
          <select
            value={filters.deadlineRange}
            onChange={(e) => onFilterChange({ ...filters, deadlineRange: e.target.value as FilterState['deadlineRange'] })}
            className={`w-full sm:w-auto rounded-md py-1.5 px-2.5 text-xs bg-[#141414] border transition-colors cursor-pointer focus:outline-none ${
              filters.deadlineRange !== 'All'
                ? 'border-[#E53935] text-white bg-[#1A1A1A] font-medium'
                : 'border-[#262626] text-zinc-300 hover:border-zinc-700'
            }`}
          >
            {DEADLINE_RANGES.map(d => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Mode filter */}
        <div className="flex-1 sm:flex-none">
          <label className="block sm:hidden text-[11px] text-zinc-500 mb-1">Mode</label>
          <select
            value={filters.mode}
            onChange={(e) => onFilterChange({ ...filters, mode: e.target.value as OpportunityMode | 'All' })}
            className={`w-full sm:w-auto rounded-md py-1.5 px-2.5 text-xs bg-[#141414] border transition-colors cursor-pointer focus:outline-none ${
              filters.mode !== 'All'
                ? 'border-[#E53935] text-white bg-[#1A1A1A] font-medium'
                : 'border-[#262626] text-zinc-300 hover:border-zinc-700'
            }`}
          >
            {MODES.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Domain filter */}
        <div className="flex-1 sm:flex-none">
          <label className="block sm:hidden text-[11px] text-zinc-500 mb-1">Field / Domain</label>
          <select
            value={filters.domain}
            onChange={(e) => onFilterChange({ ...filters, domain: e.target.value as OpportunityDomain | 'All' })}
            className={`w-full sm:w-auto rounded-md py-1.5 px-2.5 text-xs bg-[#141414] border transition-colors cursor-pointer focus:outline-none ${
              filters.domain !== 'All'
                ? 'border-[#E53935] text-white bg-[#1A1A1A] font-medium'
                : 'border-[#262626] text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <option value="All">All Fields</option>
            {DOMAINS.filter(d => d !== 'All').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Reset filter action */}
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-zinc-400 hover:text-white bg-[#161616] hover:bg-[#202020] border border-[#262626] transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Result Count and Sort control strip */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1F1F1F] text-xs text-zinc-400">
        <div>
          <span>Showing <strong className="text-white font-mono tabular-nums">{filteredCount}</strong> of <span className="font-mono tabular-nums">{totalCount}</span> opportunities</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="text-xs rounded bg-[#111111] border border-[#262626] text-zinc-300 py-1 px-2 focus:outline-none hover:border-zinc-700 cursor-pointer"
          >
            <option value="deadline">Deadline (soonest first)</option>
            <option value="newest">Recently posted</option>
            <option value="popular">Most popular</option>
            <option value="reward">Highest stipend/prize</option>
          </select>
        </div>
      </div>
    </div>
  );
};
