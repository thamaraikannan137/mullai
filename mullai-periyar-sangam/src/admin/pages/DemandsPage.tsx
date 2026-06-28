import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TextField } from '@mui/material'
import { AdminModal, ModalField } from '../components/AdminModal'
import { useToast } from '../context/ToastContext'
import { api } from '../lib/api'
import type { DemandsSection } from '../types/content'

import { useAdminT } from '../i18n/ui'

const emptyForm = { num: '', textTa: '', textEn: '', subTa: '', subEn: '' }

function renumberItems(ta: DemandsSection, en: DemandsSection) {
  ta.items.forEach((item, index) => {
    const num = String(index + 1).padStart(2, '0')
    item.num = num
    if (en.items[index]) en.items[index].num = num
  })
}

export function DemandsPage() {
  const { c, demands: d, lang } = useAdminT()
  const [ta, setTa] = useState<DemandsSection | null>(null)
  const [en, setEn] = useState<DemandsSection | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast, showError } = useToast()

  const load = () =>
    api.getDemands().then(({ ta: taData, en: enData }) => {
      setTa(taData)
      setEn(enData)
    })

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (params.get('add') === '1' && ta && en) {
      openAdd()
      setParams({})
    }
  }, [params, setParams, ta, en])

  const openAdd = () => {
    const num = String((ta?.items.length ?? 0) + 1).padStart(2, '0')
    setEditIndex(ta?.items.length ?? 0)
    setForm({ num, textTa: '', textEn: '', subTa: '', subEn: '' })
    setModalOpen(true)
  }

  const openEdit = (index: number) => {
    if (!ta || !en) return
    const item = ta.items[index]
    const enItem = en.items[index]
    setEditIndex(index)
    setForm({
      num: item.num,
      textTa: item.text,
      textEn: enItem?.text ?? '',
      subTa: item.sub ?? '',
      subEn: enItem?.sub ?? '',
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    navigate('/admin/demands')
  }

  const save = async () => {
    if (!ta || !en || editIndex === null) return

    const nextTa = structuredClone(ta)
    const nextEn = structuredClone(en)
    const item = {
      num: form.num,
      text: form.textTa,
      ...(form.subTa.trim() ? { sub: form.subTa.trim() } : {}),
    }
    const enItem = {
      num: form.num,
      text: form.textEn,
      ...(form.subEn.trim() ? { sub: form.subEn.trim() } : {}),
    }

    if (editIndex >= nextTa.items.length) {
      nextTa.items.push(item)
      nextEn.items.push(enItem)
    } else {
      nextTa.items[editIndex] = item
      nextEn.items[editIndex] = enItem
    }

    try {
      renumberItems(nextTa, nextEn)
      await api.updateDemands({ ta: nextTa, en: nextEn })
      showToast(editIndex >= ta.items.length ? d.demandAdded : d.demandUpdated)
      setTa(nextTa)
      setEn(nextEn)
      closeModal()
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const saveSection = async () => {
    if (!ta || !en) return
    setSaving(true)
    try {
      await api.updateDemands({ ta, en })
      showToast(c.saved)
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    if (!ta || !en) return
    const target = index + dir
    if (target < 0 || target >= ta.items.length) return
    const nextTa = structuredClone(ta)
    const nextEn = structuredClone(en)
    ;[nextTa.items[index], nextTa.items[target]] = [nextTa.items[target], nextTa.items[index]]
    ;[nextEn.items[index], nextEn.items[target]] = [nextEn.items[target], nextEn.items[index]]
    renumberItems(nextTa, nextEn)
    try {
      await api.updateDemands({ ta: nextTa, en: nextEn })
      setTa(nextTa)
      setEn(nextEn)
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Reorder failed')
    }
  }

  const remove = async (index: number) => {
    if (!ta || !en) return
    if (!confirm(c.confirmDeleteDemand)) return

    const nextTa = structuredClone(ta)
    const nextEn = structuredClone(en)
    nextTa.items.splice(index, 1)
    nextEn.items.splice(index, 1)
    try {
      renumberItems(nextTa, nextEn)
      await api.updateDemands({ ta: nextTa, en: nextEn })
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
      <div className="mb-6 max-w-[920px] rounded-[18px] border border-[#E4EDE7] bg-white p-6 shadow-[0_10px_30px_rgba(5,70,50,0.05)]">
        <h3 className="font-tamil-serif m-0 text-lg font-bold text-green-dark">Section intro</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ModalField labelTa="பிரிவு label (தமிழ்)" labelEn="Section label (Tamil)">
            <TextField value={ta.sectionLabel} onChange={(e) => setTa({ ...ta, sectionLabel: e.target.value })} />
          </ModalField>
          <ModalField labelTa="Section label (English)" labelEn="Section label (English)">
            <TextField value={en.sectionLabel} onChange={(e) => setEn({ ...en, sectionLabel: e.target.value })} />
          </ModalField>
          <ModalField labelTa="தலைப்பு (தமிழ்)" labelEn="Title (Tamil)">
            <TextField value={ta.title} onChange={(e) => setTa({ ...ta, title: e.target.value })} />
          </ModalField>
          <ModalField labelTa="Title (English)" labelEn="Title (English)">
            <TextField value={en.title} onChange={(e) => setEn({ ...en, title: e.target.value })} />
          </ModalField>
          <ModalField labelTa="அறிமுகம் (தமிழ்)" labelEn="Intro (Tamil)">
            <TextField multiline minRows={3} value={ta.intro} onChange={(e) => setTa({ ...ta, intro: e.target.value })} />
          </ModalField>
          <ModalField labelTa="Intro (English)" labelEn="Intro (English)">
            <TextField multiline minRows={3} value={en.intro} onChange={(e) => setEn({ ...en, intro: e.target.value })} />
          </ModalField>
        </div>
        <button type="button" disabled={saving} onClick={saveSection} className="mt-4 rounded-[10px] bg-green-mid px-5 py-2.5 text-sm font-semibold text-white">
          {saving ? '…' : c.save}
        </button>
      </div>

      <div className="flex max-w-[920px] flex-col gap-3.5">
        {ta.items.map((item, index) => (
          <div
            key={`${item.num}-${index}`}
            className="flex items-start gap-[22px] rounded-[14px] border border-[#E4EDE7] bg-white px-[26px] py-6 shadow-[0_8px_24px_rgba(5,70,50,0.04)]"
          >
            <span className="font-number min-w-[42px] shrink-0 text-[34px] font-bold leading-none text-gold">
              {item.num}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-tamil-serif m-0 text-[17px] font-semibold leading-snug text-[#16261E]">
                {lang === 'ta' ? item.text : en.items[index]?.text ?? item.text}
              </p>
              {(lang === 'ta' ? item.sub : en.items[index]?.sub) && (
                <p className="font-accent m-0 mt-1.5 text-[14px] italic text-[#7C8A81]">
                  {lang === 'ta' ? item.sub : en.items[index]?.sub}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#E4EDE7] bg-white text-[#5A6B61] disabled:opacity-40">↑</button>
              <button type="button" disabled={index === ta.items.length - 1} onClick={() => move(index, 1)} className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#E4EDE7] bg-white text-[#5A6B61] disabled:opacity-40">↓</button>
              <button
                type="button"
                onClick={() => openEdit(index)}
                className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#E4EDE7] bg-white text-[#5A6B61] hover:border-green-mid hover:text-green-mid"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#E4EDE7] bg-white text-[#5A6B61] hover:border-[#C2412D] hover:bg-[#FBEEEC] hover:text-[#C2412D]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        open={modalOpen}
        titleTa={editIndex !== null && editIndex >= ta.items.length ? d.addDemand : d.editDemand}
        titleEn={editIndex !== null && editIndex >= ta.items.length ? d.addDemand : d.editDemand}
        saveLabel={c.save}
        onClose={closeModal}
        onSave={save}
      >
        <ModalField labelTa={d.number} labelEn={d.number}>
          <TextField value={form.num} onChange={(e) => setForm((f) => ({ ...f, num: e.target.value }))} />
        </ModalField>
        <ModalField labelTa={d.demandTa} labelEn={d.demandTa}>
          <TextField multiline minRows={4} value={form.textTa} onChange={(e) => setForm((f) => ({ ...f, textTa: e.target.value }))} />
        </ModalField>
        <ModalField labelTa={d.demandEn} labelEn={d.demandEn}>
          <TextField multiline minRows={4} value={form.textEn} onChange={(e) => setForm((f) => ({ ...f, textEn: e.target.value }))} />
        </ModalField>
        <ModalField labelTa="Subtext (Tamil, optional)" labelEn="Subtext (Tamil, optional)">
          <TextField value={form.subTa} onChange={(e) => setForm((f) => ({ ...f, subTa: e.target.value }))} />
        </ModalField>
        <ModalField labelTa="Subtext (English, optional)" labelEn="Subtext (English, optional)">
          <TextField value={form.subEn} onChange={(e) => setForm((f) => ({ ...f, subEn: e.target.value }))} />
        </ModalField>
      </AdminModal>
    </>
  )
}
