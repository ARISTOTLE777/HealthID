export default function SkeletonLoader({ lines = 5, className = '' }) {
  return (
    <div className={`space-y-3 animate-fade-in ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: `${Math.max(40, 100 - i * 12)}%` }}
        />
      ))}
    </div>
  );
}
