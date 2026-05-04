export default function RatingBar({ label, value, max = 5 }) {
  const percentage = (value / max) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-text-secondary w-36 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-primary-light rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-bold text-text-primary w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}
