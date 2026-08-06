import { useEffect } from 'react'

interface ShortcutOptions {
  /** e.g. "k" for Cmd/Ctrl+K */
  key: string
  metaOrCtrl?: boolean
  onTrigger: () => void
  enabled?: boolean
}

export function useKeyboardShortcut({ key, metaOrCtrl = true, onTrigger, enabled = true }: ShortcutOptions) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      const modifierPressed = metaOrCtrl ? event.metaKey || event.ctrlKey : true
      if (modifierPressed && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault()
        onTrigger()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, metaOrCtrl, onTrigger, enabled])
}
