import { useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Measures the live rendered position of `[data-field-slot="targetId"]`
 * inside `containerEl` and returns it relative to the container. Real
 * measurement rather than stored coordinates — stays correct through zoom,
 * panel resizes, and any future layout change to the facsimile pages.
 *
 * `containerEl` must be a state value (not a ref object read at effect
 * time) — this component is a descendant of the element that owns it, and
 * React attaches an ancestor's ref *after* fully committing its descendants,
 * so a descendant's `useLayoutEffect` would otherwise run before the parent
 * ref is actually attached. Passing the element down as a prop that updates
 * via `useState` sidesteps that ordering race entirely.
 */
function useFieldSlotRect(containerEl: HTMLDivElement | null, targetId: string | null): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null)

  useLayoutEffect(() => {
    if (!containerEl || !targetId) {
      // Measuring live DOM layout is the canonical useLayoutEffect use case —
      // there's no way to know the target's position without an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRect(null)
      return
    }

    function measure() {
      const target = containerEl?.querySelector<HTMLElement>(`[data-field-slot="${targetId}"]`)
      if (!containerEl || !target) {
        setRect(null)
        return
      }
      const containerBox = containerEl.getBoundingClientRect()
      const targetBox = target.getBoundingClientRect()
      setRect({
        top: targetBox.top - containerBox.top,
        left: targetBox.left - containerBox.left,
        width: targetBox.width,
        height: targetBox.height,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(containerEl)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [containerEl, targetId])

  return rect
}

interface HighlightOverlayProps {
  containerEl: HTMLDivElement | null
  targetFieldId: string | null
  /** Scrolls the target into view when it changes. Skip on hover-preview. */
  scrollIntoView?: boolean
}

export function HighlightOverlay({
  containerEl,
  targetFieldId,
  scrollIntoView = false,
}: HighlightOverlayProps) {
  const rect = useFieldSlotRect(containerEl, targetFieldId)

  useEffect(() => {
    if (!scrollIntoView || !targetFieldId || !containerEl) return
    const target = containerEl.querySelector<HTMLElement>(`[data-field-slot="${targetFieldId}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  }, [containerEl, targetFieldId, scrollIntoView])

  return (
    <AnimatePresence>
      {rect && (
        <motion.div
          key="highlight-box"
          layout
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="border-ai-500 pointer-events-none absolute z-10 rounded-xs border-2"
          style={{
            top: rect.top - 3,
            left: rect.left - 5,
            width: rect.width + 10,
            height: rect.height + 6,
          }}
        >
          <motion.div
            className="bg-ai-400 absolute inset-0 rounded-xs"
            initial={{ opacity: 0.32 }}
            animate={{ opacity: [0.28, 0.12, 0.28] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="ring-ai-400/50 absolute inset-0 rounded-xs"
            animate={{ boxShadow: ['0 0 0 0px rgba(139,92,246,0.25)', '0 0 0 5px rgba(139,92,246,0)'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
