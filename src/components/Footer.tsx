import React from 'react';

interface FooterProps {
  onNavigate?: (view: any) => void;
  onOpenSubmit?: () => void;
  onOpenPreferences?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSubmit,
  onOpenPreferences
}) => {
  return (
    <footer className="border-t border-[#262626] bg-[#0A0A0A] text-zinc-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#E53935] flex items-center justify-center text-white font-bold text-xs">
                OH
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                Opportunity Hub
              </span>
            </div>
            <p className="text-zinc-400 max-w-sm text-xs leading-relaxed">
              Curated opportunities platform connecting college students with verified internships, hackathons, research fellowships, and engineering challenges.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Discover
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate?.('explore')}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  All Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('closing_soon')}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Closing Soon
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('recommended')}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Recommended
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('saved')}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Saved Bookmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Platform
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onOpenPreferences?.()}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  My Interests
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSubmit?.()}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Post Opportunity
                </button>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) => { e.preventDefault(); }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Terms & Verification
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Opportunity Hub. Built for college students and academic institutions.
          </div>
          <div className="flex items-center gap-3">
            <span>Verified collegiate listings</span>
            <span aria-hidden="true">·</span>
            <span>All deadlines updated daily</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
