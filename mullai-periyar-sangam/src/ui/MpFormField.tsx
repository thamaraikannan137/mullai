import { FormControl, FormLabel, Box } from '@mui/material'
import type { ReactNode } from 'react'
import { MpBilingualLabel } from './MpBilingualLabel'

interface MpFormFieldProps {
  labelTa: string
  labelEn: string
  children: ReactNode
  fullWidth?: boolean
}

export function MpFormField({ labelTa, labelEn, children, fullWidth = true }: MpFormFieldProps) {
  return (
    <FormControl fullWidth={fullWidth} sx={{ gap: 1 }}>
      <FormLabel sx={{ mb: 0.5 }}>
        <MpBilingualLabel labelTa={labelTa} labelEn={labelEn} />
      </FormLabel>
      <Box>{children}</Box>
    </FormControl>
  )
}
