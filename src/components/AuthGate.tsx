import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  Lock, 
  Mail, 
  User as UserIcon, 
  School, 
  BookOpen, 
  Calendar, 
  AlertCircle,
  Loader2, 
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

interface AuthGateProps {
  onSuccess?: (role: UserRole) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onSuccess }) => {
  const { 
    signIn, 
    signUpStudent, 
    signUpUniversity, 
    signInWithGoogle, 
    completeGoogleProfile 
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Common inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific inputs
  const [studentName, setStudentName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [degree, setDegree] = useState('');
  const [gradYear, setGradYear] = useState('2027');

  // University specific inputs
  const [repName, setRepName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [department, setDepartment] = useState('');

  // Google Onboarding Modal
  const [googleRole, setGoogleRole] = useState<UserRole>('student');
  const [googleName, setGoogleName] = useState('');
  const [googleOrgName, setGoogleOrgName] = useState('');
  const [googleDegree, setGoogleDegree] = useState('Undergraduate');
  const [googleGradYear, setGoogleGradYear] = useState('2027');
  const [googleDepartment, setGoogleDepartment] = useState('');
  const [googleInterests, setGoogleInterests] = useState<string[]>([
    'AI / Machine Learning', 
    'Software Development'
  ]);

  const { currentUser, userProfile, signOut } = useAuth();
  const isPendingGoogleOnboarding = !!currentUser && !userProfile;

  React.useEffect(() => {
    if (currentUser && !userProfile) {
      setGoogleName(currentUser.displayName || currentUser.email?.split('@')[0] || '');
      if (selectedRole) {
        setGoogleRole(selectedRole);
      }
    }
  }, [currentUser, userProfile, selectedRole]);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setGoogleRole(role);
    setErrorMessage(null);
    setEmail('');
    setPassword('');
  };

  const handleBackToRoleSelect = () => {
    setSelectedRole(null);
    setErrorMessage(null);
  };

  const handleGoogleSignIn = async (roleHint?: UserRole) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const targetRole = roleHint || selectedRole || 'student';
      setGoogleRole(targetRole);
      const result = await signInWithGoogle(targetRole);

      if (result.isNewUser) {
        setGoogleName(result.user.displayName || result.user.email?.split('@')[0] || '');
      } else if (result.profile) {
        if (onSuccess) onSuccess(result.profile.role);
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      let msg = err?.message || 'Google sign-in was not completed.';
      if (msg.includes('auth/popup-closed-by-user')) {
        msg = 'Sign-in popup was closed before completing. Please try again.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoogleInterest = (tag: string) => {
    setGoogleInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCompleteGoogleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!googleOrgName.trim()) {
      setErrorMessage(googleRole === 'university' ? 'Please enter your university or institution name.' : 'Please enter your college name.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const profile = await completeGoogleProfile({
        name: googleName.trim() || currentUser.displayName || 'User',
        role: googleRole,
        organizationName: googleOrgName.trim(),
        degree: googleRole === 'student' ? (googleDegree.trim() || 'Undergraduate') : undefined,
        gradYear: googleRole === 'student' ? googleGradYear : undefined,
        department: googleRole === 'university' ? (googleDepartment.trim() || 'Faculty Office') : undefined,
        interests: googleRole === 'student' ? googleInterests : []
      });

      if (onSuccess) onSuccess(profile.role);
    } catch (err: any) {
      console.error('Failed to complete Google profile:', err);
      setErrorMessage(err?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (authMode === 'signin') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        const profile = await signIn(email.trim(), password);
        if (onSuccess) onSuccess(profile.role);
      } else {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        if (selectedRole === 'student') {
          if (!studentName.trim()) throw new Error('Please enter your full name.');
          if (!collegeName.trim()) throw new Error('Please specify your university or college.');
          if (!email.trim()) throw new Error('Please enter your email address.');

          const profile = await signUpStudent({
            email: email.trim(),
            pass: password,
            name: studentName.trim(),
            college: collegeName.trim(),
            degree: degree.trim() || 'Undergraduate',
            gradYear: gradYear.trim()
          });
          if (onSuccess) onSuccess(profile.role);
        } else {
          if (!repName.trim()) throw new Error('Please enter the representative name.');
          if (!universityName.trim()) throw new Error('Please enter your university or institution name.');
          if (!department.trim()) throw new Error('Please enter your department or office.');
          if (!email.trim()) throw new Error('Please enter your official email.');

          const profile = await signUpUniversity({
            email: email.trim(),
            pass: password,
            name: repName.trim(),
            universityName: universityName.trim(),
            department: department.trim()
          });
          if (onSuccess) onSuccess(profile.role);
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let friendlyMsg = err?.message || 'Authentication failed. Please check your credentials.';
      if (friendlyMsg.includes('auth/email-already-in-use')) {
        friendlyMsg = 'This email is already registered. Please switch to Sign In.';
      } else if (
        friendlyMsg.includes('auth/invalid-credential') || 
        friendlyMsg.includes('auth/wrong-password') ||
        friendlyMsg.includes('auth/user-not-found')
      ) {
        friendlyMsg = 'Invalid email or password. Please verify your credentials.';
      } else if (friendlyMsg.includes('auth/weak-password')) {
        friendlyMsg = 'Password must be at least 6 characters.';
      } else if (friendlyMsg.includes('auth/invalid-email')) {
        friendlyMsg = 'Please enter a valid email address.';
      }
      setErrorMessage(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#E53935] flex items-center justify-center text-white font-bold text-xs">
            OH
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Opportunity Hub
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Curated opportunities for students and academic hosts
        </p>
      </div>

      {/* STAGE 1: Choose Role */}
      {!selectedRole && !isPendingGoogleOnboarding && (
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-5 sm:p-7 space-y-5 shadow-lg">
            <div className="text-center space-y-1">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Sign in to Opportunity Hub
              </h1>
              <p className="text-xs text-zinc-400">
                Continue with Google or select your account type below.
              </p>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => handleGoogleSignIn()}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#161616] hover:bg-[#1E1E1E] border border-[#262626] hover:border-zinc-700 rounded-md text-xs font-medium text-white flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#262626]" />
              <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">or select role</span>
              <div className="flex-1 h-px bg-[#262626]" />
            </div>

            {/* Role Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Student */}
              <button
                type="button"
                onClick={() => handleSelectRole('student')}
                className="p-4 rounded-md bg-[#161616] border border-[#262626] hover:border-zinc-600 text-left transition-colors cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded bg-[#1F1F1F] text-zinc-300 flex items-center justify-center mb-3">
                    <GraduationCap className="w-4 h-4 text-[#E53935]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    Student
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Discover hackathons, internships, fellowships, and workshops. Bookmark opportunities and track deadlines.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-white">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* University */}
              <button
                type="button"
                onClick={() => handleSelectRole('university')}
                className="p-4 rounded-md bg-[#161616] border border-[#262626] hover:border-zinc-600 text-left transition-colors cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded bg-[#1F1F1F] text-zinc-300 flex items-center justify-center mb-3">
                    <Building2 className="w-4 h-4 text-[#E53935]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    University / Org
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Post opportunities, manage deadlines, and update student challenges through the management portal.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-white">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: Role Selected -> Sign Up or Sign In */}
      {selectedRole && !isPendingGoogleOnboarding && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-5 sm:p-6 space-y-4 shadow-lg">
            
            {/* Header / Role Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <button
                type="button"
                onClick={handleBackToRoleSelect}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change role</span>
              </button>

              <span className="text-xs font-medium text-zinc-300">
                {selectedRole === 'student' ? 'Student Account' : 'University Representative'}
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#161616] rounded-md border border-[#262626] text-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMessage(null); }}
                className={`py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  authMode === 'signup' 
                    ? 'bg-[#222222] text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMessage(null); }}
                className={`py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  authMode === 'signin' 
                    ? 'bg-[#222222] text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Google Sign In Option */}
            <button
              type="button"
              onClick={() => handleGoogleSignIn(selectedRole)}
              disabled={loading}
              className="w-full py-2 px-3 bg-[#161616] hover:bg-[#1E1E1E] border border-[#262626] rounded-md text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#262626]" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">or email</span>
              <div className="flex-1 h-px bg-[#262626]" />
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-2.5 rounded bg-red-950/40 border border-red-900/50 text-[#E53935] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {authMode === 'signup' && selectedRole === 'student' && (
                <>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Full Name <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Swayam Niranjan"
                      className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      College / University <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. University of California, Berkeley"
                      className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-300 font-medium mb-1">
                        Degree / Program
                      </label>
                      <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="e.g. B.Tech CS"
                        className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 font-medium mb-1">
                        Grad Year
                      </label>
                      <select
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs focus:outline-none focus:border-zinc-500"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {authMode === 'signup' && selectedRole === 'university' && (
                <>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Representative Name <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      University / Institution <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={universityName}
                      onChange={(e) => setUniversityName(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Department / Office <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Department of Computer Science"
                      className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Email Address <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Password <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md bg-[#E53935] hover:bg-[#d32f2f] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 mt-2"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {loading 
                    ? 'Processing...' 
                    : authMode === 'signup' 
                      ? (selectedRole === 'student' ? 'Create Student Account' : 'Register University Account')
                      : 'Sign In'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Google Onboarding Profile Modal */}
      {isPendingGoogleOnboarding && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 my-8">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Complete Your Profile
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Signed in with Google as <strong className="text-white">{currentUser.displayName || currentUser.email}</strong>
              </p>
            </div>

            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Account Type <span className="text-[#E53935]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGoogleRole('student')}
                  className={`p-2.5 rounded-md border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                    googleRole === 'student'
                      ? 'bg-[#1E1E1E] border-[#E53935] text-white'
                      : 'bg-[#161616] border-[#262626] text-zinc-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-[#E53935]" />
                  <span className="text-xs font-medium">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGoogleRole('university')}
                  className={`p-2.5 rounded-md border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                    googleRole === 'university'
                      ? 'bg-[#1E1E1E] border-[#E53935] text-white'
                      : 'bg-[#161616] border-[#262626] text-zinc-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#E53935]" />
                  <span className="text-xs font-medium">University / Host</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded bg-red-950/40 border border-red-900/50 text-[#E53935] text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCompleteGoogleProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Full Name <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  {googleRole === 'university' ? 'University / Institution Name *' : 'College / University Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={googleOrgName}
                  onChange={(e) => setGoogleOrgName(e.target.value)}
                  placeholder={googleRole === 'university' ? 'e.g. Stanford University' : 'e.g. MIT'}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              {googleRole === 'student' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Degree / Program
                    </label>
                    <input
                      type="text"
                      value={googleDegree}
                      onChange={(e) => setGoogleDegree(e.target.value)}
                      placeholder="e.g. B.Tech CS"
                      className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Grad Year
                    </label>
                    <select
                      value={googleGradYear}
                      onChange={(e) => setGoogleGradYear(e.target.value)}
                      className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs focus:outline-none focus:border-zinc-500"
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                </div>
              )}

              {googleRole === 'university' && (
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Department / Office <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={googleDepartment}
                    onChange={(e) => setGoogleDepartment(e.target.value)}
                    placeholder="e.g. Faculty of Engineering"
                    className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-md text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                  }}
                  disabled={loading}
                  className="px-3 py-1.5 rounded text-zinc-400 hover:text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? 'Saving...' : 'Save & Continue'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
