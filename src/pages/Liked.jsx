import { useUser } from '../context/UserContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const Liked = () => {
  const { liked, toggleLike } = useUser();

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 px-4 md:px-8 pb-16">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-white text-2xl font-bold">❤️ Liked Movies</h1>
          <span className="text-gray-500 text-sm bg-white/5 px-3 py-1 rounded-full">{liked.length} titles</span>
        </div>

        {liked.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-7xl mb-5">🤍</p>
            <h2 className="text-white text-2xl font-bold mb-2">No liked movies yet</h2>
            <p className="text-gray-500 text-base mb-6">Like movies to see them here</p>
            <Link
              to="/"
              className="inline-block bg-[#e50914] hover:bg-[#c40812] text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
            >
              Discover Movies
            </Link>
          </div>
        ) : (
          <div
            id="liked-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {liked.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                <button
                  id={`unlike-btn-${movie.id}`}
                  onClick={() => toggleLike(movie)}
                  className="absolute top-2 left-2 bg-black/60 hover:bg-pink-500 text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  Unlike
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;
