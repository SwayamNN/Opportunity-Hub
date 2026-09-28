import React, { useState } from 'react';
import { Opportunity } from '../types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { 
  Compass, 
  Clock, 
  ArrowRight, 
  Search, 
  Cpu, 
  Code2, 
  Layers, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Building2
} from 'lucide-react';
import { getDaysRemaining } from '../utils/storage';

interface LandingPageProps {
  opportunities: Opportunity[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onExplore: (initialFilter?: { domain?: string; category?: string; query?: string }) => void;
  onViewClosingSoon: () => void;
  onOpenSubmit: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  opportunities,
  bookmarkedIds,
  onToggleBookmark,
  onSelectOpportunity,
  onExplore,
  onViewClosingSoon,
  onOpenSubmit
}) => {
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExplore({ query: heroSearch });
  };

  // Get urgent closing soon items
  const closingSoonItems = opportunities
    .filter(opp => {
      const days = getDaysRemaining(opp.deadline);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline))
    .slice(0, 3);

  // Featured flagship opportunities
  const featuredOpportunities = opportunities
    .filter(opp => opp.featured)
    .slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 animate-in fade-in duration-200">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden border-b border-white/10 bg-[#0A0A0A]">
        {/* Subtle red ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          {/* Marquee Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto" style={{ textWrap: 'balance' }}>
            Where Top Student Engineers Discover Their Next{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-400">
              Breakthroughs
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Curated hackathons, silicon fellowships, AI residencies, and funded tech internships for college students—fully verified with zero noise.
          </p>

          {/* Search Bar & Instant Launch */}
          <form onSubmit={handleHeroSearchSubmit} className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center shadow-lg shadow-black/60 rounded-2xl bg-[#141414] border border-white/10 p-1.5 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all duration-150">
              <Search className="w-5 h-5 ml-3 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search hackathons, VLSI, AI residencies, Google, Jane Street..."
                className="w-full px-3 py-2 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0 text-white font-semibold text-xs rounded-xl shadow-md shadow-red-950/50 hover:shadow-red-600/30 transition-all duration-150 cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => onExplore()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0 text-white font-semibold text-sm shadow-md shadow-red-950/50 hover:shadow-red-600/30 transition-all duration-150 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Opportunities</span>
            </button>

            <button
              onClick={onViewClosingSoon}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#141414] hover:bg-[#1c1c1c] hover:-translate-y-0.5 active:translate-y-0 text-zinc-300 hover:text-white font-semibold text-sm border border-white/10 shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-red-500" />
              <span>Closing Soon ({closingSoonItems.length})</span>
            </button>
          </div>

          {/* Trust Metrics Strip */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">160+</div>
              <div className="text-xs text-zinc-500 mt-0.5">Active Programs</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-500 font-mono tabular-nums">$520K+</div>
              <div className="text-xs text-zinc-500 mt-0.5">Prize Pools & Stipends</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">45+</div>
              <div className="text-xs text-zinc-500 mt-0.5">Premier Host Labs</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">100%</div>
              <div className="text-xs text-zinc-500 mt-0.5">Free for Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "Closing Soon" Spotlight Bar (Time-sensitive urgency) */}
      {closingSoonItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Urgent Deadlines</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Closing Within 7 Days
              </h2>
            </div>
            <button
              onClick={onViewClosingSoon}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <span>View all closing soon</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {closingSoonItems.map((opp, idx) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                index={idx}
                isBookmarked={bookmarkedIds.includes(opp.id)}
                onToggleBookmark={onToggleBookmark}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Browse By Technical Field / Domain Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            Targeted Specializations
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Curated by Engineering Field
          </h2>
          <p className="text-sm text-zinc-400">
            Select your primary discipline to view vetted programs with real technical depth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card: Software Engineering */}
          <div
            onClick={() => onExplore({ domain: 'Software Engineering' })}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/25 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 group-hover:bg-red-900/40 transition-all duration-200">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-1">
                Software Engineering
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Distributed systems, systems programming, web platforms, and production cloud infrastructure.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono tabular-nums">40+ Active Programs</span>
              <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform duration-150">Explore →</span>
            </div>
          </div>

          {/* Card: AI / Machine Learning */}
          <div
            onClick={() => onExplore({ domain: 'AI / Machine Learning' })}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/25 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 group-hover:bg-red-900/40 transition-all duration-200">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-1">
                AI / Machine Learning
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Frontier LLM hackathons, autonomous agent sprints, Hugging Face residencies, and model evaluation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono tabular-nums">35+ Active Programs</span>
              <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform duration-150">Explore →</span>
            </div>
          </div>

          {/* Card: Electronics / VLSI & Silicon */}
          <div
            onClick={() => onExplore({ domain: 'Electronics / VLSI' })}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/25 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 group-hover:bg-red-900/40 transition-all duration-200">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-1">
                Electronics / VLSI & Chips
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ASIC design, Cadence physical layout fellowships, Qualcomm NPU firmware, and EDA automation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono tabular-nums">25+ Active Programs</span>
              <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform duration-150">Explore →</span>
            </div>
          </div>

          {/* Card: Open Source */}
          <div
            onClick={() => onExplore({ domain: 'Open Source' })}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/25 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 group-hover:bg-red-900/40 transition-all duration-200">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-1">
                Open Source & Kernel
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                GSoC stipends, Linux Foundation mentorship, upstream contributions, and community toolchains.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono tabular-nums">20+ Active Programs</span>
              <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform duration-150">Explore →</span>
            </div>
          </div>

          {/* Card: Scholarships & Fellowships */}
          <div
            onClick={() => onExplore({ category: 'Scholarship' })}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/25 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 group-hover:bg-red-900/40 transition-all duration-200">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-1">
                Scholarships & Grants
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generation Google scholarships, GHC travel grants, tuition support, and student academic honors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono tabular-nums">25+ Active Programs</span>
              <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform duration-150">Explore →</span>
            </div>
          </div>

          {/* Card: Hackathons & Competitions */}
          <div
            onClick={() => onExplore({ category: 'Hackathon' })}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/25 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 group-hover:bg-red-900/40 transition-all duration-200">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-1">
                Hackathons & Sprints
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                HackMIT, ICPC regionals, DEF CON student qualifiers, and fast-track founder bounties.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono tabular-nums">30+ Active Programs</span>
              <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform duration-150">Explore →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Flagship Opportunities Directory Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Hand-Vetted High-Impact
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Featured Flagship Programs
            </h2>
          </div>
          <button
            onClick={() => onExplore()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <span>View all 16+ programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredOpportunities.map((opp, idx) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              index={idx}
              isBookmarked={bookmarkedIds.includes(opp.id)}
              onToggleBookmark={onToggleBookmark}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      </section>

      {/* 5. Proof & Concrete Student Testimonials (Adhering to Claim-to-Proof Adjacency) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#141414] border border-white/10 p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Student Track Record
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Discovery to Signed Offers
            </h2>
            <p className="text-sm text-zinc-400">
              Real college engineers who navigated the competitive tech landscape using Opportunity Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-150 space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Secured the Cadence VLSI Physical Design fellowship through Opportunity Hub. The deadline countdown ensured our university lab turned in the RTL design samples before the early cutoff."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-white">Ananya Deshmukh</div>
                <div className="text-[11px] text-zinc-500">NIT Trichy ECE '27 · Cadence Fellow</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-150 space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Finding open source internships used to be a nightmare of scattered mailing lists. Opportunity Hub made applying for Linux Foundation Kernel Mentorship seamless."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-white">Marcus Vance</div>
                <div className="text-[11px] text-zinc-500">Purdue University CS '26 · Linux Mentee</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-150 space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Our 3-person team matched with the Autonomous AI Hackathon on this hub. We took 1st place in the consensus reasoning track and secured direct angel introductions."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-white">Claire Zheng</div>
                <div className="text-[11px] text-zinc-500">UC Berkeley CS '28 · Hackathon Winner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Host / Club Organizer CTA Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl transition-colors">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Organizing a hackathon, fellowship, or campus challenge?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              List your program on Opportunity Hub to reach thousands of verified collegiate engineers, developers, and researchers.
            </p>
          </div>

          <button
            onClick={onOpenSubmit}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0 text-white font-semibold text-xs shadow-md shadow-red-950/50 hover:shadow-red-600/30 transition-all duration-150 cursor-pointer shrink-0"
          >
            <span>Post an Opportunity</span>
            <Building2 className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
