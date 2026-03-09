import { useState, useEffect, useRef } from 'react'
import type { Language } from '../types'

interface Props {
  paperCount: number
  lang: Language
  onLangChange: (l: Language) => void
}

function AnimatedCounter({ target, duration = 1500 }: { target: number | string; duration?: number }) {
  const [display, setDisplay] = useState('0')
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const numTarget = typeof target === 'string' ? parseInt(target) || 0 : target
    const suffix = typeof target === 'string' ? target.replace(/[0-9]/g, '') : ''
    if (!numTarget) {
      setDisplay(String(target))
      return
    }

    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = Math.round(eased * numTarget)
      setDisplay(current + suffix)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return <>{display}</>
}

export default function Header({ paperCount, lang, onLangChange }: Props) {
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
    <header className="relative flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] text-center px-4 md:px-6 py-12 md:py-16">
      <div className="absolute w-[500px] h-[500px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)' }} />

      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

      {/* Language toggle */}
      <button
        onClick={() => onLangChange(lang === 'en' ? 'zh' : 'en')}
        className="absolute top-6 right-6 px-3 py-1.5 text-xs font-mono border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 transition-colors cursor-pointer z-10"
      >
        {lang === 'en' ? '中文' : 'EN'}
      </button>

      <div className="text-sm text-[var(--color-accent)] tracking-[4px] uppercase mb-4 font-semibold relative z-1"
        style={{ animation: 'pulse 2s ease-in-out infinite' }}>
        SYSTEM ONLINE
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-2 relative z-1 glitch-text" data-text="O2 CyberSecurity Outpost">
        <span className="text-[var(--color-accent)]">O2</span> CyberSecurity
        <br />
        <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-blue)] bg-clip-text text-transparent">
          Outpost
        </span>
      </h1>

      <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mt-4 mb-8 min-h-[2rem] relative z-1">
        {typedText}
        <span className="border-r-2 border-[var(--color-accent)] ml-0.5 animate-pulse" />
      </p>

      <div className="flex gap-10 mb-8 relative z-1">
        {[
          { value: `${paperCount}`, label: 'Papers' },
          { value: '4', label: 'Categories' },
          { value: '15+', label: 'Venues' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-bold text-[var(--color-accent)] font-mono">
              <AnimatedCounter target={s.value} />
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 relative z-1">
        <a href="#papers"
          className="px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)] font-bold rounded-lg text-sm hover:opacity-90 transition-opacity no-underline">
          Browse Papers ↓
        </a>
        <a href="https://github.com/OwenSanzas/O2-CyberSecurity-Outpost" target="_blank" rel="noopener"
          className="px-6 py-3 border border-[var(--color-accent)]/30 text-[var(--color-accent)] font-semibold rounded-lg text-sm hover:border-[var(--color-accent)]/60 transition-colors no-underline">
          GitHub
        </a>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </header>
  )
}
