import { StudentPreferences } from './opportunity';

export type UserRole = 'student' | 'university';

export interface UserProfile {
  uid: string;
  name: string;
  displayName: string;
  email: string;
  role: UserRole;
  organizationName: string; // University / College / Institution name
  createdAt: string;
  updatedAt: string;

  // Student specific fields
  degree?: string;          // e.g. B.Tech Computer Science, B.S. EECS
  gradYear?: string;        // e.g. 2026, 2027
  interests?: string[];     // Career/Academic domain tags
  bookmarkedOpportunities?: string[]; // IDs of bookmarked opportunities
  appliedOpportunities?: string[];    // IDs of opportunities applied to
  preferences?: StudentPreferences;

  // University specific fields
  department?: string;      // e.g. Office of Student Research, CS Dept
}
