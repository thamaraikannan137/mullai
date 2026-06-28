import { Avatar } from '@mui/material'

interface MpAvatarProps {
  name: string
  size?: number
}

export function MpAvatar({ name, size = 38 }: MpAvatarProps) {
  const initial = name.trim().charAt(0) || '?'
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #0e9f6e, #064e3b)',
        boxShadow: 'inset 0 0 0 1px rgba(230,177,48,0.5)',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontWeight: 600,
        color: '#f3e3b3',
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </Avatar>
  )
}
