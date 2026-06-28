import { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { getTrending, getPopular, getTopRated, getNowPlaying, getUpcoming, getOnTheAir } from '../api';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, pm, tr, np, up, tv] = await Promise.all([
          getTrending('movie', 'week'),
          getPopular('movie'),
          getTopRated('movie'),
          getNowPlaying(),
          getUpcoming(),
          getPopular('tv'),
        ]);
        setTrending(t.results || []);
        setPopularMovies(pm.results || []);
        setTopRated(tr.results || []);
        setNowPlaying(np.results || []);
        setUpcoming(up.results || []);
        setPopularTV(tv.results || []);
      } catch (e) {
        console.error('Home fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      {trending.length > 0 && <HeroBanner movies={trending} />}

      {/* Content rows */}
      <div className="pt-8 pb-16">
        <MovieRow
          title="🔥 Trending This Week"
          movies={trending}
          loading={loading}
          sectionId="trending-row"
          cardSize="lg"
        />
        <MovieRow
          title="🎬 Now Playing"
          movies={nowPlaying}
          loading={loading}
          sectionId="now-playing-row"
        />
        <MovieRow
          title="⭐ Top Rated"
          movies={topRated}
          loading={loading}
          sectionId="top-rated-row"
        />
        <MovieRow
          title="🍿 Popular Movies"
          movies={popularMovies}
          loading={loading}
          sectionId="popular-movies-row"
        />
        <MovieRow
          title="📅 Coming Soon"
          movies={upcoming}
          loading={loading}
          sectionId="upcoming-row"
        />
        <MovieRow
          title="📺 Popular TV Shows"
          movies={popularTV.map(m => ({ ...m, media_type: 'tv' }))}
          loading={loading}
          sectionId="popular-tv-row"
        />
      </div>
    </div>
  );
};

export default Home;
