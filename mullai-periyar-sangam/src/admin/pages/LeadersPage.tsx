import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TextField } from '@mui/material'
import { AdminModal, ModalField } from '../components/AdminModal'
import { useToast } from '../context/ToastContext'
import { api } from '../lib/api'
import type { LeadersSection } from '../types/content'

type LeaderKind = 'president' | 'bearer'

interface LeaderCard {
  kind: LeaderKind
  index: number
  nameTa: string
  nameEn: string
  roleTa: string
  roleEn: string
  initial: string
  president: boolean
}

import { useAdminT } from '../i18n/ui'

const emptyForm = { nameTa: '', nameEn: '', roleTa: '', roleEn: '', initial: '', quoteTa: '', quoteEn: '', p1Ta: '', p1En: '', photoUrl: '' }

function buildCards(ta: LeadersSection, en: LeadersSection): LeaderCard[] {
  const presidentInitial = (ta.presidentRoleShort || ta.presidentName || '?').trim().charAt(0)
  const cards: LeaderCard[] = [
    {
      kind: 'president',
      index: -1,
      nameTa: ta.presidentName,
      nameEn: en.presidentName,
      roleTa: ta.presidentRoleShort,
      roleEn: en.presidentRoleShort,
      initial: presidentInitial,
      president: true,
    },
  ]

  ta.bearers.forEach((bearer, index) => {
    const enBearer = en.bearers[index] ?? bearer
    cards.push({
      kind: 'bearer',
      index,
      nameTa: bearer.name,
      nameEn: enBearer.name,
      roleTa: bearer.role,
      roleEn: enBearer.role,
      initial: bearer.initial || bearer.name.trim().charAt(0) || '?',
      president: false,
    })
  })

  return cards
}

