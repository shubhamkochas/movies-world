import { useEffect } from 'react';
import { TMDB_CONFIG } from '../config';

const TrailerModal = ({ trailerKey, title, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      id="trailer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-5xl">
        {/* Close button */}
        <button
          id="trailer-modal-close"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">✕</span> Close (ESC)
        </button>

        {/* Title */}
        <p className="text-white/60 text-sm mb-3 font-medium truncate">{title} — Official Trailer</p>

        {/* YouTube iframe */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
          <iframe
            id="trailer-iframe"
            src={`${TMDB_CONFIG.YOUTUBE_EMBED}/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
