export interface FavoriteServer {
 id: string;
 addedAt: number;
}

const STORAGE_KEY = 'ayako-favorite-servers';

export const getFavoriteServers = (): Set<string> => {
 if (typeof window === 'undefined') return new Set();

 const stored = localStorage.getItem(STORAGE_KEY);
 if (!stored) return new Set();

 try {
  const parsed = JSON.parse(stored);
  return new Set(Array.isArray(parsed) ? parsed.map((f: FavoriteServer) => f.id) : []);
 } catch {
  return new Set();
 }
};

export const addFavoriteServer = (serverId: string): void => {
 const favorites = getFavoriteServersData();
 const existing = favorites.find((f) => f.id === serverId);

 if (!existing) {
  favorites.push({ id: serverId, addedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
 }
};

export const removeFavoriteServer = (serverId: string): void => {
 const favorites = getFavoriteServersData();
 const filtered = favorites.filter((f) => f.id !== serverId);
 localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const isFavoriteServer = (serverId: string): boolean => {
 const favorites = getFavoriteServers();
 return favorites.has(serverId);
};

export const toggleFavoriteServer = (serverId: string): boolean => {
 if (isFavoriteServer(serverId)) {
  removeFavoriteServer(serverId);
  return false;
 } else {
  addFavoriteServer(serverId);
  return true;
 }
};

const getFavoriteServersData = (): FavoriteServer[] => {
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
