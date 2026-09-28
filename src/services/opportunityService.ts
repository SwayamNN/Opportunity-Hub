import { 
  collection, 
  doc, 
  addDoc,
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Opportunity, OpportunityCategory, OpportunityMode } from '../types/opportunity';
import { INITIAL_OPPORTUNITIES } from '../data/mockOpportunities';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function normalizeOpportunity(data: any, id?: string): Opportunity {
  const docId = id || data.id || `opp-${Date.now()}`;
  const desc = data.description || data.shortDescription || data.fullDescription || 'No description provided.';
  const rawSkills = Array.isArray(data.skills) 
    ? data.skills 
    : (Array.isArray(data.tags) ? data.tags : (typeof data.skills === 'string' ? data.skills.split(',').map((s: string) => s.trim()) : []));
  const skills = rawSkills.length > 0 ? rawSkills : ['Software Engineering', 'Collegiate'];

  const appUrl = data.applicationLink || data.applicationUrl || data.applyUrl || '#';
  const orgName = data.organization || data.organizationName || 'University / Institution';
  const orgInitials = data.orgInitials || (orgName ? orgName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() : 'OH');
  const orgColor = data.orgColor || 'from-red-600 to-zinc-800';
  
  let eligibilityList: string[] = [];
  if (Array.isArray(data.eligibility)) {
    eligibilityList = data.eligibility;
  } else if (typeof data.eligibility === 'string' && data.eligibility.trim()) {
    eligibilityList = [data.eligibility.trim()];
  } else {
    eligibilityList = ['Enrolled college / university students', 'Valid student ID'];
  }

  // Calculate status based on deadline
  const deadline = data.deadline || '2026-10-31';
  const deadlineDate = new Date(`${deadline}T23:59:59Z`).getTime();
  const simulatedNow = new Date('2026-09-27T00:00:00Z').getTime();
  const diffDays = Math.ceil((deadlineDate - simulatedNow) / (1000 * 60 * 60 * 24));
  
  let computedStatus: 'Active' | 'Closing Soon' | 'Closed' = 'Active';
  if (diffDays < 0) {
    computedStatus = 'Closed';
  } else if (diffDays <= 7) {
    computedStatus = 'Closing Soon';
  }

  const createdAt = data.createdAt || data.postedDate || new Date().toISOString();
  const updatedAt = data.updatedAt || createdAt;

  return {
    id: docId,
    title: data.title || 'Untitled Opportunity',
    organization: orgName,
    organizationName: orgName,
    category: data.category || 'Hackathon',
    description: desc,
    shortDescription: data.shortDescription || desc,
    fullDescription: data.fullDescription || desc,
    eligibility: eligibilityList,
    deadline,
    mode: data.mode || 'Online',
    location: data.location || 'Global Remote',
    skills,
    tags: skills,
    applicationUrl: appUrl,
    applicationLink: appUrl,
    applyUrl: appUrl,
    createdBy: data.createdBy || 'system',
    createdAt,
    updatedAt,
    published: data.published !== false,
    postedDate: data.postedDate || data.createdAt || '2026-09-27',
    orgInitials,
    orgColor,
    domain: data.domain || 'Software Engineering',
    stipendOrPrize: data.stipendOrPrize || 'Certificates & Recognition',
    hasFinancialReward: data.hasFinancialReward ?? (data.stipendOrPrize ? (data.stipendOrPrize.includes('$') || data.stipendOrPrize.toLowerCase().includes('prize')) : false),
    tracks: data.tracks || ['Open Innovation Track', 'General Track'],
    timeline: data.timeline || [
      { phase: 'Submissions Close', date: deadline, description: 'Final portal submission deadline.' }
    ],
    perks: data.perks || ['Official Certificate of Participation', 'Networking with Mentors'],
    applicantsCount: data.applicantsCount || 0,
    contactEmail: data.contactEmail || '',
    status: data.status || computedStatus
  };
}

/**
 * Fetch all published opportunities directly from Firestore.
 * Students retrieve published opportunities (published == true).
 */
