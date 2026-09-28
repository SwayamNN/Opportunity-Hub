import React, { useState } from 'react';
import { 
  Bookmark, 
  Plus, 
  Menu, 
  X, 
  Compass, 
  SlidersHorizontal,
  LogOut,
  User,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type AppView = 
  | 'explore' 
  | 'saved' 
  | 'closing_soon' 
  | 'recommended' 
  | 'university_dashboard' 
  | 'detail'
  | 'profile'
  | 'student_dashboard';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  savedCount: number;
  onOpenPreferences: () => void;
  onOpenSubmit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  savedCount,
  onOpenPreferences,
  onOpenSubmit
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile, signOut } = useAuth();

  const isUniversity = userProfile?.role === 'university';

  const handleNavClick = (view: AppView) => {
    const target = view === 'student_dashboard' ? 'explore' : view;
    onNavigate(target);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Logo & Wordmark */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleNavClick(isUniversity ? 'university_dashboard' : 'explore')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
              aria-label="Opportunity Hub Home"
            >
              <div className="w-7 h-7 rounded bg-[#E53935] flex items-center justify-center text-white font-bold text-xs tracking-tight">
                OH
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                  Opportunity Hub
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-500 border-l border-[#262626] pl-2">
                  {isUniversity ? 'University Portal' : 'Student Platform'}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {!isUniversity ? (
                <>
                  <button
                    onClick={() => handleNavClick('explore')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      currentView === 'explore' || currentView === 'student_dashboard'
                        ? 'text-white bg-[#1B1B1B] font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-[#141414]'
                    }`}
                  >
                    Explore
                  </button>

                  <button
                    onClick={() => {
                      onOpenPreferences();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-[#141414] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>My Interests</span>
                    {Array.isArray(userProfile?.interests) && userProfile.interests.length > 0 && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-mono text-zinc-300 bg-[#1F1F1F] border border-[#2B2B2B] rounded">
                        {userProfile.interests.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavClick('saved')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      currentView === 'saved'
                        ? 'text-white bg-[#1B1B1B] font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-[#141414]'
                    }`}
                  >
                    <span>Bookmarks</span>
                    {savedCount > 0 && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-mono text-zinc-200 bg-[#E53935]/20 border border-[#E53935]/40 rounded font-semibold">
                        {savedCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('explore')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      currentView === 'explore'
                        ? 'text-white bg-[#1B1B1B] font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-[#141414]'
                    }`}
                  >
                    Opportunities
                  </button>

                  <button
                    onClick={() => handleNavClick('university_dashboard')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      currentView === 'university_dashboard'
                        ? 'text-white bg-[#1B1B1B] font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-[#141414]'
                    }`}
                  >
                    Manage Opportunities
                  </button>

                  <button
                    onClick={onOpenSubmit}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#141414] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E53935]" />
                    <span>Create Opportunity</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right: Profile & Logout */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('profile')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'profile'
                  ? 'text-white bg-[#1B1B1B] font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-[#141414] border border-[#262626]'
              }`}
              title="View account profile"
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-[#141414] transition-colors cursor-pointer flex items-center gap-1.5"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {!isUniversity && (
              <button
                onClick={() => handleNavClick('saved')}
                className="relative p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Bookmarks"
              >
                <Bookmark className="w-4 h-4" />
                {savedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#E53935] text-[9px] font-bold text-white flex items-center justify-center font-mono">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-[#161616] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#262626] bg-[#111111] px-4 py-3 space-y-1">
          {!isUniversity ? (
            <>
              <button
                onClick={() => handleNavClick('explore')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                  currentView === 'explore'
                    ? 'text-white bg-[#1B1B1B] font-semibold'
                    : 'text-zinc-300 hover:bg-[#161616]'
                }`}
              >
                <Compass className="w-4 h-4 text-zinc-400" />
                <span>Explore</span>
              </button>

              <button
                onClick={() => {
                  onOpenPreferences();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:bg-[#161616] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                  <span>My Interests</span>
                </div>
                {Array.isArray(userProfile?.interests) && userProfile.interests.length > 0 && (
                  <span className="text-xs font-mono px-1.5 py-0.5 bg-[#1F1F1F] rounded text-zinc-400">
                    {userProfile.interests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('saved')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                  currentView === 'saved'
                    ? 'text-white bg-[#1B1B1B] font-semibold'
                    : 'text-zinc-300 hover:bg-[#161616]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-zinc-400" />
                  <span>Bookmarks</span>
                </div>
                {savedCount > 0 && (
                  <span className="text-xs font-mono px-1.5 py-0.5 bg-[#E53935]/20 text-[#E53935] rounded font-semibold">
                    {savedCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('explore')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                  currentView === 'explore'
                    ? 'text-white bg-[#1B1B1B] font-semibold'
                    : 'text-zinc-300 hover:bg-[#161616]'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-zinc-400" />
                <span>Explore Opportunities</span>
              </button>

              <button
                onClick={() => handleNavClick('university_dashboard')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                  currentView === 'university_dashboard'
                    ? 'text-white bg-[#1B1B1B] font-semibold'
                    : 'text-zinc-300 hover:bg-[#161616]'
                }`}
              >
                <Compass className="w-4 h-4 text-zinc-400" />
                <span>Manage Opportunities</span>
              </button>

              <button
                onClick={() => {
                  onOpenSubmit();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white bg-[#E53935] hover:bg-[#d32f2f] flex items-center gap-2.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Opportunity</span>
              </button>
            </>
          )}

          <div className="pt-2 mt-2 border-t border-[#262626] flex items-center justify-between">
            <button
              onClick={() => handleNavClick('profile')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                currentView === 'profile'
                  ? 'text-white font-semibold'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-zinc-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
