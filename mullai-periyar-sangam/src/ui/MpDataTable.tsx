import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import type { ReactNode } from 'react'

export interface MpColumn<T> {
  id: string
  label: string
  minWidth?: number
  align?: 'left' | 'right' | 'center'
  render: (row: T) => ReactNode
}

interface MpDataTableProps<T> {
  columns: MpColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  loading?: boolean
  emptyMessage?: string
  minWidth?: number
}

export function MpDataTable<T>({
  columns,
  rows,
  getRowId,
  loading,
  emptyMessage = 'No records',
  minWidth = 1100,
}: MpDataTableProps<T>) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 1 }}>
      <Table stickyHeader sx={{ minWidth }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align ?? 'left'} sx={{ minWidth: col.minWidth }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                <CircularProgress size={28} color="primary" />
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 7 }}>
                <Typography color="text.secondary">{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { bgcolor: '#fafcfa' } }}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align ?? 'left'}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export function MpCellText({ children, bold }: { children: ReactNode; bold?: boolean }) {
  return (
    <Typography variant="body2" color="text.primary" noWrap sx={{ fontWeight: bold ? 600 : 400 }}>
      {children}
    </Typography>
  )
}

export function MpCellActions({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.75 }}>
      {children}
    </Box>
  )
}
