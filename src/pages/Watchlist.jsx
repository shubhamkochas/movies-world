import { useUser } from '../context/UserContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon, title, message, link, linkLabel }) => (
  <div className="text-center py-32">
    <p className="text-7xl mb-5">{icon}</p>
    <h2 className="text-white text-2xl font-bold mb-2">{title}</h2>
    <p className="text-gray-500 text-base mb-6">{message}</p>
    <Link
      to={link}
      className="inline-block bg-[#e50914] hover:bg-[#c40812] text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
    >
      {linkLabel}
    </Link>
  </div>
);

const Watchlist = () => {
  const { watchlist, liked, removeFromWatchlist, toggleLike, isLiked } = useUser();

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 px-4 md:px-8 pb-16">
      <div className="max-w-screen-xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-xl w-fit">
          <span className="bg-[#e50914] text-white text-sm font-bold px-5 py-2 rounded-lg">
            Watchlist ({watchlist.length})
          </span>
        </div>

        {watchlist.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Your watchlist is empty"
            message="Add movies and TV shows to watch later"
            link="/"
            linkLabel="Browse Movies"
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-white text-2xl font-bold">My Watchlist</h1>
              <span className="text-gray-500 text-sm">{watchlist.length} titles</span>
            </div>
            <div
              id="watchlist-grid"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {watchlist.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
                  <button
                    id={`remove-watchlist-${movie.id}`}
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="absolute top-2 left-2 bg-black/60 hover:bg-[#e50914] text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
