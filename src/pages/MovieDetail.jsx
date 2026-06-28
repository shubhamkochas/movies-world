import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetail, getTVDetail, getTrailerKey } from '../api';
import { getBackdropUrl, getPosterUrl, getAvatarUrl } from '../config';
import { useUser } from '../context/UserContext';
import TrailerModal from '../components/TrailerModal';
import MovieRow from '../components/MovieRow';

const Badge = ({ children, color = 'bg-white/10' }) => (
  <span className={`${color} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{children}</span>
);

const MovieDetail = () => {
  const { id, type = 'movie' } = useParams();
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist, toggleLike, isLiked } = useUser();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const fetcher = type === 'tv' ? getTVDetail : getMovieDetail;
    fetcher(id)
      .then(setDetail)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id, type]);

  useEffect(() => {
    if (detail?.videos) {
      setTrailerKey(getTrailerKey(detail.videos));
    }
  }, [detail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!detail) return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 flex items-center justify-center">
      <p className="text-gray-400">Movie not found.</p>
    </div>
  );

  const title = detail.title || detail.name;
  const tagline = detail.tagline;
  const overview = detail.overview;
  const rating = detail.vote_average?.toFixed(1);
  const voteCount = detail.vote_count?.toLocaleString();
  const runtime = detail.runtime || (detail.episode_run_time?.[0]);
  const year = (detail.release_date || detail.first_air_date || '').split('-')[0];
  const genres = detail.genres || [];
  const cast = detail.credits?.cast?.slice(0, 12) || [];
  const similar = [
    ...(detail.recommendations?.results || []),
    ...(detail.similar?.results || []),
  ].filter(Boolean).slice(0, 20);
  const backdropUrl = getBackdropUrl(detail.backdrop_path);
  const posterUrl = getPosterUrl(detail.poster_path);
  const inWatchlist = isInWatchlist(detail.id);
  const liked = isLiked(detail.id);
  const movieSnap = { id: detail.id, title, poster_path: detail.poster_path, vote_average: detail.vote_average };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Backdrop */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {backdropUrl && (
          <img src={backdropUrl} alt={title} className="w-full h-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/20" />

        {/* Back button */}
        <button
          id="detail-back-btn"
          onClick={() => navigate(-1)}
          className="absolute top-20 left-6 md:left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 -mt-64 md:-mt-80 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-[#16161f] rounded-2xl flex items-center justify-center text-5xl">🎬</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((g) => (
                <Badge key={g.id} color="bg-[#e50914]/20 text-[#e50914]">{g.name}</Badge>
              ))}
            </div>

            {/* Title */}
            <h1
              className="text-white font-black leading-tight mb-2"
              style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.02em' }}
            >
              {title}
            </h1>

            {/* Tagline */}
            {tagline && <p className="text-gray-400 italic text-base mb-4">&quot;{tagline}&quot;</p>}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
              {rating && (
                <div className="flex items-center gap-1.5 bg-[#f5c518]/10 text-[#f5c518] px-3 py-1 rounded-full font-bold">
                  ★ {rating} <span className="text-gray-500 font-normal">({voteCount} votes)</span>
                </div>
              )}
              {year && <span className="text-gray-400">{year}</span>}
              {runtime && <span className="text-gray-400">{Math.floor(runtime / 60)}h {runtime % 60}m</span>}
              {detail.status && <Badge>{detail.status}</Badge>}
            </div>

            {/* Overview */}
            {overview && (
              <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-6 max-w-2xl">{overview}</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trailerKey && (
                <button
                  id="detail-play-trailer"
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-all hover:scale-105 text-sm shadow-lg"
                >
                  ▶ Play Trailer
                </button>
              )}
              <button
                id="detail-watchlist-btn"
                onClick={() => toggleWatchlist(movieSnap)}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-all hover:scale-105 text-sm border-2 ${
                  inWatchlist
                    ? 'bg-[#e50914] border-[#e50914] text-white'
                    : 'bg-transparent border-white/30 text-white hover:border-[#e50914] hover:text-[#e50914]'
                }`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
              <button
                id="detail-like-btn"
                onClick={() => toggleLike(movieSnap)}
                className={`flex items-center gap-2 font-bold px-5 py-3 rounded-full transition-all hover:scale-105 text-sm border-2 ${
                  liked
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'bg-transparent border-white/30 text-white hover:border-pink-500 hover:text-pink-400'
                }`}
              >
                {liked ? '❤️ Liked' : '🤍 Like'}
              </button>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {detail.original_language && (
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-0.5">Language</p>
                  <p className="text-white font-medium uppercase">{detail.original_language}</p>
                </div>
              )}
              {detail.budget > 0 && (
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-0.5">Budget</p>
                  <p className="text-white font-medium">${(detail.budget / 1e6).toFixed(0)}M</p>
                </div>
              )}
              {detail.revenue > 0 && (
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-0.5">Box Office</p>
                  <p className="text-white font-medium">${(detail.revenue / 1e6).toFixed(0)}M</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section id="detail-cast" className="mt-12">
            <h2 className="text-white font-bold text-xl mb-5">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {cast.map((person) => (
                <div key={person.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 ring-2 ring-white/10">
                    {person.profile_path ? (
                      <img src={getAvatarUrl(person.profile_path)} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-[#1c1c28] flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-white text-xs font-semibold leading-tight">{person.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar/Recommended */}
        {similar.length > 0 && (
          <div className="mt-12">
            <MovieRow
              title="You May Also Like"
              movies={similar}
              loading={false}
              sectionId="similar-row"
            />
          </div>
        )}
      </div>

      {showTrailer && trailerKey && (
        <TrailerModal trailerKey={trailerKey} title={title} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
};

export default MovieDetail;
