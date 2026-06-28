import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SearchBar from './SearchBar';

const NavLink = ({ to, children, id }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      id={id}
      to={to}
      className={`text-sm font-medium transition-colors duration-200 hover:text-white relative group ${
        isActive ? 'text-white' : 'text-gray-400'
      }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#e50914] transition-all duration-200 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { watchlist, liked } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0f]/95 backdrop-blur-xl shadow-lg shadow-black/50 border-b border-white/5'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            id="nav-logo"
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            onClick={() => { setShowSearch(false); setMobileMenuOpen(false); }}
          >
            {/* Icon mark */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4500] via-[#e50914] to-[#ff6b00] rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-[#e50914]/40" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-[#e50914] to-[#ff4500] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-base" style={{ fontFamily: 'Russo One, sans-serif' }}>M</span>
              </div>
            </div>
            {/* Word mark */}
            <span
              className="logo-gradient font-black hidden sm:block tracking-tight leading-none"
              style={{ fontFamily: 'Russo One, sans-serif', fontSize: '1.35rem', letterSpacing: '-0.01em' }}
            >
              Movie<span className="text-white" style={{ WebkitTextFillColor: 'white' }}>World</span>
            </span>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/" id="nav-home">Home</NavLink>
            <NavLink to="/browse" id="nav-browse">Browse</NavLink>
            <NavLink to="/watchlist" id="nav-watchlist">
              <span className="flex items-center gap-1.5">
                Watchlist
                {watchlist.length > 0 && (
                  <span className="bg-[#e50914] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {watchlist.length > 9 ? '9+' : watchlist.length}
                  </span>
                )}
              </span>
            </NavLink>
            <NavLink to="/liked" id="nav-liked">
              <span className="flex items-center gap-1.5">
                ❤️ Liked
                {liked.length > 0 && (
                  <span className="bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {liked.length > 9 ? '9+' : liked.length}
                  </span>
                )}
              </span>
            </NavLink>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search toggle */}
            <button
              id="nav-search-toggle"
              onClick={() => { setShowSearch((v) => !v); setMobileMenuOpen(false); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                showSearch ? 'bg-[#e50914] text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
              aria-label="Toggle search"
            >
              {showSearch ? (
                <span className="text-sm">✕</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </button>

            {/* Mobile menu */}
            <button
              id="nav-mobile-menu"
              onClick={() => { setMobileMenuOpen((v) => !v); setShowSearch(false); }}
              className="md:hidden w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {showSearch && (
          <div className="border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl px-4 md:px-8 py-4">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        )}

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/98 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
            {[
              { to: '/', label: 'Home', id: 'mob-home' },
              { to: '/browse', label: 'Browse', id: 'mob-browse' },
              { to: '/watchlist', label: `Watchlist (${watchlist.length})`, id: 'mob-watchlist' },
              { to: '/liked', label: `❤️ Liked (${liked.length})`, id: 'mob-liked' },
            ].map(({ to, label, id }) => (
              <Link
                key={to}
                id={id}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white text-base font-medium py-1 border-b border-white/5 last:border-0"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
