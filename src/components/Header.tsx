import { useState, useEffect } from 'react'

export default function Header({ paperCount }: { paperCount: number }) {
  const [typedText, setTypedText] = useState('')
  const fullText = 'Tracking the frontier of LLM-powered security research.'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 40)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-6 py-16">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)' }} />

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

      <div className="text-sm text-[var(--color-accent)] tracking-[4px] uppercase mb-4 font-semibold">
        ● SYSTEM ONLINE
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-2">
        <span className="text-[var(--color-accent)]">O2</span> CyberSecurity
        <br />
        <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-blue)] bg-clip-text text-transparent">
          Outpost
        </span>
      </h1>

      <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mt-4 mb-8 min-h-[2rem]">
        {typedText}
        <span className="border-r-2 border-[var(--color-accent)] ml-0.5 animate-pulse" />
      </p>

      <div className="flex gap-10 mb-8">
        {[
          { icon: '📄', value: `${paperCount}`, label: 'Papers' },
          { icon: '🏷️', value: '4', label: 'Categories' },
          { icon: '🏛️', value: '15+', label: 'Venues' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-[var(--color-accent)]">{s.value}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <a href="#papers"
          className="px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)] font-bold rounded-lg text-sm hover:opacity-90 transition-opacity no-underline">
          Browse Papers ↓
        </a>
        <a href="https://github.com/OwenSanzas/O2-CyberSecurity-Outpost" target="_blank" rel="noopener"
          className="px-6 py-3 border border-[var(--color-accent)]/30 text-[var(--color-accent)] font-semibold rounded-lg text-sm hover:border-[var(--color-accent)]/60 transition-colors no-underline">
          ⭐ GitHub
        </a>
      </div>
    </header>
  )
}
