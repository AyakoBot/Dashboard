export interface TrackedServer {
 id: string;
 name: string;
 icon: string | null;
 lastVisited: number;
}

const STORAGE_KEY = 'ayako-recent-servers';
const MAX_TRACKED_SERVERS = 5;

export const trackServerVisit = (serverId: string, serverName: string, serverIcon: string | null): void => {
 const tracked = getRecentServers();
 
 const existingIndex = tracked.findIndex(s => s.id === serverId);
 if (existingIndex !== -1) {
  tracked.splice(existingIndex, 1);
 }
 
 tracked.unshift({
  id: serverId,
  name: serverName,
  icon: serverIcon,
  lastVisited: Date.now()
 });
 
 if (tracked.length > MAX_TRACKED_SERVERS) {
  tracked.length = MAX_TRACKED_SERVERS;
 }
 
 localStorage.setItem(STORAGE_KEY, JSON.stringify(tracked));
};

export const getRecentServers = (): TrackedServer[] => {
 if (typeof window === 'undefined') return [];
 
 const stored = localStorage.getItem(STORAGE_KEY);
 if (!stored) return [];
 
 try {
  const parsed = JSON.parse(stored);
  return Array.isArray(parsed) ? parsed : [];
 } catch {
  return [];
 }
};

export const clearRecentServers = (): void => {
 localStorage.removeItem(STORAGE_KEY);
};

export const getTimeSinceVisit = (timestamp: number): string => {
 const seconds = Math.floor((Date.now() - timestamp) / 1000);
 
 if (seconds < 60) return 'Just now';
 if (seconds < 3600) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
 }
 if (seconds < 86400) {
  const hours = Math.floor(seconds / 3600);
  return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
 }
 
 const days = Math.floor(seconds / 86400);
 if (days === 1) return 'Yesterday';
 if (days < 7) return `${days} days ago`;
 if (days < 30) {
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
 }
 
 const months = Math.floor(days / 30);
 return `${months} month${months !== 1 ? 's' : ''} ago`;
};