export async function getPublishedOpportunities(): Promise<Opportunity[]> {
  const path = 'opportunities(published==true)';
  try {
    const oppsCollection = collection(db, 'opportunities');
    const q = query(oppsCollection, where('published', '==', true));
    const snapshot = await getDocs(q);

    const firestoreOpps: Opportunity[] = snapshot.docs.map((docSnap) => 
      normalizeOpportunity(docSnap.data(), docSnap.id)
    );
    // Sort descending by createdAt (newest first)
    firestoreOpps.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

    // Merge with base catalog opportunities (avoiding any duplicate IDs)
    const firestoreIds = new Set(firestoreOpps.map(o => o.id));
    const baseCatalog = INITIAL_OPPORTUNITIES
      .map(o => normalizeOpportunity(o, o.id))
      .filter(o => !firestoreIds.has(o.id));

    return [...firestoreOpps, ...baseCatalog];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Real-time listener for published opportunities in Firestore.
 * Students automatically receive new or updated published opportunities.
 */
export function subscribeToPublishedOpportunities(
  onUpdate: (opportunities: Opportunity[]) => void,
  onError?: (err: any) => void
) {
  const path = 'opportunities(published==true)';
  try {
    const oppsCollection = collection(db, 'opportunities');
    const q = query(oppsCollection, where('published', '==', true));

    return onSnapshot(
      q,
      (snapshot) => {
        const firestoreOpps: Opportunity[] = snapshot.docs.map((docSnap) => 
          normalizeOpportunity(docSnap.data(), docSnap.id)
        );
        firestoreOpps.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

        const firestoreIds = new Set(firestoreOpps.map(o => o.id));
        const baseCatalog = INITIAL_OPPORTUNITIES
          .map(o => normalizeOpportunity(o, o.id))
          .filter(o => !firestoreIds.has(o.id));

        onUpdate([...firestoreOpps, ...baseCatalog]);
      },
      (error) => {
        console.error('Firestore published opportunities subscription error:', error);
        if (onError) onError(error);
        // Fallback to base seed catalog if Firestore query errors
        onUpdate(INITIAL_OPPORTUNITIES.map(o => normalizeOpportunity(o, o.id)));
      }
    );
  } catch (err) {
    console.error('Failed to initialize published opportunities listener:', err);
    onUpdate(INITIAL_OPPORTUNITIES.map(o => normalizeOpportunity(o, o.id)));
    return () => {};
  }
}

/**
 * Alias for backwards compatibility
 */
export const subscribeToOpportunities = subscribeToPublishedOpportunities;

/**
 * Fetch opportunities created by the specific authenticated university UID.
 * Ensures University A sees only their own listings.
 */
export async function getUniversityOpportunities(userUid: string): Promise<Opportunity[]> {
  if (!userUid) return [];
  const path = `opportunities(createdBy==${userUid})`;
  try {
    const oppsCollection = collection(db, 'opportunities');
    const q = query(oppsCollection, where('createdBy', '==', userUid));
    const snapshot = await getDocs(q);

    const opps: Opportunity[] = snapshot.docs.map((docSnap) => 
      normalizeOpportunity(docSnap.data(), docSnap.id)
    );
    opps.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    return opps;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

/**
 * Real-time listener for opportunities created by a specific university.
 * Uses query `createdBy == currentUser.uid`.
 */
export function subscribeToUniversityOpportunities(
  userUid: string,
  onUpdate: (opportunities: Opportunity[]) => void,
  onError?: (err: any) => void
) {
  if (!userUid) {
    onUpdate([]);
    return () => {};
  }
  const path = `opportunities(createdBy==${userUid})`;
  try {
    const oppsCollection = collection(db, 'opportunities');
    const q = query(oppsCollection, where('createdBy', '==', userUid));

    return onSnapshot(
      q,
      (snapshot) => {
        const opps: Opportunity[] = snapshot.docs.map((docSnap) => 
          normalizeOpportunity(docSnap.data(), docSnap.id)
        );
        opps.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        onUpdate(opps);
      },
      (error) => {
        console.error('Firestore university opportunities subscription error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error('Failed to initialize university opportunities listener:', err);
    return () => {};
  }
}

/**
 * Create a new opportunity in Firestore.
 * Requirements:
 * - Validate required fields
 * - Create unique document with addDoc()
 * - Store title, organization, description, category, eligibility, deadline, mode, location,
 *   applicationLink, skills, published, createdBy (Firebase Auth UID), createdAt, updatedAt
 * - Verify write succeeds before returning
 */
export async function createFirestoreOpportunity(data: {
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  eligibility: string;
  deadline: string;
  mode: OpportunityMode;
  location: string;
  skills: string[];
  applicationUrl?: string;
  applicationLink?: string;
  published: boolean;
  stipendOrPrize?: string;
  domain?: string;
}): Promise<Opportunity> {
  if (!auth.currentUser) {
    throw new Error('Authentication required: You must be signed in to create opportunities.');
  }

  // Derive unique creator UID strictly from Firebase Authentication
  const userUid = auth.currentUser.uid;
  const now = new Date().toISOString();
  const link = (data.applicationLink || data.applicationUrl || '').trim();

  // Validate required fields
  if (!data.title?.trim()) {
    throw new Error('Opportunity title is required.');
  }
  if (!data.organization?.trim()) {
    throw new Error('Host organization / university is required.');
  }
  if (!data.category) {
    throw new Error('Category is required.');
  }
  if (!data.description?.trim()) {
    throw new Error('Description is required.');
  }
  if (!data.deadline?.trim()) {
    throw new Error('Deadline date is required.');
  }
  if (!data.mode) {
    throw new Error('Mode is required.');
  }
  if (!data.location?.trim()) {
    throw new Error('Location is required.');
  }
  if (!link) {
    throw new Error('Official application URL / link is required.');
  }

  const payload = {
    title: data.title.trim(),
    organization: data.organization.trim(),
    organizationName: data.organization.trim(),
    category: data.category,
    description: data.description.trim(),
    eligibility: data.eligibility ? data.eligibility.trim() : 'Enrolled students',
    deadline: data.deadline,
    mode: data.mode,
    location: data.location.trim(),
    skills: Array.isArray(data.skills) ? data.skills : [],
    tags: Array.isArray(data.skills) ? data.skills : [],
    applicationLink: link,
    applicationUrl: link,
    applyUrl: link,
    published: Boolean(data.published),
    createdBy: userUid,
    createdAt: now,
    updatedAt: now
  };

  const path = 'opportunities';
  try {
    const oppsCollection = collection(db, 'opportunities');
    // Using addDoc() to write to Firestore and obtain unique ID
    const docRef = await addDoc(oppsCollection, payload);
    return normalizeOpportunity(payload, docRef.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Update an existing opportunity in Firestore.
 * Verifies that createdBy == auth.currentUser.uid.
 */
export async function updateFirestoreOpportunity(
  opportunityId: string,
  data: {
    title: string;
    organization: string;
    category: OpportunityCategory;
    description: string;
    eligibility: string;
    deadline: string;
    mode: OpportunityMode;
    location: string;
    skills: string[];
    applicationUrl?: string;
    applicationLink?: string;
    published: boolean;
  }
): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Authentication required: You must be signed in.');
  }
  const userUid = auth.currentUser.uid;
  const path = `opportunities/${opportunityId}`;

  try {
    const docRef = doc(db, 'opportunities', opportunityId);
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      throw new Error('Opportunity does not exist in Firestore.');
    }
    
    // Strict ownership verification: university can only edit opportunities they created
    if (existingSnap.data().createdBy !== userUid) {
      throw new Error('Unauthorized: You can only edit opportunities created by your university account.');
    }

    const now = new Date().toISOString();
    const link = (data.applicationLink || data.applicationUrl || '').trim();

    const payload = {
      title: data.title.trim(),
      organization: data.organization.trim(),
      organizationName: data.organization.trim(),
      category: data.category,
      description: data.description.trim(),
      eligibility: data.eligibility.trim(),
      deadline: data.deadline,
      mode: data.mode,
      location: data.location.trim(),
      skills: data.skills,
      tags: data.skills,
      applicationLink: link,
      applicationUrl: link,
      applyUrl: link,
      published: Boolean(data.published),
      updatedAt: now,
      createdBy: userUid // Keep immutable
    };
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Delete an opportunity from Firestore.
 * Verifies that createdBy == auth.currentUser.uid.
 */
export async function deleteFirestoreOpportunity(
  opportunityId: string
): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Authentication required.');
  }
  const userUid = auth.currentUser.uid;
  const path = `opportunities/${opportunityId}`;

  try {
    const docRef = doc(db, 'opportunities', opportunityId);
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      throw new Error('Opportunity does not exist in Firestore.');
    }

    // Strict ownership verification: university can only delete opportunities they created
    if (existingSnap.data().createdBy !== userUid) {
      throw new Error('Unauthorized: You can only delete opportunities created by your university account.');
    }

    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}
