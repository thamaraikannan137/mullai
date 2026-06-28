import { MpFormField } from '../../ui/MpFormField'

export function AdminFormField({
  labelTa,
  labelEn,
  children,
}: {
  labelTa: string
  labelEn: string
  children: React.ReactNode
}) {
  return (
    <MpFormField labelTa={labelTa} labelEn={labelEn}>
      {children}
    </MpFormField>
  )
}
