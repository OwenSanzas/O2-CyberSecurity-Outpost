import { useEffect, useState } from 'react'

export interface ToastMessage {
  id: number
  text: string
  type?: 'success' | 'info' | 'error'
}

let toastId = 0
let listeners: ((msg: ToastMessage) => void)[] = []

export function showToast(text: string, type: 'success' | 'info' | 'error' = 'success') {
  const msg: ToastMessage = { id: ++toastId, text, type }
  listeners.forEach(fn => fn(msg))
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id))
      }, 2500)
    }
    listeners.push(handler)
    return () => { listeners = listeners.filter(l => l !== handler) }
  }, [])

  if (toasts.length === 0) return null

  const colors = {
    success: 'var(--color-accent)',
    info: 'var(--color-blue)',
    error: 'var(--color-red)',
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="px-4 py-2.5 rounded-lg border text-sm font-medium shadow-lg shadow-black/30"
          style={{
            background: 'var(--color-bg-card)',
            borderColor: colors[toast.type || 'success'],
            color: colors[toast.type || 'success'],
            animation: 'toastIn 0.2s ease-out',
          }}
        >
          {toast.text}
        </div>
      ))}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
