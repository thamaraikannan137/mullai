import { redirect } from 'next/navigation'

export default function LegacyNewsNew() {
  redirect('/admin/news?new=1')
}
