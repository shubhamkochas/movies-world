// TMDB API Configuration
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: '5019346c15f827a11da3db854275a088',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  YOUTUBE_EMBED: 'https://www.youtube.com/embed',
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path) => getImageUrl(path, 'original');
export const getPosterUrl = (path) => getImageUrl(path, 'w500');
export const getAvatarUrl = (path) => getImageUrl(path, 'w185');
