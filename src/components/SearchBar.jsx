import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMulti } from '../api';
import { getPosterUrl } from '../config';
import { useUser } from '../context/UserContext';
import useDebounce from '../hooks/useDebounce';

const SearchBar = ({ onClose }) => {
  const navigate = useNavigate();
  const { searchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } = useUser();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 250); // Fast 250ms for instant feel

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Fetch suggestions on every keystroke (debounced)
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchMulti(debouncedQuery, 1)
      .then((res) => {
        const results = res.results
          ?.filter(r => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path)
          .slice(0, 8) || [];
        setSuggestions(results);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Show dropdown when query or focused
  useEffect(() => {
    setShowDropdown(true);
    setActiveIndex(-1);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    addToSearchHistory(q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setShowDropdown(false);
    onClose?.();
  };

  const handleSuggestionClick = (movie) => {
    const mediaType = movie.media_type || 'movie';
    addToSearchHistory(movie.title || movie.name || '');
    navigate(`/${mediaType}/${movie.id}`);
    setShowDropdown(false);
    onClose?.();
  };

  const handleHistoryClick = (q) => {
    setQuery(q);
    addToSearchHistory(q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setShowDropdown(false);
    onClose?.();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const totalItems = suggestions.length || searchHistory.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSuggestionClick(suggestions[activeIndex]);
      } else if (activeIndex >= 0 && !query && searchHistory[activeIndex]) {
        handleHistoryClick(searchHistory[activeIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      onClose?.();
    }
  };

  const showHistory = !query.trim() && searchHistory.length > 0;
  const showSuggestions = query.trim().length > 0;

  return (
    <div className="relative w-full max-w-2xl" id="search-bar-container">
      {/* Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-200 focus-within:border-[#e50914] focus-within:bg-white/15 focus-within:shadow-lg focus-within:shadow-[#e50914]/20">
          {/* Search icon */}
          <div className="pl-4 pr-2 text-gray-400">
            {loading ? (
              <svg className="animate-spin w-5 h-5 text-[#e50914]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            )}
          </div>

          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search movies, TV shows..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 py-3.5 pr-2 outline-none text-sm md:text-base"
            autoComplete="off"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              id="search-clear-btn"
              onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus(); }}
              className="px-3 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            id="search-submit-btn"
            className="bg-[#e50914] hover:bg-[#c40812] text-white px-5 py-3.5 text-sm font-semibold transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (showSuggestions || showHistory) && (
        <div
          ref={dropdownRef}
          id="search-dropdown"
          className="absolute top-full left-0 right-0 mt-2 bg-[#111118]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
        >
          {/* History section */}
          {showHistory && (
            <div>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Recent Searches</span>
                <button
                  id="clear-history-btn"
                  onClick={clearSearchHistory}
                  className="text-gray-600 hover:text-[#e50914] text-xs transition-colors"
                >
                  Clear all
                </button>
              </div>
              {searchHistory.slice(0, 6).map((q, i) => (
                <div
                  key={q}
                  id={`history-item-${i}`}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                    activeIndex === i ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => handleHistoryClick(q)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">🕐</span>
                    <span className="text-gray-300 text-sm">{q}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromSearchHistory(q); }}
                    className="text-gray-600 hover:text-red-400 text-xs px-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Live suggestions */}
          {showSuggestions && (
            <div>
              {suggestions.length > 0 && (
                <div className="px-4 pt-3 pb-1">
                  <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Suggestions</span>
                </div>
              )}
              {suggestions.map((movie, i) => {
                const title = movie.title || movie.name;
                const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
                const poster = getPosterUrl(movie.poster_path);
                return (
                  <div
                    key={movie.id}
                    id={`suggestion-${i}`}
                    onClick={() => handleSuggestionClick(movie)}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                      activeIndex === i ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={poster || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2260%22%3E%3Crect width=%2240%22 height=%2260%22 fill=%22%23222%22/%3E%3C/svg%3E'}
                      alt={title}
                      className="w-8 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {year && <span className="text-gray-500 text-xs">{year}</span>}
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          movie.media_type === 'tv' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#e50914]/20 text-[#e50914]'
                        }`}>
                          {movie.media_type === 'tv' ? 'TV Show' : 'Movie'}
                        </span>
                        {movie.vote_average > 0 && (
                          <span className="text-[#f5c518] text-xs">★ {movie.vote_average.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-600 text-xs">→</span>
                  </div>
                );
              })}

              {/* Search all results link */}
              {query.trim() && (
                <button
                  id="search-all-results"
                  onClick={handleSubmit}
                  className="w-full text-left px-4 py-3 text-[#e50914] text-sm font-medium hover:bg-white/5 transition-colors border-t border-white/5 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  Search all results for &quot;{query}&quot;
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
