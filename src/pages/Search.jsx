import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti } from '../api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // all | movie | tv

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    setPage(1);
    searchMulti(query, 1)
      .then((res) => {
        setResults(res.results?.filter(r => r.media_type === 'movie' || r.media_type === 'tv') || []);
        setTotalPages(res.total_pages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const loadMore = async () => {
    if (page >= totalPages || loading) return;
    const nextPage = page + 1;
    setLoading(true);
    try {
      const res = await searchMulti(query, nextPage);
      const newResults = res.results?.filter(r => r.media_type === 'movie' || r.media_type === 'tv') || [];
      setResults((prev) => [...prev, ...newResults]);
      setPage(nextPage);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? results : results.filter(r => r.media_type === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 px-4 md:px-8 pb-16">
      {/* Page header */}
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">
            {query ? <>Results for <span className="text-gradient">&quot;{query}&quot;</span></> : 'Search'}
          </h1>
          {results.length > 0 && (
            <p className="text-gray-500 text-sm">{results.length} results found</p>
          )}
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Filter tabs */}
        {results.length > 0 && (
          <div id="search-filters" className="flex gap-2 mb-8">
            {['all', 'movie', 'tv'].map((f) => (
              <button
                key={f}
                id={`filter-${f}`}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-[#e50914] text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All' : f === 'tv' ? 'TV Shows' : 'Movies'}
              </button>
            ))}
          </div>
        )}

        {/* Results grid */}
        {!query && !loading && (
          <div className="text-center py-32">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-400 text-lg">Start searching for movies and TV shows</p>
          </div>
        )}

        {query && !loading && filtered.length === 0 && (
          <div className="text-center py-32">
            <p className="text-6xl mb-4">😕</p>
            <p className="text-gray-400 text-lg">No results found for &quot;{query}&quot;</p>
            <p className="text-gray-600 text-sm mt-2">Try different keywords</p>
          </div>
        )}

        <div id="search-results-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loading && results.length === 0 ? (
            <SkeletonCard count={12} />
          ) : (
            filtered.map((movie) => (
              <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} />
            ))
          )}
        </div>

        {/* Load more */}
        {filtered.length > 0 && page < totalPages && (
          <div className="text-center mt-10">
            <button
              id="load-more-btn"
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
  );
};

export default Search;
