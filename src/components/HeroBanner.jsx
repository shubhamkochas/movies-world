import { useState, useEffect, useCallback } from 'react';
import { getBackdropUrl, getPosterUrl } from '../config';
import { getTrailerKey } from '../api';
import { useUser } from '../context/UserContext';
import TrailerModal from './TrailerModal';

const HeroBanner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [fade, setFade] = useState(true);
  const { toggleWatchlist, isInWatchlist, toggleLike, isLiked } = useUser();

  const movie = movies?.[currentIndex];

  const next = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % Math.min(movies.length, 10));
      setFade(true);
    }, 300);
  }, [movies?.length]);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (!movies?.length) return;
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [movies, next]);

  const handlePlayTrailer = async () => {
    if (!movie) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=5019346c15f827a11da3db854275a088&language=en-US`
      );
      const data = await res.json();
      const key = getTrailerKey(data);
      if (key) {
        setTrailerKey(key);
        setShowTrailer(true);
      } else {
        alert('No trailer available for this movie.');
      }
    } catch {
      alert('Failed to load trailer.');
    }
  };

  if (!movie) {
    return (
      <div className="w-full h-screen skeleton flex items-center justify-center">
        <p className="text-gray-500">Loading hero...</p>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path) || getPosterUrl(movie.poster_path);
  const title = movie.title || movie.name;
  const overview = movie.overview;
  const rating = movie.vote_average?.toFixed(1);
  const year = (movie.release_date || '').split('-')[0];
  const inWatchlist = isInWatchlist(movie.id);
  const liked = isLiked(movie.id);

  return (
    <>
      <section id="hero-banner" className="relative w-full min-h-screen flex items-end overflow-hidden">
        {/* Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `url(${backdropUrl})`,
            opacity: fade ? 1 : 0,
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-black/30" />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-12 pb-24 md:pb-32 max-w-3xl w-full">
          <div className={`transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Meta badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#e50914] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
                🔥 Trending
              </span>
              {year && <span className="text-gray-300 text-sm">{year}</span>}
              {rating && (
                <span className="flex items-center gap-1 text-[#f5c518] text-sm font-semibold">
                  ★ {rating}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-white font-black leading-tight mb-4"
              style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '0.02em' }}
            >
              {title}
            </h1>

            {/* Overview */}
            {overview && (
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 max-w-xl">
                {overview}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                id="hero-play-trailer"
                onClick={handlePlayTrailer}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-200 text-sm md:text-base shadow-lg hover:scale-105"
              >
                <span className="text-lg">▶</span> Play Trailer
              </button>

              <button
                id="hero-watchlist-btn"
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-all duration-200 text-sm md:text-base backdrop-blur-sm border-2 hover:scale-105 ${
                  inWatchlist
                    ? 'bg-[#e50914] border-[#e50914] text-white'
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                }`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>

              <button
                id="hero-like-btn"
                onClick={() => toggleLike(movie)}
                className={`flex items-center gap-2 font-bold px-5 py-3 rounded-full transition-all duration-200 text-sm backdrop-blur-sm border-2 hover:scale-105 ${
                  liked
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'bg-white/10 border-white/30 text-white hover:bg-pink-500/30'
                }`}
              >
                {liked ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 right-8 md:right-12 flex gap-2 z-10">
          {movies.slice(0, 10).map((_, i) => (
            <button
              key={i}
              id={`hero-dot-${i}`}
              onClick={() => { setFade(false); setTimeout(() => { setCurrentIndex(i); setFade(true); }, 300); }}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 h-2 bg-[#e50914]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs animate-bounce z-10 hidden md:block">
          ↓ Scroll to explore
        </div>
      </section>

      {showTrailer && trailerKey && (
        <TrailerModal trailerKey={trailerKey} title={title} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
};

export default HeroBanner;
