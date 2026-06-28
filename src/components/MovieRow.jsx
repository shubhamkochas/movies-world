import { useRef } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const MovieRow = ({ title, movies, loading, error, cardSize = 'md', sectionId }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const amount = direction === 'left' ? -400 : 400;
    rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (error) return null;

  return (
    <section id={sectionId || `row-${title}`} className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-white font-bold text-lg md:text-xl tracking-wide">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            id={`${sectionId || title}-scroll-left`}
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e50914] flex items-center justify-center text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
          <button
            id={`${sectionId || title}-scroll-right`}
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e50914] flex items-center justify-center text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar snap-x px-4 md:px-8 pb-2"
        style={{ scrollPaddingLeft: '2rem' }}
      >
        {loading ? (
          <SkeletonCard count={8} />
        ) : (
          movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size={cardSize} />
          ))
        )}
      </div>
    </section>
  );
};

export default MovieRow;
