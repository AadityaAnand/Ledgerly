import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatInitials } from '@/utils/format'

const palette = [
  'bg-primary-subtle text-primary-subtle-foreground',
  'bg-success-subtle text-success-subtle-foreground',
  'bg-ai-subtle text-ai-subtle-foreground',
  'bg-warning-subtle text-warning-subtle-foreground',
]

function paletteIndexFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash % palette.length
}

interface UserAvatarProps {
  name: string
  avatarUrl?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

/** Deterministically colored avatar fallback so the same person always gets
 * the same tint across the app, even without a photo. */
export function UserAvatar({ name, avatarUrl, size = 'default', className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback className={cn('font-medium', palette[paletteIndexFor(name)])}>
        {formatInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
