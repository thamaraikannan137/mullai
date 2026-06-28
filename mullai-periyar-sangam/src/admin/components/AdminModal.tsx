import type { ReactNode } from 'react'
import { TextField } from '@mui/material'
import { MpDialog } from '../../ui/MpDialog'
import { MpFormField } from '../../ui/MpFormField'

interface AdminModalProps {
  open: boolean
  titleTa: string
  titleEn: string
  saveLabel?: string
  size?: 'default' | 'wide'
  onClose: () => void
  onSave: () => void
  children: ReactNode
}

/** Wraps MpDialog — prefer importing from `src/ui` in new code */
export function AdminModal(props: AdminModalProps) {
  return <MpDialog {...props} />
}

export function ModalField({
  labelTa,
  labelEn,
  children,
}: {
  labelTa: string
  labelEn: string
  children: ReactNode
}) {
  return (
    <MpFormField labelTa={labelTa} labelEn={labelEn}>
      {children}
    </MpFormField>
  )
}

export function MpTextField(props: React.ComponentProps<typeof TextField>) {
  return <TextField {...props} />
}

/** @deprecated Use MUI TextField via MpTextField */
export const adminInputClass = ''
/** @deprecated Use MUI TextField multiline */
export const adminTextareaClass = ''
