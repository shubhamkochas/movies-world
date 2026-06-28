import { getPosterUrl, getBackdropUrl } from '../config';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
  const stars = Math.round(rating / 2);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={s <= stars ? 'star-filled text-sm' : 'star-empty text-sm'}>★</span>
      ))}
    </div>
  );
};

const MovieCard = ({ movie, size = 'md' }) => {
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist, toggleLike, isLiked } = useUser();
  const inWatchlist = isInWatchlist(movie.id);
  const liked = isLiked(movie.id);

  const title = movie.title || movie.name || 'Unknown';
  const rating = movie.vote_average || 0;
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const posterPath = getPosterUrl(movie.poster_path);
  const backdropPath = getBackdropUrl(movie.backdrop_path);
  const displayImg = posterPath || backdropPath;

  const cardClasses = size === 'lg'
    ? 'w-44 md:w-52 flex-shrink-0'
    : 'w-36 md:w-44 flex-shrink-0';

  const handleClick = () => navigate(`/${mediaType}/${movie.id}`);

  const handleAction = (e, fn) => {
    e.stopPropagation();
    fn(movie);
  };

  return (
    <div
      id={`movie-card-${movie.id}`}
      className={`${cardClasses} group relative rounded-xl overflow-hidden cursor-pointer card-glow transition-all duration-300 hover:scale-105 hover:z-10 snap-start bg-[#16161f]`}
      onClick={handleClick}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {displayImg ? (
          <img
            src={displayImg}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#1c1c28] flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              id={`watchlist-btn-${movie.id}`}
              onClick={(e) => handleAction(e, toggleWatchlist)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inWatchlist
                  ? 'bg-[#e50914] text-white'
                  : 'bg-white/20 text-white hover:bg-[#e50914] backdrop-blur-sm'
              }`}
            >
              {inWatchlist ? '✓ Saved' : '+ Watchlist'}
            </button>
            <button
              id={`like-btn-${movie.id}`}
              onClick={(e) => handleAction(e, toggleLike)}
              className={`w-9 py-1.5 rounded-lg text-sm transition-all flex items-center justify-center ${
                liked ? 'bg-pink-500 text-white' : 'bg-white/20 text-white hover:bg-pink-500 backdrop-blur-sm'
              }`}
            >
              {liked ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        {/* Rating badge */}
        {rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[#f5c518] text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
            ★ {rating.toFixed(1)}
          </div>
        )}

        {/* Media type badge */}
        {movie.media_type === 'tv' && (
          <div className="absolute top-2 left-2 bg-[#e50914]/90 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
            TV
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{title}</p>
        <div className="flex items-center justify-between mt-1">
          {year && <span className="text-gray-500 text-xs">{year}</span>}
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
