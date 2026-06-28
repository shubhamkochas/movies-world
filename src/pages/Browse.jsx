import { useState, useEffect } from 'react';
import { getGenres, getByGenre } from '../api';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const Browse = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mediaType, setMediaType] = useState('movie');

  // Load genres
  useEffect(() => {
    getGenres(mediaType).then((res) => {
      setGenres(res.genres || []);
      if (res.genres?.length) setSelectedGenre(res.genres[0]);
    });
  }, [mediaType]);

  // Load movies when genre or mediaType changes
  useEffect(() => {
    if (!selectedGenre) return;
    setLoading(true);
    setMovies([]);
    setPage(1);
    getByGenre(selectedGenre.id, mediaType, 1)
      .then((res) => {
        setMovies(res.results || []);
        setTotalPages(res.total_pages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedGenre, mediaType]);

  const loadMore = async () => {
    if (page >= totalPages || loading || !selectedGenre) return;
    const next = page + 1;
    setLoading(true);
    try {
      const res = await getByGenre(selectedGenre.id, mediaType, next);
      setMovies((prev) => [...prev, ...(res.results || [])]);
      setPage(next);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-16">
      {/* Header */}
      <div className="px-4 md:px-8 mb-6">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-1">Browse by Genre</h1>
          <p className="text-gray-500 text-sm">Discover movies and TV shows by category</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex gap-8">
        {/* Sidebar */}
        <aside id="genre-sidebar" className="hidden md:block w-52 flex-shrink-0">
          {/* Media type toggle */}
          <div className="flex gap-1 mb-5 bg-white/5 p-1 rounded-xl">
            {['movie', 'tv'].map((t) => (
              <button
                key={t}
                id={`type-${t}`}
                onClick={() => setMediaType(t)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  mediaType === t ? 'bg-[#e50914] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t === 'tv' ? 'TV Shows' : 'Movies'}
              </button>
            ))}
          </div>

          {/* Genre list */}
          <div className="space-y-1">
            {genres.map((g) => (
              <button
                key={g.id}
                id={`genre-${g.id}`}
                onClick={() => setSelectedGenre(g)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                  selectedGenre?.id === g.id
                    ? 'bg-[#e50914] text-white font-semibold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile genre chips */}
          <div className="md:hidden flex gap-2 overflow-x-auto hide-scrollbar mb-5 pb-1">
            {/* Media type */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl flex-shrink-0">
              {['movie', 'tv'].map((t) => (
                <button
                  key={t}
                  onClick={() => setMediaType(t)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all flex-shrink-0 ${
                    mediaType === t ? 'bg-[#e50914] text-white' : 'text-gray-400'
                  }`}
                >
                  {t === 'tv' ? 'TV' : 'Movies'}
                </button>
              ))}
            </div>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedGenre?.id === g.id
                    ? 'bg-[#e50914] text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* Section title */}
          {selectedGenre && (
            <h2 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
              {selectedGenre.name}
              <span className="text-gray-500 font-normal text-sm">
                — {mediaType === 'tv' ? 'TV Shows' : 'Movies'}
              </span>
            </h2>
          )}

          {/* Grid */}
          <div
            id="browse-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {loading && movies.length === 0
              ? <SkeletonCard count={15} />
              : movies.map((m) => (
                  <MovieCard
                    key={m.id}
                    movie={mediaType === 'tv' ? { ...m, media_type: 'tv' } : m}
                  />
                ))
            }
          </div>

          {/* Load more */}
          {movies.length > 0 && page < totalPages && (
            <div className="text-center mt-8">
              <button
                id="browse-load-more"
                onClick={loadMore}
                disabled={loading}
                className="bg-white/10 hover:bg-[#e50914] text-white font-semibold px-8 py-3 rounded-full transition-all disabled:opacity-50 hover:scale-105"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
