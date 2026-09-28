import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types/opportunity';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  Loader2, 
  ExternalLink,
  Clock,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDisplayDate, getDaysRemaining } from '../utils/storage';
import { 
  getUniversityOpportunities, 
  subscribeToUniversityOpportunities 
} from '../services/opportunityService';

interface UniversityDashboardProps {
  opportunities: Opportunity[];
  onOpenCreateModal: () => void;
  onEditOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (oppId: string) => Promise<void>;
  onSelectOpportunity: (opp: Opportunity) => void;
  onOpenProfile: () => void;
  onRefreshOpportunities?: () => Promise<void>;
}

export const UniversityDashboard: React.FC<UniversityDashboardProps> = ({
  opportunities,
  onOpenCreateModal,
  onEditOpportunity,
  onDeleteOpportunity,
  onSelectOpportunity,
  onOpenProfile,
  onRefreshOpportunities
}) => {
  const { currentUser, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'closed'>('all');
  const [confirmDeleteOpp, setConfirmDeleteOpp] = useState<Opportunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [localOpportunities, setLocalOpportunities] = useState<Opportunity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Directly query and listen to opportunities created by this authenticated university
  const loadUniversityOpps = async () => {
    if (!currentUser) return;
    try {
      const data = await getUniversityOpportunities(currentUser.uid);
      setLocalOpportunities(data);
    } catch (err) {
      console.warn('University opportunities load note:', err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    loadUniversityOpps();

    const unsubscribe = subscribeToUniversityOpportunities(
      currentUser.uid,
      (opps) => {
        setLocalOpportunities(opps);
      },
      (err) => console.warn('University subscription note:', err)
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadUniversityOpps();
      if (onRefreshOpportunities) {
        await onRefreshOpportunities();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Source of truth: Firestore documents for this university (with prop fallback if needed)
  const myOpportunities = localOpportunities.length > 0 
    ? localOpportunities 
    : opportunities.filter(opp => currentUser && opp.createdBy === currentUser.uid);

  const processedList = myOpportunities.map(opp => {
    const days = getDaysRemaining(opp.deadline);
    let statusLabel: 'Active' | 'Closing Soon' | 'Closed' = 'Active';
    if (days < 0) {
      statusLabel = 'Closed';
    } else if (days <= 7) {
      statusLabel = 'Closing Soon';
    }
    const isPublished = opp.published !== false;
    return { ...opp, statusLabel, isPublished, daysLeft: days };
  });

  const filteredOpps = processedList.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.location && opp.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'published') return opp.isPublished && opp.statusLabel !== 'Closed';
    if (statusFilter === 'draft') return !opp.isPublished;
    if (statusFilter === 'closed') return opp.statusLabel === 'Closed';

    return true;
  });

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteOpp || !currentUser) return;
    
    setIsDeleting(true);
    setDeleteError('');
    try {
      await onDeleteOpportunity(confirmDeleteOpp.id);
      setConfirmDeleteOpp(null);
      await loadUniversityOpps();
    } catch (err: any) {
      console.error('Delete failed:', err);
      setDeleteError(err?.message || 'Failed to delete opportunity.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Manage Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            {userProfile?.organizationName ? `${userProfile.organizationName} · ` : ''}Create, update, and manage your student listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#161616] hover:bg-[#1F1F1F] border border-[#262626] text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            title="Reload your opportunities from Firestore"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Firestore'}</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full pl-8 pr-8 py-1.5 rounded-md bg-[#111111] border border-[#262626] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#111111] border border-[#262626] p-1 rounded-md">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#1F1F1F] text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({myOpportunities.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-[#1F1F1F] text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-[#1F1F1F] text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'closed'
                ? 'bg-[#1F1F1F] text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      {/* Table / List View */}
      {filteredOpps.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg bg-[#111111] border border-[#262626]">
          {myOpportunities.length === 0 ? (
            <div className="max-w-md mx-auto space-y-3">
              <h3 className="text-sm font-semibold text-white">
                You haven't posted any opportunities yet.
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Create an opportunity to publish hackathons, workshops, research roles, or internships to students worldwide.
              </p>
              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Create Opportunity
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">
                No matching opportunities found.
              </h3>
              <p className="text-xs text-zinc-400">
                Try clearing your search query or switching status filters.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#262626] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] border-b border-[#262626] text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th scope="col" className="py-3 px-4">Opportunity</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Deadline</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {filteredOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-[#141414] transition-colors">
                    {/* Opportunity column */}
                    <td className="py-3.5 px-4 min-w-[220px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-[#1C1C1C] border border-[#2B2B2B] text-zinc-300 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                          {opp.orgInitials || opp.organization?.slice(0, 2).toUpperCase() || 'OH'}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => onSelectOpportunity(opp)}
                            className="font-medium text-white hover:text-zinc-300 text-left line-clamp-1 cursor-pointer"
                          >
                            {opp.title}
                          </button>
                          <span className="text-[11px] text-zinc-400 block truncate">
                            {opp.location} · {opp.mode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category column */}
                    <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                      {opp.category}
                    </td>

                    {/* Deadline column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-zinc-200">
                        {formatDisplayDate(opp.deadline)}
                      </div>
                      <div className={`text-[11px] font-mono ${opp.daysLeft <= 7 && opp.daysLeft >= 0 ? 'text-[#E53935] font-semibold' : 'text-zinc-500'}`}>
                        {opp.daysLeft < 0 ? 'Expired' : `${opp.daysLeft} days remaining`}
                      </div>
                    </td>

                    {/* Status column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {!opp.isPublished ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1C1C1C] text-zinc-400 border border-[#2B2B2B]">
                          Draft
                        </span>
                      ) : opp.statusLabel === 'Closed' ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1C1C1C] text-zinc-500 border border-[#2B2B2B]">
                          Closed
                        </span>
                      ) : opp.statusLabel === 'Closing Soon' ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30 font-semibold">
                          Closing Soon
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/30 text-emerald-400 border border-emerald-900/40">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions column */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onSelectOpportunity(opp)}
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#1C1C1C] transition-colors cursor-pointer"
                          title="View listing"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditOpportunity(opp)}
                          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#1C1C1C] transition-colors cursor-pointer"
                          title="Edit opportunity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteOpp(opp)}
                          className="p-1.5 rounded text-zinc-400 hover:text-[#E53935] hover:bg-[#1C1C1C] transition-colors cursor-pointer"
                          title="Delete opportunity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111111] border border-[#262626] rounded-lg max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-white">
              Delete Opportunity
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{confirmDeleteOpp.title}"</strong>? This will permanently remove it from the student catalog.
            </p>

            {deleteError && (
              <div className="p-2.5 rounded bg-red-950/40 border border-red-900/50 text-[#E53935] text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222222]">
              <button
                type="button"
                onClick={() => setConfirmDeleteOpp(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded text-xs font-medium text-zinc-400 hover:text-white bg-[#161616] hover:bg-[#1F1F1F] border border-[#262626] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#E53935] hover:bg-[#d32f2f] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
