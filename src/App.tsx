import { useState, useEffect } from 'react'

function App() {
  const [glitch, setGlitch] = useState(false)
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

  useEffect(() => {
    const timer = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { label: 'Papers', value: '80+', icon: '📄' },
    { label: 'Categories', value: '4', icon: '🏷️' },
    { label: 'Venues', value: '15+', icon: '🏛️' },
  ]

  const categories = [
    { name: 'Vulnerability Detection & Patching', count: 60, color: '#ff4444' },
    { name: 'LLM Fuzzing', count: 8, color: '#44aaff' },
    { name: 'Data Privacy Detection', count: 5, color: '#44ff88' },
    { name: 'Datasets & Benchmarks', count: 10, color: '#ffaa44' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e0e0e0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflow: 'hidden',
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Hero */}
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: '0.9rem',
          color: '#00ff88',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          fontWeight: 600,
        }}>
          ● SYSTEM ONLINE
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 800,
          margin: '0 0 0.5rem 0',
          lineHeight: 1.1,
          filter: glitch ? 'blur(2px)' : 'none',
          transition: 'filter 0.1s',
        }}>
          <span style={{ color: '#00ff88' }}>O2</span> CyberSecurity
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #00ff88, #44aaff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Outpost
          </span>
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#888',
          maxWidth: '600px',
          margin: '1.5rem 0 3rem',
          minHeight: '2rem',
        }}>
          {typedText}
          <span style={{
            borderRight: '2px solid #00ff88',
            marginLeft: '2px',
            animation: 'blink 1s infinite',
          }} />
        </p>

        <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00ff88' }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
            color: '#0a0a0f',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
          }}>
            🚀 Coming Soon
          </button>
          <a
            href="https://github.com/OwenSanzas/O2-CyberSecurity-Outpost"
            target="_blank"
            rel="noopener"
            style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              color: '#00ff88',
              border: '1px solid #00ff8844',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            ⭐ GitHub
          </a>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '2rem',
          color: '#444',
          fontSize: '0.85rem',
          animation: 'bounce 2s infinite',
        }}>
          ↓ scroll ↓
        </div>
      </header>

      {/* Categories */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
          Research Areas
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {categories.map((cat) => (
            <div key={cat.name} style={{
              background: '#12121a',
              border: '1px solid #1a1a2a',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'border-color 0.3s, transform 0.3s',
              cursor: 'pointer',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = cat.color
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1a1a2a'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: cat.color, marginBottom: '1rem',
                boxShadow: `0 0 12px ${cat.color}66`,
              }} />
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{cat.name}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>{cat.count}+ papers</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '3rem 2rem',
        color: '#444', fontSize: '0.85rem',
        borderTop: '1px solid #1a1a2a',
      }}>
        <p>O2 CyberSecurity Outpost — Texas A&M University</p>
        <p style={{ marginTop: '0.5rem' }}>
          Based on the survey "Large Language Models in Software Security"
        </p>
      </footer>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  )
}

export default App
