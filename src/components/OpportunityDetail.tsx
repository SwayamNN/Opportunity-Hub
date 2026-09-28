import React, { useState } from 'react';
import { Opportunity } from '../types/opportunity';
import { formatDeadlineRelative, formatDisplayDate } from '../utils/storage';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Check, 
  Calendar, 
  MapPin, 
  Award, 
  Users, 
  Mail,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onApply: (opportunity: Opportunity) => void;
  hasApplied: boolean;
  onSelectRelated: (opportunity: Opportunity) => void;
  allOpportunities: Opportunity[];
  onTriggerToast: (msg: string) => void;
}

export const OpportunityDetail: React.FC<OpportunityDetailProps> = ({
  opportunity,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onApply,
  hasApplied,
  allOpportunities,
  onTriggerToast
}) => {
  const [copied, setCopied] = useState(false);
  const deadlineInfo = formatDeadlineRelative(opportunity.deadline);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      onTriggerToast('Opportunity link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onTriggerToast('Link ready to share');
    }
  };

  const skillsList = opportunity.skills || opportunity.tags || [];
  const eligibilityList = Array.isArray(opportunity.eligibility) 
    ? opportunity.eligibility 
    : (opportunity.eligibility ? [opportunity.eligibility] : ['Enrolled undergraduate or graduate students in accredited universities.']);

  // Requirements / prerequisites
  const requirementsList: string[] = (opportunity as any).requirements || [
    'Valid student identification or current enrollment status',
    'Familiarity with listed technologies and tools',
    'Ability to commit to project/program milestone schedule'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <div className="mb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to opportunities</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left / Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header block */}
          <div className="border-b border-[#262626] pb-5">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
              <span className="font-semibold text-zinc-200">{opportunity.organization}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400">{opportunity.category}</span>
              {opportunity.domain && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-zinc-400">{opportunity.domain}</span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              {opportunity.title}
            </h1>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {opportunity.shortDescription}
            </p>
          </div>

          {/* Description */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Description
            </h2>
            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-3">
              {opportunity.description || opportunity.fullDescription || opportunity.shortDescription || 'No description provided.'}
            </div>
          </section>

          {/* Eligibility */}
          <section className="space-y-2 pt-2 border-t border-[#222222]">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Eligibility
            </h2>
            <ul className="space-y-2 text-sm text-zinc-300">
              {eligibilityList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section className="space-y-2 pt-2 border-t border-[#222222]">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Requirements
            </h2>
            <ul className="space-y-2 text-sm text-zinc-300">
              {requirementsList.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-2" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Relevant Skills */}
          {skillsList.length > 0 && (
            <section className="space-y-2 pt-2 border-t border-[#222222]">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Relevant Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-[#141414] text-zinc-300 border border-[#262626]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Additional Information (Timeline & Host details) */}
          <section className="space-y-3 pt-2 border-t border-[#222222]">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Additional Information
            </h2>
            
            {opportunity.timeline && opportunity.timeline.length > 0 && (
              <div className="space-y-2 mb-4">
                <span className="text-xs font-medium text-zinc-300 block">Milestones & Schedule:</span>
                <div className="space-y-2 pl-3 border-l border-[#262626]">
                  {opportunity.timeline.map((step, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center justify-between text-zinc-200 font-medium">
                        <span>{step.phase}</span>
                        <span className="font-mono text-zinc-500">{step.date}</span>
                      </div>
                      {step.description && (
                        <p className="text-zinc-400 text-[11px] mt-0.5">{step.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-zinc-400 space-y-1">
              <div>
                <span>Posted by: </span>
                <span className="text-zinc-200 font-medium">{opportunity.organization}</span>
              </div>
              {opportunity.contactEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <a href={`mailto:${opportunity.contactEmail}`} className="text-zinc-300 hover:underline">
                    {opportunity.contactEmail}
                  </a>
                </div>
              )}
              <div className="text-[11px] text-zinc-500 pt-1">
                Posted on {formatDisplayDate(opportunity.postedDate || opportunity.createdAt || '2026-09-27')} · Verified student opportunity
              </div>
            </div>
          </section>
        </div>

        {/* Right / Sidebar Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg bg-[#111111] border border-[#262626] p-4 space-y-4 shadow-sm sticky top-20">
            {/* Primary CTA */}
            <div className="space-y-2">
              <button
                onClick={() => onApply(opportunity)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-xs sm:text-sm text-white bg-[#E53935] hover:bg-[#d32f2f] transition-colors cursor-pointer"
              >
                <span>{hasApplied ? 'Applied ✓' : 'Apply on Official Website'}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleBookmark(opportunity.id)}
                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#E53935]/10 text-[#E53935] border-[#E53935]/40'
                    : 'bg-[#161616] text-zinc-300 hover:text-white hover:bg-[#1E1E1E] border-[#262626]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Opportunity'}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-[#161616] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link copied' : 'Share opportunity'}</span>
              </button>
            </div>

            {/* Structured Metadata Box */}
            <div className="pt-3 border-t border-[#222222] space-y-3 text-xs">
              {/* Deadline */}
              <div>
                <span className="text-[11px] text-zinc-500 block mb-0.5">Application Deadline</span>
                <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-mono tabular-nums">{formatDisplayDate(opportunity.deadline)}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-[11px]">
                  <Clock className={`w-3 h-3 ${deadlineInfo.urgent ? 'text-[#E53935]' : 'text-zinc-500'}`} />
                  <span className={`font-mono tabular-nums ${deadlineInfo.urgent ? 'text-[#E53935] font-semibold' : 'text-zinc-500'}`}>
                    {deadlineInfo.label}
                  </span>
                </div>
              </div>

              {/* Mode */}
              <div>
                <span className="text-[11px] text-zinc-500 block mb-0.5">Participation Mode</span>
                <div className="text-zinc-200 font-medium">
                  {opportunity.mode}
                </div>
              </div>

              {/* Location */}
              <div>
                <span className="text-[11px] text-zinc-500 block mb-0.5">Location</span>
                <div className="flex items-center gap-1.5 text-zinc-200">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{opportunity.location}</span>
                </div>
              </div>

              {/* Financial Reward / Stipend */}
              {opportunity.stipendOrPrize && (
                <div>
                  <span className="text-[11px] text-zinc-500 block mb-0.5">Stipend / Prize</span>
                  <div className="flex items-center gap-1.5 font-mono font-semibold text-zinc-200">
                    <Award className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{opportunity.stipendOrPrize}</span>
                  </div>
                </div>
              )}

              {/* Applicants */}
              {opportunity.applicantsCount && (
                <div>
                  <span className="text-[11px] text-zinc-500 block mb-0.5">Applicant Activity</span>
                  <div className="flex items-center gap-1.5 font-mono text-zinc-300">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{opportunity.applicantsCount} applied</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
