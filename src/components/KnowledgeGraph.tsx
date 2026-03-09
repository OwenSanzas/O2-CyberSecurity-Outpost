import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import type { Paper } from '../types'

interface Node {
  id: string
  label: string
  type: 'paper' | 'llm' | 'vuln' | 'language'
  x: number
  y: number
  vx: number
  vy: number
  color: string
  radius: number
  paper?: Paper
}

interface Edge {
  source: string
  target: string
}

interface Props {
  papers: Paper[]
  onPaperClick: (p: Paper) => void
}

export default function KnowledgeGraph({ papers, onPaperClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef<Node | null>(null)

  // Build graph data
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const seen = new Set<string>()

    // Add LLM nodes
    const llmPaperMap = new Map<string, string[]>()
    const vulnPaperMap = new Map<string, string[]>()
    const langPaperMap = new Map<string, string[]>()

    for (const p of papers) {
      for (const l of p.experiment?.llm ?? []) {
        if (!llmPaperMap.has(l)) llmPaperMap.set(l, [])
        llmPaperMap.get(l)!.push(p.id)
      }
      for (const v of p.experiment?.vulnerability_type ?? []) {
        if (!vulnPaperMap.has(v)) vulnPaperMap.set(v, [])
        vulnPaperMap.get(v)!.push(p.id)
      }
      for (const l of p.experiment?.language ?? []) {
        if (!langPaperMap.has(l)) langPaperMap.set(l, [])
        langPaperMap.get(l)!.push(p.id)
      }
    }

    // Only include LLMs/vulns/langs that connect multiple papers
    const topLLMs = [...llmPaperMap.entries()].filter(([, ps]) => ps.length >= 2).sort((a, b) => b[1].length - a[1].length).slice(0, 8)
    const topVulns = [...vulnPaperMap.entries()].filter(([, ps]) => ps.length >= 2).sort((a, b) => b[1].length - a[1].length).slice(0, 6)
    const topLangs = [...langPaperMap.entries()].filter(([, ps]) => ps.length >= 2).sort((a, b) => b[1].length - a[1].length).slice(0, 5)

    // Collect which papers are connected
    const connectedPapers = new Set<string>()
    for (const [, ps] of [...topLLMs, ...topVulns, ...topLangs]) {
      for (const pid of ps) connectedPapers.add(pid)
    }

    // Add paper nodes (only connected ones, max 30)
    const papersToShow = papers.filter(p => connectedPapers.has(p.id)).slice(0, 30)
    for (const p of papersToShow) {
      nodes.push({
        id: p.id,
        label: p.system_name || p.title.slice(0, 20),
        type: 'paper',
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 50,
        vx: 0, vy: 0,
        color: p.categories.includes('fuzzing') ? '#44aaff' : p.categories.includes('privacy') ? '#44ff88' : '#ff4444',
        radius: 5 + (p.recommendation ?? 1) * 2,
        paper: p,
      })
      seen.add(p.id)
    }

    // Add concept nodes and edges
    for (const [name, ps] of topLLMs) {
      const nid = `llm-${name}`
      nodes.push({
        id: nid, label: name, type: 'llm',
        x: Math.random() * 600 + 100, y: Math.random() * 400 + 50,
        vx: 0, vy: 0, color: '#aa66ff', radius: 8 + ps.length,
      })
      for (const pid of ps) {
        if (seen.has(pid)) edges.push({ source: nid, target: pid })
      }
    }

    for (const [name, ps] of topVulns) {
      const nid = `vuln-${name}`
      nodes.push({
        id: nid, label: name, type: 'vuln',
        x: Math.random() * 600 + 100, y: Math.random() * 400 + 50,
        vx: 0, vy: 0, color: '#ff4444', radius: 7 + ps.length,
      })
      for (const pid of ps) {
        if (seen.has(pid)) edges.push({ source: nid, target: pid })
      }
    }

    for (const [name, ps] of topLangs) {
      const nid = `lang-${name}`
      nodes.push({
        id: nid, label: name, type: 'language',
        x: Math.random() * 600 + 100, y: Math.random() * 400 + 50,
        vx: 0, vy: 0, color: '#44aaff', radius: 7 + ps.length,
      })
      for (const pid of ps) {
        if (seen.has(pid)) edges.push({ source: nid, target: pid })
      }
    }

    return { nodes, edges }
  }, [papers])

  // Initialize refs
  useEffect(() => {
    nodesRef.current = nodes.map(n => ({ ...n }))
    edgesRef.current = edges
  }, [nodes, edges])

  // Resize observer
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: Math.max(entry.contentRect.width * 0.5, 400) })
      }
    })
    obs.observe(container)
    return () => obs.disconnect()
  }, [])

  // Force simulation + render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const nodeMap = new Map<string, Node>()
    for (const n of nodesRef.current) {
      n.x = Math.min(Math.max(n.x, 20), dimensions.width - 20)
      n.y = Math.min(Math.max(n.y, 20), dimensions.height - 20)
      nodeMap.set(n.id, n)
    }

    const tick = () => {
      const ns = nodesRef.current
      const es = edgesRef.current
      const W = dimensions.width
      const H = dimensions.height

      // Simple force simulation
      // Repulsion
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[j].x - ns[i].x
          const dy = ns[j].y - ns[i].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 800 / (dist * dist)
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          ns[i].vx -= fx
          ns[i].vy -= fy
          ns[j].vx += fx
          ns[j].vy += fy
        }
      }

      // Attraction (edges)
      for (const e of es) {
        const a = nodeMap.get(e.source)
        const b = nodeMap.get(e.target)
        if (!a || !b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - 100) * 0.005
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy
      }

      // Center gravity
      for (const n of ns) {
        n.vx += (W / 2 - n.x) * 0.001
        n.vy += (H / 2 - n.y) * 0.001
      }

      // Update positions
      for (const n of ns) {
        if (dragRef.current?.id === n.id) continue
        n.vx *= 0.9
        n.vy *= 0.9
        n.x += n.vx
        n.y += n.vy
        n.x = Math.min(Math.max(n.x, 20), W - 20)
        n.y = Math.min(Math.max(n.y, 20), H - 20)
      }

      // Render
      ctx.clearRect(0, 0, W, H)

      // Edges
      ctx.lineWidth = 0.5
      for (const e of es) {
        const a = nodeMap.get(e.source)
        const b = nodeMap.get(e.target)
        if (!a || !b) continue
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)'
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // Nodes
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      let hovered: Node | null = null

      for (const n of ns) {
        const dx = n.x - mx
        const dy = n.y - my
        const isHovered = Math.sqrt(dx * dx + dy * dy) < n.radius + 5

        if (isHovered) hovered = n

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? '#fff' : n.color
        ctx.globalAlpha = isHovered ? 1 : 0.7
        ctx.fill()
        ctx.globalAlpha = 1

        // Label for concept nodes or hovered
        if (n.type !== 'paper' || isHovered) {
          ctx.font = `${isHovered ? '12' : '10'}px 'JetBrains Mono', monospace`
          ctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.5)'
          ctx.textAlign = 'center'
          ctx.fillText(n.label, n.x, n.y + n.radius + 14)
        }
      }

      setHoveredNode(hovered)
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [dimensions])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (dragRef.current) {
      dragRef.current.x = mouseRef.current.x
      dragRef.current.y = mouseRef.current.y
      dragRef.current.vx = 0
      dragRef.current.vy = 0
    }
  }, [])

  const handleMouseDown = useCallback(() => {
    if (hoveredNode) {
      dragRef.current = hoveredNode
    }
  }, [hoveredNode])

  const handleMouseUp = useCallback(() => {
    dragRef.current = null
  }, [])

  const handleClick = useCallback(() => {
    if (hoveredNode?.paper) {
      onPaperClick(hoveredNode.paper)
    }
  }, [hoveredNode, onPaperClick])

  return (
    <div ref={containerRef} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Knowledge Graph
        </h3>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-purple)]"></span> LLM</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-red)]"></span> Vuln Type</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-blue)]"></span> Language</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)]"></span> Paper</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ cursor: hoveredNode ? 'pointer' : 'default', height: `${dimensions.height}px` }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />
      {hoveredNode?.paper && (
        <div className="px-4 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-accent)] font-mono">{hoveredNode.paper.system_name || ''}</span>
          {hoveredNode.paper.system_name && ' — '}
          {hoveredNode.paper.title}
        </div>
      )}
    </div>
  )
}
