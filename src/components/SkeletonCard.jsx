const SkeletonCard = ({ count = 6 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-36 md:w-44 flex-shrink-0 rounded-xl overflow-hidden snap-start">
        <div className="skeleton aspect-[2/3] w-full rounded-t-xl" />
        <div className="bg-[#16161f] p-2.5 space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
      </div>
    ))}
  </>
);

export default SkeletonCard;
