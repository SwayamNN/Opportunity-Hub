import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityCategory, OpportunityDomain, OpportunityMode } from '../types/opportunity';
import { X, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opportunity: Opportunity) => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('Hackathon');
  const [domain, setDomain] = useState<OpportunityDomain>('Software Engineering');
  const [mode, setMode] = useState<OpportunityMode>('Remote');
  const [location, setLocation] = useState('Remote');
  const [deadline, setDeadline] = useState('2026-10-25');
  const [stipendOrPrize, setStipendOrPrize] = useState('$10,000 Prize Pool');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('Python, React, Web3');
  const [contactEmail, setContactEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen && userProfile) {
      if (!organization && userProfile.organizationName) {
        setOrganization(userProfile.organizationName);
      }
      if (!contactEmail && userProfile.email) {
        setContactEmail(userProfile.email);
      }
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim() || !shortDescription.trim() || !applyUrl.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const initials = organization
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'OH';

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newOpp: Opportunity = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      orgInitials: initials,
      orgColor: 'from-blue-600 to-indigo-800',
      category,
      domain,
      tags: tags.length > 0 ? tags : [category, domain],
      deadline: deadline || '2026-10-31',
      mode,
      location: location.trim() || 'Global Remote',
      stipendOrPrize: stipendOrPrize.trim() || 'Certificates & Mentorship',
      hasFinancialReward: stipendOrPrize.toLowerCase().includes('$') || stipendOrPrize.toLowerCase().includes('prize') || stipendOrPrize.toLowerCase().includes('stipend'),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      eligibility: [
        'Enrolled college / university students',
        'Valid student ID or institutional email'
      ],
      tracks: ['Open Innovation', 'Technical Implementation'],
      timeline: [
        { phase: 'Submissions Close', date: deadline, description: 'Final portal submission deadline.' }
      ],
      perks: [
        'Certificate of Participation',
        'Networking with student community and mentors'
      ],
      applyUrl: applyUrl.trim().startsWith('http') ? applyUrl.trim() : `https://${applyUrl.trim()}`,
      postedDate: '2026-09-27',
      applicantsCount: 1,
      contactEmail: contactEmail.trim()
    };

    onSubmit(newOpp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-[#141414] border border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto animate-dialog">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-400">
              <Plus className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Post an Opportunity</h2>
              <p className="text-xs text-zinc-400">Share hackathons, fellowships, or campus events with students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white active:scale-90 transition-all duration-150 cursor-pointer p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Opportunity Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NextGen Web3 Collegiate Hackathon"
              className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Host Organization *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. ACM Student Chapter"
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Application Portal URL *</label>
              <input
                type="url"
                required
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="https://hackathon.example.com/apply"
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors cursor-pointer"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Internship">Internship</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Competition">Competition</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as OpportunityDomain)}
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors cursor-pointer"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="Electronics / VLSI">Electronics / VLSI</option>
                <option value="Open Source">Open Source</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Hardware & Embedded">Hardware & Embedded</option>
                <option value="Research & Academics">Research & Academics</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as OpportunityMode)}
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-Site">On-Site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Prize / Stipend / Grant</label>
              <input
                type="text"
                value={stipendOrPrize}
                onChange={(e) => setStipendOrPrize(e.target.value)}
                placeholder="e.g. $5,000 Prizes or $3,500/mo"
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Short Summary (1-2 sentences) *</label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Briefly state what students build or accomplish, and key eligibility."
              className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, Next.js, PyTorch"
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="lead@studentclub.org"
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white active:scale-95 transition-all duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0 text-white font-semibold text-xs shadow-md shadow-red-950/50 hover:shadow-red-600/30 transition-all duration-150 cursor-pointer"
            >
              Publish Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
