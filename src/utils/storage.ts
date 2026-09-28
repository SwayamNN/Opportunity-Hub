import { StudentPreferences, Opportunity } from '../types/opportunity';

export const DEFAULT_PREFERENCES: StudentPreferences = {
  domains: [],
  categories: ['Hackathon', 'Internship', 'Fellowship', 'Scholarship', 'Competition', 'Workshop'],
  modes: ['Online', 'Offline', 'Hybrid'],
  onlyWithReward: false
};

// Applied tracking per authenticated UID
export function getAppliedIds(uid?: string): string[] {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(`opphub_${uid}_applied_v2`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function markAsApplied(id: string, uid?: string): string[] {
  if (!uid) return [];
  const current = getAppliedIds(uid);
  if (current.includes(id)) return current;
  const updated = [...current, id];
  try {
    localStorage.setItem(`opphub_${uid}_applied_v2`, JSON.stringify(updated));
  } catch (e) {
    console.error('Error marking as applied', e);
  }
  return updated;
}

// Recently viewed tracking per authenticated UID
export function getRecentlyViewedIds(uid?: string): string[] {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(`opphub_${uid}_recently_viewed_v2`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addRecentlyViewedId(id: string, uid?: string): string[] {
  if (!uid) return [];
  try {
    const current = getRecentlyViewedIds(uid);
    const filtered = current.filter(item => item !== id);
    const updated = [id, ...filtered].slice(0, 12);
    localStorage.setItem(`opphub_${uid}_recently_viewed_v2`, JSON.stringify(updated));
    return updated;
  } catch {
    return [id];
  }
}

// Clear all local session caches for a user on logout
export function clearUserLocalData(uid: string): void {
  try {
    localStorage.removeItem(`opphub_${uid}_applied_v2`);
    localStorage.removeItem(`opphub_${uid}_recently_viewed_v2`);
  } catch (e) {
    console.warn('Error clearing local storage for user:', e);
  }
}

// Deadline calculation helpers
const CURRENT_SIMULATED_TIMESTAMP = new Date('2026-09-27T00:00:00Z').getTime();

export function getDaysRemaining(deadlineStr: string): number {
  try {
    const deadlineDate = new Date(`${deadlineStr}T23:59:59Z`).getTime();
    const diffMs = deadlineDate - CURRENT_SIMULATED_TIMESTAMP;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days;
  } catch {
    return 30;
  }
}

export function formatDeadlineRelative(deadlineStr: string): { label: string; urgent: boolean; daysLeft: number } {
  const days = getDaysRemaining(deadlineStr);
  if (days < 0) {
    return { label: 'Applications closed', urgent: false, daysLeft: days };
  }
  if (days === 0) {
    return { label: 'Closes today', urgent: true, daysLeft: 0 };
  }
  if (days === 1) {
    return { label: 'Closes tomorrow', urgent: true, daysLeft: 1 };
  }
  if (days <= 7) {
    return { label: `${days} days left`, urgent: true, daysLeft: days };
  }
  return { label: `${days} days left`, urgent: false, daysLeft: days };
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
