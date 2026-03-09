export default function PaperCardSkeleton() {
  return (
    <div
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-5"
      style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--color-border)' }}
    >
      {/* Top row: year + category tags */}
      <div className="flex items-center gap-2 mb-2">
        <div className="shimmer h-4 w-10 rounded" />
        <div className="shimmer h-4 w-20 rounded-full" />
        <div className="shimmer h-4 w-16 rounded-full" />
      </div>

      {/* Title */}
      <div className="shimmer h-5 w-[85%] rounded mb-1.5" />

      {/* Authors */}
      <div className="shimmer h-3 w-[50%] rounded mb-2" />

      {/* Summary block */}
      <div className="shimmer h-16 w-full rounded-lg mb-3" />

      {/* Tags */}
      <div className="flex gap-1.5 mb-2">
        <div className="shimmer h-5 w-14 rounded-full" />
        <div className="shimmer h-5 w-18 rounded-full" />
        <div className="shimmer h-5 w-12 rounded-full" />
        <div className="shimmer h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}
