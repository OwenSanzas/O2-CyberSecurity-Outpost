import { useRef, useCallback, useEffect } from 'react'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  minDistance?: number
  maxDuration?: number
}

export function useSwipe<T extends HTMLElement = HTMLElement>({
  onSwipeLeft,
  onSwipeRight,
  minDistance = 50,
  maxDuration = 300,
}: SwipeOptions) {
  const ref = useRef<T>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const startTime = useRef(0)

  const onSwipeLeftRef = useRef(onSwipeLeft)
  const onSwipeRightRef = useRef(onSwipeRight)
  onSwipeLeftRef.current = onSwipeLeft
  onSwipeRightRef.current = onSwipeRight

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    startX.current = touch.clientX
    startY.current = touch.clientY
    startTime.current = Date.now()
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const dx = touch.clientX - startX.current
      const dy = touch.clientY - startY.current
      const elapsed = Date.now() - startTime.current

      // Ignore if vertical movement exceeds horizontal (user is scrolling)
      if (Math.abs(dy) > Math.abs(dx)) return

      // Ignore if too slow or too short
      if (elapsed > maxDuration) return
      if (Math.abs(dx) < minDistance) return

      if (dx < 0) {
        onSwipeLeftRef.current?.()
      } else {
        onSwipeRightRef.current?.()
      }
    },
    [minDistance, maxDuration],
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd])

  return ref
}
