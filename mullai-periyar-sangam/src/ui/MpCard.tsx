import { Card, CardContent, type CardProps } from '@mui/material'
import type { ReactNode } from 'react'

interface MpCardProps extends Omit<CardProps, 'title'> {
  children: ReactNode
  padding?: number
}

export function MpCard({ children, padding = 3, ...props }: MpCardProps) {
  return (
    <Card {...props}>
      <CardContent sx={{ p: padding, '&:last-child': { pb: padding } }}>{children}</CardContent>
    </Card>
  )
}
