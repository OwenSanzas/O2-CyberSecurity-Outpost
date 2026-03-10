interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  pageSize: number
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }: Props) {
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  // Generate page numbers to show
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages: (number | '...')[] = [1]

    if (currentPage > 3) pages.push('...')

    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('...')

    pages.push(totalPages)
    return pages
  }

  const btnBase = "px-3 py-1.5 text-xs rounded-md border transition-all cursor-pointer"
  const btnActive = "bg-[var(--color-accent)] text-[var(--color-bg-primary)] border-[var(--color-accent)] font-semibold"
  const btnNormal = "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
  const btnDisabled = "bg-transparent text-[var(--color-text-muted)]/40 border-[var(--color-border)]/40 cursor-not-allowed"

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-[var(--color-border)]/30">
      <span className="text-xs text-[var(--color-text-muted)]">
        {start}-{end} of {totalItems} papers
      </span>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${btnBase} ${currentPage <= 1 ? btnDisabled : btnNormal}`}
        >
          ‹ Prev
        </button>

        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-[var(--color-text-muted)]">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${btnBase} ${page === currentPage ? btnActive : btnNormal}`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${btnBase} ${currentPage >= totalPages ? btnDisabled : btnNormal}`}
        >
          Next ›
        </button>
      </div>
    </div>
  )
}
