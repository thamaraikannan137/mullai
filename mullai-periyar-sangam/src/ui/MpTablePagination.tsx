import { Box, MenuItem, Pagination, TextField, Typography } from '@mui/material'
import { mp } from './designTokens'

interface MpTablePaginationProps {
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
  rowsPerPageLabel: string
  showingLabel: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function MpTablePagination({
  page,
  pageSize,
  total,
  pageSizeOptions = [10, 25, 50],
  rowsPerPageLabel,
  showingLabel,
  onPageChange,
  onPageSizeChange,
}: MpTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, total)

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: '26px',
        py: '14px',
        borderTop: `1px solid ${mp.border}`,
        bgcolor: mp.surfaceMuted,
      }}
    >
      <Typography sx={{ fontSize: 13.5, color: mp.textMuted }}>
        {showingLabel.replace('{from}', String(from)).replace('{to}', String(to)).replace('{total}', String(total))}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 13, color: mp.textMuted, whiteSpace: 'nowrap' }}>{rowsPerPageLabel}</Typography>
          <TextField
            select
            size="small"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            sx={{ minWidth: 72, '& .MuiOutlinedInput-root': { height: 36, bgcolor: '#fff' } }}
          >
            {pageSizeOptions.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Pagination
          count={totalPages}
          page={safePage}
          onChange={(_, p) => onPageChange(p)}
          shape="rounded"
          size="small"
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 600,
              '&.Mui-selected': { bgcolor: mp.greenMid, color: '#fbfcfa', '&:hover': { bgcolor: mp.greenDark } },
            },
          }}
        />
      </Box>
    </Box>
  )
}
