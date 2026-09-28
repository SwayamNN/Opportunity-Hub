export type OpportunityCategory = 
  | 'Hackathon'
  | 'Internship'
  | 'Workshop'
  | 'Competition'
  | 'Scholarship'
  | 'Fellowship'
  | 'Other';

export type OpportunityDomain = 
  | 'Software Engineering'
  | 'AI / Machine Learning'
  | 'Electronics / VLSI'
  | 'Cybersecurity'
  | 'Open Source'
  | 'Hardware & Embedded'
  | 'Research & Academics';

export type OpportunityMode = 'Online' | 'Offline' | 'Hybrid' | 'Remote' | 'On-Site';

export interface TimelineMilestone {
  phase: string;
  date: string;
  description: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  eligibility: string[];
  deadline: string; // ISO date string (YYYY-MM-DD)
  mode: OpportunityMode;
  location: string;

  // Primary fields per prompt
  description?: string;
  skills?: string[];
  applicationUrl?: string;
  applicationLink?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  organizationName?: string;

  // Extended / Visual compatibility fields
  domain?: OpportunityDomain;
  tags?: string[];
  orgInitials?: string;
  orgColor?: string;
  stipendOrPrize?: string;
  hasFinancialReward?: boolean;
  shortDescription?: string;
  fullDescription?: string;
  tracks?: string[];
  timeline?: TimelineMilestone[];
  perks?: string[];
  applyUrl?: string;
  featured?: boolean;
  closingUrgent?: boolean;
  postedDate?: string;
  applicantsCount?: number;
  contactEmail?: string;
  status?: 'Active' | 'Closing Soon' | 'Closed';
}

export interface StudentPreferences {
  domains: OpportunityDomain[];
  categories: OpportunityCategory[];
  modes: OpportunityMode[];
  onlyWithReward: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: OpportunityCategory | 'All';
  domain: OpportunityDomain | 'All';
  mode: OpportunityMode | 'All';
  deadlineRange: 'All' | '48h' | '7d' | '30d' | '60d+';
  rewardOnly: boolean;
  sortBy: 'deadline' | 'reward' | 'newest' | 'popular';
}
