// ============================================================
// TMDB API Configuration
// API key is loaded from VITE_TMDB_API_KEY in your .env file.
// Never hardcode your key here — keep it in .env (git-ignored).
// Get a free key at: https://www.themoviedb.org/settings/api
// ============================================================

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

if (!apiKey) {
  console.error(
    '[MovieWorld] ⚠️  VITE_TMDB_API_KEY is missing.\n' +
    'Create a .env file in the project root and add:\n' +
    'VITE_TMDB_API_KEY=your_key_here'
  );
}

export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: apiKey || '',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  YOUTUBE_EMBED: 'https://www.youtube.com/embed',
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path) => getImageUrl(path, 'original');
export const getPosterUrl   = (path) => getImageUrl(path, 'w500');
export const getAvatarUrl   = (path) => getImageUrl(path, 'w185');
