import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { mp } from './designTokens'

export interface MpGridColumn {
  id: string
  label: string
  width: string
  align?: 'left' | 'right'
  sortable?: boolean
}

interface MpGridTableProps {
  columns: MpGridColumn[]
  minWidth?: number
  loading?: boolean
  emptyMessage?: string
  emptySubMessage?: string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (columnId: string) => void
  children: ReactNode
  footer?: ReactNode
}

export function MpGridTable({
  columns,
  minWidth = 1100,
  loading,
  sortKey,
  sortDir,
  onSort,
  children,
  footer,
}: MpGridTableProps) {
  const gridTemplate = columns.map((c) => c.width).join(' ')

  return (
    <Box
      sx={{
        overflow: 'hidden',
        borderRadius: `${mp.radiusMd}px`,
        border: `1px solid ${mp.border}`,
        bgcolor: '#fff',
        boxShadow: mp.shadowCard,
      }}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: gridTemplate,
              gap: '12px',
              px: '26px',
              py: '15px',
              bgcolor: mp.surfaceMuted,
              borderBottom: `1px solid ${mp.border}`,
              fontFamily: mp.fontAccent,
              fontSize: 12,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: mp.textMuted,
            }}
          >
            {columns.map((col) => {
              const active = sortKey === col.id
              const content = (
                <>
                  {col.label}
                  {col.sortable && active && (
                    <Box component="span" sx={{ ml: 0.5, fontSize: 11, color: mp.greenMid }}>
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </Box>
                  )}
                </>
              )
              if (col.sortable && onSort) {
                return (
                  <Box
                    key={col.id}
                    component="button"
                    type="button"
                    onClick={() => onSort(col.id)}
                    sx={{
                      textAlign: col.align ?? 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
                      gap: 0.25,
                      p: 0,
                      border: 'none',
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      font: 'inherit',
                      letterSpacing: 'inherit',
                      textTransform: 'inherit',
                      color: active ? mp.greenMid : mp.textMuted,
                      '&:hover': { color: mp.greenMid },
                    }}
                  >
                    {content}
                  </Box>
                )
              }
              return (
                <Box key={col.id} sx={{ textAlign: col.align ?? 'left' }}>
                  {col.label}
                </Box>
              )
            })}
          </Box>

          {loading ? (
            <Box sx={{ py: 6, textAlign: 'center', color: mp.textSubtle }}>…</Box>
          ) : (
            children
          )}
        </Box>
      </Box>
      {footer}
    </Box>
  )
}

export function MpGridRow({
  columns,
  children,
}: {
  columns: MpGridColumn[]
  children: ReactNode
}) {
  const gridTemplate = columns.map((c) => c.width).join(' ')
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        gap: '12px',
        alignItems: 'center',
        px: '26px',
        py: '15px',
        borderBottom: `1px solid ${mp.borderLight}`,
        transition: 'background 0.15s',
        '&:hover': { bgcolor: '#fafcfa' },
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {children}
    </Box>
  )
}

export function MpGridEmpty({ message, subMessage }: { message: string; subMessage?: string }) {
  return (
    <Box sx={{ py: '60px', px: '26px', textAlign: 'center', color: mp.textFaint }}>
      <Typography sx={{ fontFamily: mp.fontSerif, fontSize: 17, color: mp.textMuted, m: 0 }}>
        {message}
      </Typography>
      {subMessage && (
        <Typography sx={{ fontFamily: mp.fontAccent, fontStyle: 'italic', fontSize: 13.5, mt: 0.75, m: 0 }}>
          {subMessage}
        </Typography>
      )}
    </Box>
  )
}
