import { TMDB_CONFIG } from './config';

// ── Generic Fetcher ──────────────────────────────────────────
const tmdb = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_CONFIG.API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const cacheKey = url.toString();
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB Error ${res.status}: ${res.statusText}`);
  const data = await res.json();
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

export const getTrending = (type = 'movie', period = 'week') =>
  tmdb(`/trending/${type}/${period}`);

export const getPopular = (type = 'movie', page = 1) =>
  tmdb(`/${type}/popular`, { page });

export const getTopRated = (type = 'movie', page = 1) =>
  tmdb(`/${type}/top_rated`, { page });

export const getNowPlaying = () => tmdb('/movie/now_playing');
export const getOnTheAir = () => tmdb('/tv/on_the_air');
export const getUpcoming = () => tmdb('/movie/upcoming');

export const getMovieDetail = (id) =>
  tmdb(`/movie/${id}`, { append_to_response: 'videos,credits,similar,recommendations' });

export const getTVDetail = (id) =>
  tmdb(`/tv/${id}`, { append_to_response: 'videos,credits,similar,recommendations' });

export const getVideos = (id, type = 'movie') => tmdb(`/${type}/${id}/videos`);
export const getCredits = (id, type = 'movie') => tmdb(`/${type}/${id}/credits`);
export const getSimilar = (id, type = 'movie') => tmdb(`/${type}/${id}/similar`);

export const searchMulti = (query, page = 1) =>
  tmdb('/search/multi', { query, page, include_adult: false });

export const searchMovies = (query, page = 1) =>
  tmdb('/search/movie', { query, page, include_adult: false });

export const getGenres = (type = 'movie') => tmdb(`/genre/${type}/list`);

export const getByGenre = (genreId, type = 'movie', page = 1) =>
  tmdb(`/discover/${type}`, { with_genres: genreId, sort_by: 'popularity.desc', page });

export const getTrailerKey = (videos) => {
  if (!videos?.results?.length) return null;
  const trailer =
    videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos.results.find(v => v.site === 'YouTube');
  return trailer?.key || null;
};
