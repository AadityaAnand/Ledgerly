import * as React from 'react'
import { motion } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { iconPressable } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

interface IconButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Required — icon-only buttons must always have an accessible name. */
  label: string
  /** Shows the label in a tooltip on hover/focus. Default true. */
  showTooltip?: boolean
  icon: React.ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, showTooltip = true, icon, variant = 'ghost', size = 'icon', className, ...props }, ref) => {
    const button = (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        aria-label={label}
        className={cn('cursor-pointer', className)}
        asChild
        {...props}
      >
        <motion.button {...iconPressable}>{icon}</motion.button>
      </Button>
    )

    if (!showTooltip) return button

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    )
  }
)
IconButton.displayName = 'IconButton'
