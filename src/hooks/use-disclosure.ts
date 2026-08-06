import { useCallback, useState } from 'react'

export interface Disclosure {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export function useDisclosure(initialOpen = false): Disclosure {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}
