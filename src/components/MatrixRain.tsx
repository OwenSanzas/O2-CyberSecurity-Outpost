import { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = 0
    let height = 0
    let columns = 0
    let drops: number[] = []

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*{}<>CVE-CWE-LLM-GPT-AFL-FUZZ-PWN'
    const fontSize = 14

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = Math.floor(width / fontSize)
      // Preserve existing drops or initialize
      const newDrops = Array(columns).fill(0)
      for (let i = 0; i < Math.min(drops.length, columns); i++) {
        newDrops[i] = drops[i]
      }
      drops = newDrops
    }

    resize()
    window.addEventListener('resize', resize)

    // Reduce CPU usage: only update every other frame
    let frameCount = 0
    const draw = () => {
      frameCount++
      if (frameCount % 2 !== 0) {
        animId = requestAnimationFrame(draw)
        return
      }

      ctx.fillStyle = 'rgba(10, 10, 15, 0.06)'
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < columns; i++) {
        // Random brightness variation
        const brightness = Math.random() > 0.95 ? 'ff' : Math.random() > 0.8 ? '44' : '18'
        ctx.fillStyle = `#00ff88${brightness}`
        ctx.font = `${fontSize}px monospace`

        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.35 }}
    />
  )
}
