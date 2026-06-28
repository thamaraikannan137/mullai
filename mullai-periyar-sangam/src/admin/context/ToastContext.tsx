import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Snackbar, Alert } from '@mui/material'

type ToastSeverity = 'success' | 'error'

interface ToastState {
  message: string
  severity: ToastSeverity
}

interface ToastContextValue {
  showToast: (message: string) => void
  showError: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string) => {
    setToast({ message, severity: 'success' })
  }, [])

  const showError = useCallback((message: string) => {
    setToast({ message, severity: 'error' })
  }, [])

  const handleClose = () => setToast(null)

  return (
    <ToastContext.Provider value={{ showToast, showError }}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={toast?.severity === 'error' ? 4000 : 2400}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={toast?.severity ?? 'success'}
          variant="filled"
          sx={{
            bgcolor: toast?.severity === 'error' ? '#7f1d1d' : '#053524',
            color: '#fbfcfa',
            border: toast?.severity === 'error' ? '1px solid #fca5a5' : '1px solid rgba(230,177,48,0.3)',
            boxShadow: '0 18px 40px rgba(3,32,22,0.35)',
            '& .MuiAlert-icon': { color: toast?.severity === 'error' ? '#fca5a5' : '#23c483' },
          }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
