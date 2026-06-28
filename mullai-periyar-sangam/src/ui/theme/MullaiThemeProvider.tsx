import { CssBaseline, ThemeProvider } from '@mui/material'
import type { ReactNode } from 'react'
import { mullaiTheme } from './mullaiTheme'

export function MullaiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={mullaiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
