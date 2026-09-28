import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Loader2, 
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Opportunity } from '../types/opportunity';

interface ProfilePageProps {
  onBack: () => void;
  onOpenInterests?: () => void;
  opportunities?: Opportunity[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onBack,
  onOpenInterests
}) => {
  const { currentUser, userProfile, updateUserProfile, signOut } = useAuth();
  const isUniversity = userProfile?.role === 'university';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [degree, setDegree] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [department, setDepartment] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || userProfile.displayName || '');
      setOrganizationName(userProfile.organizationName || '');
      setDegree(userProfile.degree || '');
      setGradYear(userProfile.gradYear || '2027');
      setDepartment(userProfile.department || '');
    }
  }, [userProfile]);

  if (!currentUser || !userProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#E53935] mx-auto" />
        <p className="text-zinc-400 text-xs">Loading profile...</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!organizationName.trim()) {
      setErrorMessage(isUniversity ? 'University name is required.' : 'College / Institution name is required.');
      return;
    }

    setSaving(true);
    try {
      if (isUniversity) {
        await updateUserProfile({
          name: name.trim(),
          organizationName: organizationName.trim(),
          department: department.trim()
        });
      } else {
        await updateUserProfile({
          name: name.trim(),
          organizationName: organizationName.trim(),
          degree: degree.trim(),
          gradYear: gradYear.trim()
        });
      }
      setSuccessMessage('Profile saved.');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err?.message || 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (n[0] || 'U').toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {isUniversity ? 'Manage Opportunities' : 'Explore'}</span>
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Profile
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#111111] border border-[#262626] rounded-lg p-5 sm:p-6 space-y-6">
        {/* Header Block: Avatar, Name, Email, Role */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1C1C1C] border border-[#2B2B2B] text-white flex items-center justify-center font-bold text-lg font-mono shrink-0">
            {getInitials(name || currentUser.email || 'User')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-white truncate">
                {name || 'Account User'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1A1A1A] border border-[#262626] text-zinc-300">
                {isUniversity ? 'University Representative' : 'Student'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate mt-0.5">
              {currentUser.email}
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-200 bg-[#161616] hover:bg-[#202020] border border-[#2B2B2B] transition-colors cursor-pointer shrink-0"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Success message banner */}
        {successMessage && (
          <div className="p-3 rounded-md bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Information */}
        <div className="pt-4 border-t border-[#222222]">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Profile Information
          </h3>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swayam Niranjan"
                  className="w-full px-3 py-2 rounded-md bg-[#161616] border border-[#262626] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {isUniversity ? 'University / Institution Name' : 'College / University'} <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Indian Institute of Technology"
                  className="w-full px-3 py-2 rounded-md bg-[#161616] border border-[#262626] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              {!isUniversity ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Degree / Program
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3 py-2 rounded-md bg-[#161616] border border-[#262626] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      placeholder="e.g. 2027"
                      className="w-full px-3 py-2 rounded-md bg-[#161616] border border-[#262626] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Department / Office
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Department of Computer Science & Engineering"
                    className="w-full px-3 py-2 rounded-md bg-[#161616] border border-[#262626] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 rounded-md bg-[#161616] hover:bg-[#202020] text-zinc-400 hover:text-white border border-[#262626] text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <dt className="text-zinc-500 mb-0.5">
                  {isUniversity ? 'University / Institution' : 'College / University'}
                </dt>
                <dd className="text-zinc-200 font-medium">
                  {organizationName || 'Not specified'}
                </dd>
              </div>

              {!isUniversity ? (
                <>
                  <div>
                    <dt className="text-zinc-500 mb-0.5">Degree / Program</dt>
                    <dd className="text-zinc-200 font-medium">
                      {degree || 'Undergraduate'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 mb-0.5">Graduation Year</dt>
                    <dd className="text-zinc-200 font-medium font-mono">
                      {gradYear || '2027'}
                    </dd>
                  </div>
                </>
              ) : (
                <div>
                  <dt className="text-zinc-500 mb-0.5">Department / Office</dt>
                  <dd className="text-zinc-200 font-medium">
                    {department || 'Faculty Office'}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>

        {/* Interests Section (for students) */}
        {!isUniversity && (
          <div className="pt-4 border-t border-[#222222]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Interests
              </h3>
              {onOpenInterests && (
                <button
                  type="button"
                  onClick={onOpenInterests}
                  className="text-xs text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Choose interests</span>
                </button>
              )}
            </div>

            {Array.isArray(userProfile.interests) && userProfile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {userProfile.interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded text-xs bg-[#161616] border border-[#262626] text-zinc-300 font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">
                You haven't selected any technical interests yet. Adding interests improves your recommended listings.
              </p>
            )}
          </div>
        )}

        {/* Account Controls / Sign out */}
        <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-zinc-400">
          <span>Connected as {currentUser.email}</span>
          <button
            onClick={() => signOut()}
            className="text-zinc-400 hover:text-[#E53935] cursor-pointer transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
