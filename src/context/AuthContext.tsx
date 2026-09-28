import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, UserRole } from '../types/auth';
import { StudentPreferences } from '../types/opportunity';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<UserProfile>;
  signUpStudent: (data: {
    email: string;
    pass: string;
    name: string;
    college: string;
    degree: string;
    gradYear: string;
  }) => Promise<UserProfile>;
  signUpUniversity: (data: {
    email: string;
    pass: string;
    name: string;
    universityName: string;
    department: string;
  }) => Promise<UserProfile>;
  signInWithGoogle: (preferredRole?: UserRole) => Promise<{
    isNewUser: boolean;
    user: User;
    profile: UserProfile | null;
  }>;
  completeGoogleProfile: (data: {
    name: string;
    role: UserRole;
    organizationName: string;
    degree?: string;
    gradYear?: string;
    department?: string;
    interests?: string[];
  }) => Promise<UserProfile>;
  reloadProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  updateStudentBookmarks: (bookmarkIds: string[]) => Promise<void>;
  updateStudentInterests: (interests: string[]) => Promise<void>;
  updateStudentApplied: (appliedIds: string[]) => Promise<void>;
  updateStudentPreferences: (preferences: StudentPreferences) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user profile document from Firestore for a given authenticated UID
  const fetchProfileFromFirestore = async (uid: string, fallbackUser?: User): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        const profile: UserProfile = {
          uid: uid,
          name: data.name || fallbackUser?.displayName || 'User',
          displayName: data.displayName || data.name || fallbackUser?.displayName || 'User',
          email: data.email || fallbackUser?.email || '',
          role: (data.role === 'university' ? 'university' : 'student') as UserRole,
          organizationName: data.organizationName || '',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
          degree: data.degree || '',
          gradYear: data.gradYear || '',
          department: data.department || '',
          interests: Array.isArray(data.interests) ? data.interests : [],
          bookmarkedOpportunities: Array.isArray(data.bookmarkedOpportunities) ? data.bookmarkedOpportunities : [],
          appliedOpportunities: Array.isArray(data.appliedOpportunities) ? data.appliedOpportunities : [],
          preferences: data.preferences || undefined
        };
        return profile;
      }
      return null;
    } catch (err) {
      console.warn('Error reading user profile from Firestore:', err);
      return null;
    }
  };

  // Sync auth state listener with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Authenticated user found, load their exact Firestore profile
        const profile = await fetchProfileFromFirestore(user.uid, user);
        setUserProfile(profile);
      } else {
        // Logged out: strictly clear user state
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const reloadProfile = async (): Promise<UserProfile | null> => {
    if (!auth.currentUser) return null;
    const profile = await fetchProfileFromFirestore(auth.currentUser.uid, auth.currentUser);
    setUserProfile(profile);
    return profile;
  };

  // Real Email/Password Login via Firebase Auth
  const signIn = async (email: string, pass: string): Promise<UserProfile> => {
    // Authenticate through Firebase Authentication
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await fetchProfileFromFirestore(cred.user.uid, cred.user);
    
    if (!profile) {
      throw new Error('User profile record not found in Firestore. Please register first.');
    }

    setUserProfile(profile);
    return profile;
  };

  // Real Student Sign Up via Firebase Auth
  const signUpStudent = async (data: {
    email: string;
    pass: string;
    name: string;
    college: string;
    degree: string;
    gradYear: string;
  }): Promise<UserProfile> => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.pass);
    await updateProfile(cred.user, { displayName: data.name.trim() });
    
    const now = new Date().toISOString();
    const profile: UserProfile = {
      uid: cred.user.uid,
      name: data.name.trim(),
      displayName: data.name.trim(),
      email: data.email.trim(),
      role: 'student',
      organizationName: data.college.trim(),
      degree: data.degree.trim(),
      gradYear: data.gradYear.trim(),
      interests: [],
      bookmarkedOpportunities: [],
      appliedOpportunities: [],
      createdAt: now,
      updatedAt: now
    };

    // Save strictly to users/{uid} in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    setUserProfile(profile);
    return profile;
  };

  // Real University Sign Up via Firebase Auth
  const signUpUniversity = async (data: {
    email: string;
    pass: string;
    name: string;
    universityName: string;
    department: string;
  }): Promise<UserProfile> => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.pass);
    await updateProfile(cred.user, { displayName: data.name.trim() });
    
    const now = new Date().toISOString();
    const profile: UserProfile = {
      uid: cred.user.uid,
      name: data.name.trim(),
      displayName: data.name.trim(),
      email: data.email.trim(),
      role: 'university',
      organizationName: data.universityName.trim(),
      department: data.department.trim(),
      createdAt: now,
      updatedAt: now
    };

    // Save strictly to users/{uid} in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    setUserProfile(profile);
    return profile;
  };

  // Real Google Sign-In via Firebase Auth
  const signInWithGoogle = async (preferredRole?: UserRole): Promise<{
    isNewUser: boolean;
    user: User;
    profile: UserProfile | null;
  }> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;

    const existingProfile = await fetchProfileFromFirestore(user.uid, user);

    if (existingProfile) {
      setUserProfile(existingProfile);
      return { isNewUser: false, user, profile: existingProfile };
    } else {
      // New user from Google: profile is created during onboarding
      setUserProfile(null);
      return { isNewUser: true, user, profile: null };
    }
  };

  // Complete Google Registration for new Google user
  const completeGoogleProfile = async (data: {
    name: string;
    role: UserRole;
    organizationName: string;
    degree?: string;
    gradYear?: string;
    department?: string;
    interests?: string[];
  }): Promise<UserProfile> => {
    if (!auth.currentUser) {
      throw new Error('Not authenticated with Google. Please try signing in again.');
    }
    const user = auth.currentUser;
    const now = new Date().toISOString();

    const profile: UserProfile = {
      uid: user.uid,
      name: data.name.trim() || user.displayName || (data.role === 'university' ? 'Representative' : 'Student'),
      displayName: data.name.trim() || user.displayName || (data.role === 'university' ? 'Representative' : 'Student'),
      email: user.email || '',
      role: data.role,
      organizationName: data.organizationName.trim(),
      degree: data.role === 'student' ? (data.degree?.trim() || 'Undergraduate') : '',
      gradYear: data.role === 'student' ? (data.gradYear?.trim() || '2027') : '',
      department: data.role === 'university' ? (data.department?.trim() || 'General Department') : '',
      interests: data.role === 'student' && Array.isArray(data.interests) ? data.interests : [],
      bookmarkedOpportunities: [],
      appliedOpportunities: [],
      createdAt: now,
      updatedAt: now
    };

    // Save directly to users/{user.uid}
    await setDoc(doc(db, 'users', user.uid), profile);

    const loadedProfile = await fetchProfileFromFirestore(user.uid, user);
    const finalProfile = loadedProfile || profile;
    setUserProfile(finalProfile);
    return finalProfile;
  };

  // Update profile information (strictly for auth.currentUser.uid)
  const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    if (!auth.currentUser || !userProfile) {
      throw new Error('Not authenticated.');
    }
    const uid = auth.currentUser.uid;
    const now = new Date().toISOString();
    const userDocRef = doc(db, 'users', uid);

    const updatePayload: Record<string, any> = {
      updatedAt: now,
      uid: uid
    };

    if (data.name !== undefined) {
      updatePayload.name = data.name.trim();
      updatePayload.displayName = data.name.trim();
    }
    if (data.organizationName !== undefined) {
      updatePayload.organizationName = data.organizationName.trim();
    }
    if (data.degree !== undefined) {
      updatePayload.degree = data.degree.trim();
    }
    if (data.gradYear !== undefined) {
      updatePayload.gradYear = data.gradYear.trim();
    }
    if (data.department !== undefined) {
      updatePayload.department = data.department.trim();
    }
    if (data.interests !== undefined) {
      updatePayload.interests = data.interests;
    }
    if (data.bookmarkedOpportunities !== undefined) {
      updatePayload.bookmarkedOpportunities = data.bookmarkedOpportunities;
    }
    if (data.appliedOpportunities !== undefined) {
      updatePayload.appliedOpportunities = data.appliedOpportunities;
    }

    await updateDoc(userDocRef, updatePayload);

    const updatedProfile: UserProfile = {
      ...userProfile,
      ...updatePayload
    };

    setUserProfile(updatedProfile);
    return updatedProfile;
  };

  // Update student bookmarks in Firestore (strictly for auth.currentUser.uid)
  const updateStudentBookmarks = async (bookmarkIds: string[]): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    const now = new Date().toISOString();
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        bookmarkedOpportunities: bookmarkIds,
        updatedAt: now,
        uid: uid
      });
      setUserProfile(prev => prev ? { ...prev, bookmarkedOpportunities: bookmarkIds, updatedAt: now } : null);
    } catch (err) {
      console.warn('Failed to persist bookmarks to Firestore:', err);
      throw err;
    }
  };

  // Update student interests in Firestore (strictly for auth.currentUser.uid)
  const updateStudentInterests = async (interests: string[]): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    const now = new Date().toISOString();
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        interests: interests,
        updatedAt: now,
        uid: uid
      });
      setUserProfile(prev => prev ? { ...prev, interests: interests, updatedAt: now } : null);
    } catch (err) {
      console.warn('Failed to persist interests to Firestore:', err);
      throw err;
    }
  };

  // Update student applied opportunities in Firestore
  const updateStudentApplied = async (appliedIds: string[]): Promise<void> => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const now = new Date().toISOString();
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        appliedOpportunities: appliedIds,
        updatedAt: now,
        uid: uid
      });
      setUserProfile(prev => prev ? { ...prev, appliedOpportunities: appliedIds, updatedAt: now } : null);
    } catch (err) {
      console.warn('Failed to persist applied opportunities to Firestore:', err);
    }
  };

  // Update student preferences in Firestore
  const updateStudentPreferences = async (preferences: StudentPreferences): Promise<void> => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const now = new Date().toISOString();
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        preferences: preferences,
        interests: preferences.domains || [],
        updatedAt: now,
        uid: uid
      });
      setUserProfile(prev => prev ? { 
        ...prev, 
        preferences: preferences, 
        interests: preferences.domains || [], 
        updatedAt: now 
      } : null);
    } catch (err) {
      console.warn('Failed to persist preferences to Firestore:', err);
    }
  };

  // Real Sign Out: clears user sessions completely
  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      signIn,
      signUpStudent,
      signUpUniversity,
      signInWithGoogle,
      completeGoogleProfile,
      reloadProfile,
      updateUserProfile,
      updateStudentBookmarks,
      updateStudentInterests,
      updateStudentApplied,
      updateStudentPreferences,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