export function LeadersPage() {
  const { c, leaders: l, lang } = useAdminT()
  const [ta, setTa] = useState<LeadersSection | null>(null)
  const [en, setEn] = useState<LeadersSection | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editKind, setEditKind] = useState<LeaderKind>('bearer')
  const [editIndex, setEditIndex] = useState(-1)
  const [form, setForm] = useState(emptyForm)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showToast, showError } = useToast()

  const load = () =>
    api.getLeaders().then(({ ta: taData, en: enData }) => {
      setTa(taData)
      setEn(enData)
    })

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (searchParams.get('add') === '1' && ta && en) {
      openAdd()
      router.replace('/admin/leaders')
    }
  }, [searchParams, ta, en])

  const cards = useMemo(() => (ta && en ? buildCards(ta, en) : []), [ta, en])

  const openAdd = () => {
    setEditKind('bearer')
    setEditIndex(ta?.bearers.length ?? 0)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (card: LeaderCard) => {
    setEditKind(card.kind)
    setEditIndex(card.index)
    if (card.kind === 'president') {
      api.getImages().then((imgs) => {
        setForm({
          nameTa: ta?.presidentName ?? '',
          nameEn: en?.presidentName ?? '',
          roleTa: ta?.presidentRoleShort ?? '',
          roleEn: en?.presidentRoleShort ?? '',
          initial: card.initial,
          quoteTa: ta?.quote ?? '',
          quoteEn: en?.quote ?? '',
          p1Ta: ta?.p1 ?? '',
          p1En: en?.p1 ?? '',
          photoUrl: imgs.presidentPhoto ?? '',
        })
      })
    } else {
      const bearer = ta?.bearers[card.index]
      const enBearer = en?.bearers[card.index]
      setForm({
        nameTa: bearer?.name ?? '',
        nameEn: enBearer?.name ?? '',
        roleTa: bearer?.role ?? '',
        roleEn: enBearer?.role ?? '',
        initial: bearer?.initial ?? '',
        quoteTa: '',
        quoteEn: '',
        p1Ta: '',
        p1En: '',
        photoUrl: '',
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    router.push('/admin/leaders')
  }

  const save = async () => {
    if (!ta || !en) return

    const nextTa = structuredClone(ta)
    const nextEn = structuredClone(en)
    const initial = form.initial.trim() || form.roleTa.trim().charAt(0) || form.nameTa.trim().charAt(0) || '?'

    try {
      if (editKind === 'president') {
        nextTa.presidentName = form.nameTa
        nextEn.presidentName = form.nameEn
        nextTa.presidentRoleShort = form.roleTa
        nextEn.presidentRoleShort = form.roleEn
        nextTa.quote = form.quoteTa
        nextEn.quote = form.quoteEn
        nextTa.p1 = form.p1Ta
        nextEn.p1 = form.p1En
        const imgs = await api.getImages()
        await api.updateImages({ ...imgs, presidentPhoto: form.photoUrl })
      } else if (editIndex >= nextTa.bearers.length) {
        nextTa.bearers.push({ name: form.nameTa, role: form.roleTa, initial })
        nextEn.bearers.push({ name: form.nameEn, role: form.roleEn, initial })
      } else {
        nextTa.bearers[editIndex] = { name: form.nameTa, role: form.roleTa, initial }
        nextEn.bearers[editIndex] = { name: form.nameEn, role: form.roleEn, initial }
      }

      await api.updateLeaders({ ta: nextTa, en: nextEn })
      showToast(editIndex >= nextTa.bearers.length && editKind === 'bearer' ? l.leaderAdded : l.leaderUpdated)
      setTa(nextTa)
      setEn(nextEn)
      closeModal()
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const remove = async (index: number) => {
    if (!ta || !en) return
    if (!confirm(c.confirmDeleteLeader)) return

    try {
      const nextTa = structuredClone(ta)
      const nextEn = structuredClone(en)
      nextTa.bearers.splice(index, 1)
      nextEn.bearers.splice(index, 1)

      await api.updateLeaders({ ta: nextTa, en: nextEn })
      showToast(c.deleted)
      setTa(nextTa)
      setEn(nextEn)
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  if (!ta || !en) {
    return <p className="text-sm text-[#5A6B61]">{c.loading}</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={`${card.kind}-${card.index}`}
            className="relative rounded-[18px] border border-[#E4EDE7] bg-white p-[26px] shadow-[0_10px_30px_rgba(5,70,50,0.05)]"
          >
            {card.president && (
              <span className="font-accent absolute right-[18px] top-[18px] rounded-[20px] bg-[#FBF1D8] px-[11px] py-[5px] text-[11px] uppercase tracking-[1.5px] text-gold">
                {l.presidency}
              </span>
            )}
            <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-gradient-to-br from-green-mid to-green-dark shadow-[inset_0_0_0_1px_rgba(230,177,48,0.5)]">
              <span className="font-accent text-[26px] font-semibold text-[#F3E3B3]">{card.initial}</span>
            </div>
            <h3 className="font-tamil-serif mt-[18px] text-[19px] font-bold text-green-dark">
              {lang === 'ta' ? card.nameTa : card.nameEn}
            </h3>
            <p className="mt-1.5 text-[13.5px] font-semibold text-green-mid">
              {lang === 'ta' ? card.roleTa : card.roleEn}
            </p>
            {lang === 'ta' && (
              <p className="font-accent mt-px text-[13.5px] italic text-gold">{card.roleEn}</p>
            )}
            <div className="mt-5 flex gap-2 border-t border-[#EEF3EF] pt-[18px]">
              <button
                type="button"
                onClick={() => openEdit(card)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-[#E4EDE7] bg-white py-2 text-[13px] font-semibold text-[#3C4A42] hover:border-green-mid hover:text-green-mid"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                {c.edit}
              </button>
              {!card.president && (
                <button
                  type="button"
                  onClick={() => remove(card.index)}
                  className="flex w-10 items-center justify-center rounded-[9px] border border-[#E4EDE7] bg-white text-[#5A6B61] hover:border-[#C2412D] hover:bg-[#FBEEEC] hover:text-[#C2412D]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        open={modalOpen}
        titleTa={
          editKind === 'president'
            ? l.editPresident
            : editIndex >= ta.bearers.length
              ? l.addLeader
              : l.editBearer
        }
        titleEn={
          editKind === 'president'
            ? l.editPresident
            : editIndex >= ta.bearers.length
              ? l.addLeader
              : l.editBearer
        }
        saveLabel={c.save}
        onClose={closeModal}
        onSave={save}
      >
        <ModalField labelTa={c.name} labelEn={c.name}>
          <TextField value={form.nameTa} onChange={(e) => setForm((f) => ({ ...f, nameTa: e.target.value }))} />
        </ModalField>
        <ModalField labelTa={l.nameEn} labelEn={l.nameEn}>
          <TextField value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))} />
        </ModalField>
        <ModalField labelTa={l.role} labelEn={l.role}>
          <TextField value={form.roleTa} onChange={(e) => setForm((f) => ({ ...f, roleTa: e.target.value }))} />
        </ModalField>
        <ModalField labelTa={l.roleEn} labelEn={l.roleEn}>
          <TextField value={form.roleEn} onChange={(e) => setForm((f) => ({ ...f, roleEn: e.target.value }))} />
        </ModalField>
        {editKind === 'president' && (
          <>
            <ModalField labelTa="மேற்கோள் (தமிழ்)" labelEn="Quote (Tamil)">
              <TextField multiline minRows={3} value={form.quoteTa} onChange={(e) => setForm((f) => ({ ...f, quoteTa: e.target.value }))} />
            </ModalField>
            <ModalField labelTa="Quote (English)" labelEn="Quote (English)">
              <TextField multiline minRows={3} value={form.quoteEn} onChange={(e) => setForm((f) => ({ ...f, quoteEn: e.target.value }))} />
            </ModalField>
            <ModalField labelTa="பத்தி (தமிழ்)" labelEn="Bio (Tamil)">
              <TextField multiline minRows={3} value={form.p1Ta} onChange={(e) => setForm((f) => ({ ...f, p1Ta: e.target.value }))} />
            </ModalField>
            <ModalField labelTa="Bio (English)" labelEn="Bio (English)">
              <TextField multiline minRows={3} value={form.p1En} onChange={(e) => setForm((f) => ({ ...f, p1En: e.target.value }))} />
            </ModalField>
            <ModalField labelTa="Photo URL" labelEn="Photo URL">
              <TextField value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} />
            </ModalField>
          </>
        )}
        {editKind === 'bearer' && (
          <ModalField labelTa={l.initial} labelEn={l.initial}>
            <TextField value={form.initial} onChange={(e) => setForm((f) => ({ ...f, initial: e.target.value }))} placeholder="செ" />
          </ModalField>
        )}
      </AdminModal>
    </>
  )
}
