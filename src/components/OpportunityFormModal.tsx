import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityCategory, OpportunityMode } from '../types/opportunity';
import { X, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OpportunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    organization: string;
    category: OpportunityCategory;
    description: string;
    eligibility: string;
    deadline: string;
    mode: OpportunityMode;
    location: string;
    skills: string[];
    applicationUrl: string;
    applicationLink?: string;
    published: boolean;
  }) => Promise<void>;
  initialData?: Opportunity | null;
}

export const OpportunityFormModal: React.FC<OpportunityFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const { userProfile } = useAuth();

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('Hackathon');
  const [mode, setMode] = useState<OpportunityMode>('Online');
  const [location, setLocation] = useState('Online / Global');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('Enrolled college students');
  const [skillsInput, setSkillsInput] = useState('Python, React');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFieldErrors({});
      setGeneralError('');
      setStatusFeedback(null);

      if (initialData) {
        setTitle(initialData.title || '');
        setOrganization(initialData.organization || userProfile?.organizationName || '');
        setCategory(initialData.category || 'Hackathon');

        let initialMode: OpportunityMode = 'Online';
        if (initialData.mode === 'Offline' || initialData.mode === 'On-Site') {
          initialMode = 'Offline';
        } else if (initialData.mode === 'Hybrid') {
          initialMode = 'Hybrid';
        } else {
          initialMode = 'Online';
        }
        setMode(initialMode);

        setLocation(initialData.location || 'Online / Global');
        setDeadline(initialData.deadline || '');
        setDescription(initialData.description || initialData.shortDescription || initialData.fullDescription || '');

        const eligStr = Array.isArray(initialData.eligibility) 
          ? initialData.eligibility.join(', ') 
          : (initialData.eligibility || 'Enrolled college students');
        setEligibility(eligStr);

        const skillsStr = Array.isArray(initialData.skills) 
          ? initialData.skills.join(', ') 
          : (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : 'Python, React');
        setSkillsInput(skillsStr);

        setApplicationUrl(initialData.applicationUrl || initialData.applyUrl || '');
        setPublished(initialData.published !== false);
      } else {
        setTitle('');
        setOrganization(userProfile?.organizationName || '');
        setCategory('Hackathon');
        setMode('Online');
        setLocation('Online / Global');

        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setDeadline(defaultDate.toISOString().split('T')[0]);

        setDescription('');
        setEligibility('Enrolled undergraduate, master\'s, or doctoral students');
        setSkillsInput('Python, TypeScript, Machine Learning');
        setApplicationUrl('');
        setPublished(true);
      }
    }
  }, [isOpen, initialData, userProfile]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Title is required.';
    }

    if (!organization.trim()) {
      errors.organization = 'Host organization or university is required.';
    }

    if (!location.trim()) {
      errors.location = 'Location is required (e.g., Online or City/Campus).';
    }

    if (!deadline.trim()) {
      errors.deadline = 'Application deadline date is required.';
    }

    if (!description.trim()) {
      errors.description = 'Opportunity description is required.';
    }

    if (!eligibility.trim()) {
      errors.eligibility = 'Eligibility requirements are required.';
    }

    const skills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (skills.length === 0) {
      errors.skills = 'Please enter at least one skill or topic.';
    }

    if (!applicationUrl.trim()) {
      errors.applicationUrl = 'Official application URL is required.';
    } else {
      const urlCandidate = applicationUrl.trim().startsWith('http') 
        ? applicationUrl.trim() 
        : `https://${applicationUrl.trim()}`;
      try {
        new URL(urlCandidate);
      } catch {
        errors.applicationUrl = 'Please enter a valid URL (e.g. https://example.com/apply).';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      return;
    }

    const skills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const finalUrl = applicationUrl.trim().startsWith('http')
      ? applicationUrl.trim()
      : `https://${applicationUrl.trim()}`;

    setLoading(true);
    setStatusFeedback('Saving...');
    try {
      await onSubmit({
        title: title.trim(),
        organization: organization.trim(),
        category,
        description: description.trim(),
        eligibility: eligibility.trim(),
        deadline,
        mode,
        location: location.trim(),
        skills,
        applicationUrl: finalUrl,
        applicationLink: finalUrl,
        published
      });

      setStatusFeedback(initialData ? 'Opportunity updated' : 'Opportunity created');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Save opportunity error:', err);
      setStatusFeedback(null);
      setGeneralError(err?.message || 'Failed to save opportunity. Please check your network and permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-[#111111] border border-[#262626] rounded-lg max-w-2xl w-full p-5 sm:p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#222222] mb-5">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {initialData ? 'Edit Opportunity' : 'Create Opportunity'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Fill in the sections below to publish to the student opportunities catalog.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {generalError && (
          <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-900/50 text-[#E53935] text-xs">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* SECTION 1: Basic Information */}
          <div className="bg-[#141414] border border-[#262626] rounded-md p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Opportunity Title <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Google Summer Fellowship 2026"
                className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              {fieldErrors.title && (
                <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Host Organization / University <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Stanford University or MIT Media Lab"
                  className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                {fieldErrors.organization && (
                  <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.organization}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Category <span className="text-[#E53935]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                  className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs focus:outline-none focus:border-zinc-500 cursor-pointer"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Internship">Internship</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Competition">Competition</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Opportunity Details */}
          <div className="bg-[#141414] border border-[#262626] rounded-md p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              2. Opportunity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Mode <span className="text-[#E53935]">*</span>
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as OpportunityMode)}
                  className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs focus:outline-none focus:border-zinc-500 cursor-pointer"
                >
                  <option value="Online">Online / Remote</option>
                  <option value="Offline">Offline / On-Site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Location <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Online, Seattle, WA"
                  className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                {fieldErrors.location && (
                  <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Deadline Date <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs focus:outline-none focus:border-zinc-500 font-mono"
                />
                {fieldErrors.deadline && (
                  <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.deadline}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Description & Program Overview <span className="text-[#E53935]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide a concise description of the opportunity, project expectations, and timelines..."
                className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              {fieldErrors.description && (
                <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.description}</p>
              )}
            </div>
          </div>

          {/* SECTION 3: Eligibility & Skills */}
          <div className="bg-[#141414] border border-[#262626] rounded-md p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              3. Eligibility & Skills
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Eligibility Requirements <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Enrolled college undergraduate students in CSE, ECE, or related fields"
                className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              {fieldErrors.eligibility && (
                <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.eligibility}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Relevant Skills (comma-separated) <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Python, PyTorch, React, Embedded Systems"
                className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              {fieldErrors.skills && (
                <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.skills}</p>
              )}
            </div>
          </div>

          {/* SECTION 4: Application Information */}
          <div className="bg-[#141414] border border-[#262626] rounded-md p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              4. Application Information
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Official Application URL <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="text"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://your-university.edu/fellowship/apply"
                className="w-full px-3 py-2 rounded bg-[#181818] border border-[#2B2B2B] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
              />
              {fieldErrors.applicationUrl && (
                <p className="text-[#E53935] text-[11px] mt-1">{fieldErrors.applicationUrl}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="publishedCheckbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded bg-[#181818] border-[#2B2B2B] text-[#E53935] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="publishedCheckbox" className="text-xs text-zinc-300 cursor-pointer">
                Publish immediately to the student discovery directory (uncheck to save as draft)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#222222] flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-400">
              {statusFeedback && (
                <span className="text-zinc-200 flex items-center gap-1.5 font-medium">
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E53935]" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{statusFeedback}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-3.5 py-1.5 rounded text-xs font-medium text-zinc-400 hover:text-white bg-[#161616] hover:bg-[#1E1E1E] border border-[#262626] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#E53935] hover:bg-[#d32f2f] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {loading 
                    ? 'Saving...' 
                    : initialData ? 'Update Opportunity' : 'Create Opportunity'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
