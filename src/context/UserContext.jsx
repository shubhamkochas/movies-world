import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // ── Watchlist ──────────────────────────────────────────────
  const [watchlist, setWatchlist] = useLocalStorage('movieworld_watchlist', []);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  }, [setWatchlist]);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== id));
  }, [setWatchlist]);

  const isInWatchlist = useCallback((id) =>
    watchlist.some((m) => m.id === id), [watchlist]);

  const toggleWatchlist = useCallback((movie) => {
    if (isInWatchlist(movie.id)) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  // ── Liked Movies ──────────────────────────────────────────
  const [liked, setLiked] = useLocalStorage('movieworld_liked', []);

  const toggleLike = useCallback((movie) => {
    setLiked((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) return prev.filter((m) => m.id !== movie.id);
      return [movie, ...prev];
    });
  }, [setLiked]);

  const isLiked = useCallback((id) =>
    liked.some((m) => m.id === id), [liked]);

  // ── Search History ────────────────────────────────────────
  const [searchHistory, setSearchHistory] = useLocalStorage('movieworld_search_history', []);

  const addToSearchHistory = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10); // keep last 10
    });
  }, [setSearchHistory]);

  const removeFromSearchHistory = useCallback((query) => {
    setSearchHistory((prev) => prev.filter((q) => q !== query));
  }, [setSearchHistory]);

  const clearSearchHistory = useCallback(() => setSearchHistory([]), [setSearchHistory]);

  return (
    <UserContext.Provider value={{
      watchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist, isInWatchlist,
      liked, toggleLike, isLiked,
      searchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
