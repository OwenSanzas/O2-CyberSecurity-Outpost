interface Props {
  viewMode: 'card' | 'table' | 'timeline'
  onViewChange: (mode: 'card' | 'table' | 'timeline') => void
  readingListCount: number
  onReadingListClick: () => void
  onRandomClick: () => void
  onSearchFocus: () => void
}

export default function MobileNav({ viewMode, onViewChange, readingListCount, onRandomClick, onSearchFocus }: Props) {
  const items = [
    { id: 'search' as const, label: 'Search', action: onSearchFocus },
    { id: 'card' as const, label: 'Cards', action: () => onViewChange('card') },
    { id: 'table' as const, label: 'Table', action: () => onViewChange('table') },
    { id: 'timeline' as const, label: 'Timeline', action: () => onViewChange('timeline') },
    { id: 'random' as const, label: 'Discover', action: onRandomClick },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {items.map(item => {
          const isActive = item.id === viewMode
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center gap-0.5 px-2 py-1 bg-transparent border-none cursor-pointer transition-colors"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
            >
              <span className="text-xs font-medium">{item.label}</span>
              {item.id === 'search' && readingListCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] text-[9px] font-bold flex items-center justify-center">
                  {readingListCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
