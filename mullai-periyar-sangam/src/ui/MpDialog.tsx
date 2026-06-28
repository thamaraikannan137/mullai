import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Button,
  Box,
  Typography,
} from '@mui/material'
import type { ReactNode } from 'react'
import { adminLabel, useAdminLanguage } from '../admin/context/AdminLanguageContext'
import { mp } from './designTokens'

interface MpDialogProps {
  open: boolean
  titleTa: string
  titleEn: string
  saveLabel?: string
  size?: 'default' | 'wide'
  onClose: () => void
  onSave: () => void
  children: ReactNode
}

export function MpDialog({
  open,
  titleTa,
  titleEn,
  saveLabel,
  size = 'default',
  onClose,
  onSave,
  children,
}: MpDialogProps) {
  const { lang } = useAdminLanguage()
  const resolvedSaveLabel = saveLabel ?? adminLabel('சேமி', 'Save', lang)
  const cancelLabel = adminLabel('ரத்து', 'Cancel', lang)
  const title = adminLabel(titleTa, titleEn, lang)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: 'rgba(4,32,22,0.55)',
            backdropFilter: 'blur(3px)',
          },
        },
        paper: {
          sx: {
            maxWidth: size === 'wide' ? 920 : 540,
            width: '100%',
            maxHeight: '92vh',
            borderRadius: `${mp.radiusLg}px`,
            boxShadow: mp.shadowModal,
            m: 2,
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          borderBottom: `1px solid ${mp.borderLight}`,
          px: '30px',
          pt: '26px',
          pb: '18px',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: mp.fontSerif,
              fontSize: 21,
              fontWeight: 700,
              color: mp.greenDark,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          {lang === 'ta' && (
            <Typography
              sx={{
                fontFamily: mp.fontAccent,
                fontSize: 13.5,
                fontStyle: 'italic',
                color: mp.textSubtle,
                mt: 0.5,
              }}
            >
              {titleEn}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            width: 34,
            height: 34,
            borderRadius: '9px',
            bgcolor: mp.surfaceMuted,
            color: mp.textMuted,
            '&:hover': { bgcolor: '#e6f6ee', color: mp.greenDark },
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </IconButton>
      </Box>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '18px', px: '30px', py: 3 }}>
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'flex-end',
          gap: '12px',
          borderTop: `1px solid ${mp.borderLight}`,
          px: '30px',
          pt: '18px',
          pb: '26px',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: `${mp.radiusSm}px`,
            border: `1px solid ${mp.borderInput}`,
            bgcolor: '#fff',
            color: mp.textBody,
            px: '22px',
            py: '12px',
            fontSize: '14.5px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: mp.surfaceMuted, boxShadow: 'none' },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{
            borderRadius: `${mp.radiusSm}px`,
            bgcolor: mp.greenMid,
            color: '#fbfcfa',
            px: '26px',
            py: '12px',
            fontSize: '14.5px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: mp.shadowBtn,
            '&:hover': { bgcolor: mp.greenDark, boxShadow: mp.shadowBtn },
          }}
        >
          {resolvedSaveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
