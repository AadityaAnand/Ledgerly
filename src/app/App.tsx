import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from '@/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/app/router'

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  )
}
