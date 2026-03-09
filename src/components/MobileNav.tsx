import type React from 'react'

interface Props {
  viewMode: 'card' | 'table' | 'timeline'
  onViewChange: (mode: 'card' | 'table' | 'timeline') => void
  readingListCount: number
  onReadingListClick: () => void
  onRandomClick: () => void
  onSearchFocus: () => void
  theme?: 'dark' | 'light'
  onThemeToggle?: () => void
  onFilterToggle?: () => void
}

export default function MobileNav({ viewMode, onViewChange, readingListCount, onRandomClick, onSearchFocus, theme, onThemeToggle, onFilterToggle }: Props) {
  const viewItems: { id: 'card' | 'table' | 'timeline'; label: string; icon: React.ReactNode }[] = [
    {
      id: 'card',
      label: 'Cards',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'table',
      label: 'Table',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      ),
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
          <line x1="12" y1="7" x2="12" y2="10" />
          <line x1="12" y1="14" x2="12" y2="17" />
        </svg>
      ),
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-area-bottom"
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-around py-1.5 px-1">
        {/* Search */}
        <button
          onClick={onSearchFocus}
          className="relative flex flex-col items-center gap-0.5 px-2 py-1 bg-transparent border-none cursor-pointer transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          title="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[10px] font-medium leading-none">Search</span>
          {readingListCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] text-[9px] font-bold flex items-center justify-center">
              {readingListCount > 9 ? '9+' : readingListCount}
            </span>
          )}
        </button>

        {/* View mode buttons */}
        {viewItems.map(item => {
          const isActive = item.id === viewMode
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 border-none cursor-pointer transition-all duration-200"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'transparent',
                borderRadius: '8px',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
              title={item.label}
            >
              {item.icon}
              <span className="text-[10px] font-medium leading-none" style={{ fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          )
        })}

        {/* Filter toggle */}
        {onFilterToggle && (
          <button
            onClick={onFilterToggle}
            className="flex flex-col items-center gap-0.5 px-2 py-1 bg-transparent border-none cursor-pointer transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            title="Filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="text-[10px] font-medium leading-none">Filter</span>
          </button>
        )}

        {/* Discover / Random */}
        <button
          onClick={onRandomClick}
          className="flex flex-col items-center gap-0.5 px-2 py-1 bg-transparent border-none cursor-pointer transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          title="Discover a random paper"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
          <span className="text-[10px] font-medium leading-none">Discover</span>
        </button>

        {/* Theme toggle */}
        {onThemeToggle && (
          <button
            onClick={onThemeToggle}
            className="flex flex-col items-center gap-0.5 px-2 py-1 bg-transparent border-none cursor-pointer transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span className="text-[10px] font-medium leading-none">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        )}
      </div>
    </nav>
  )
}
