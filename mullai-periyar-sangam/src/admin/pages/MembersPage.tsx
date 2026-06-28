import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, TextField, MenuItem, Typography, Button } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { AdminModal, ModalField } from '../components/AdminModal'
import { api, type Submission } from '../lib/api'
import { useAdminSearch } from '../layout/AdminLayout'
import { useToast } from '../context/ToastContext'
import { useAdminT } from '../i18n/ui'
import {
  MpFilterChips,
  MpGridTable,
  MpGridRow,
  MpGridEmpty,
  MpStatusChip,
  MpAvatar,
  MpCallout,
  MpIconAction,
  MpTablePagination,
  mp,
} from '../../ui'
import type { MpGridColumn } from '../../ui/MpGridTable'

type Filter = 'all' | 'pending' | 'approved'
type SortKey = 'name' | 'father' | 'village' | 'phone' | 'aadhaar' | 'email' | 'date' | 'source' | 'status'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE_DEFAULT = 10

function sortValue(row: Submission, key: SortKey): string | number {
  switch (key) {
    case 'name':
      return row.name.toLowerCase()
    case 'father':
      return (row.father_name ?? '').toLowerCase()
    case 'village':
      return row.village.toLowerCase()
    case 'phone':
      return row.phone
    case 'aadhaar':
      return row.aadhaar ?? ''
    case 'email':
      return (row.email ?? '').toLowerCase()
    case 'date':
      return new Date(row.created_at).getTime()
    case 'source':
      return row.source
    case 'status':
      return row.status
    default:
      return ''
  }
}

function compareRows(a: Submission, b: Submission, key: SortKey, dir: SortDir) {
  const av = sortValue(a, key)
  const bv = sortValue(b, key)
  if (av < bv) return dir === 'asc' ? -1 : 1
  if (av > bv) return dir === 'asc' ? 1 : -1
  return 0
}

const emptyForm = {
  name: '',
  father_name: '',
  village: '',
  phone: '+91 ',
  aadhaar: '',
  email: '',
  status: 'contacted' as Submission['status'],
}

function maskAadhaar(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 4) return value || '—'
  return `XXXX XXXX ${digits.slice(-4)}`
}

const columns: MpGridColumn[] = [
  { id: 'name', label: '', width: '1.6fr' },
  { id: 'father', label: '', width: '1fr' },
  { id: 'village', label: '', width: '0.9fr' },
  { id: 'phone', label: '', width: '0.9fr' },
  { id: 'aadhaar', label: '', width: '1fr' },
  { id: 'email', label: '', width: '1.1fr' },
  { id: 'date', label: '', width: '0.75fr' },
  { id: 'source', label: '', width: '0.85fr' },
  { id: 'status', label: '', width: '0.85fr' },
  { id: 'actions', label: '', width: '110px', align: 'right' },
]

export function MembersPage() {
  const { search } = useAdminSearch()
  const { c, members: m, lang } = useAdminT()
  const { showToast, showError } = useToast()
  const [rows, setRows] = useState<Submission[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editSource, setEditSource] = useState<Submission['source'] | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const searchParams = useSearchParams()
  const router = useRouter()

  const headerColumns: MpGridColumn[] = [
    { id: 'name', label: c.name, width: '1.6fr', sortable: true },
    { id: 'father', label: c.fatherName, width: '1fr', sortable: true },
    { id: 'village', label: c.village, width: '0.9fr', sortable: true },
    { id: 'phone', label: c.phone, width: '0.9fr', sortable: true },
    { id: 'aadhaar', label: c.aadhaar, width: '1fr', sortable: true },
    { id: 'email', label: c.email, width: '1.1fr', sortable: true },
    { id: 'date', label: c.date, width: '0.75fr', sortable: true },
    { id: 'source', label: c.source, width: '0.85fr', sortable: true },
    { id: 'status', label: c.status, width: '0.85fr', sortable: true },
    { id: 'actions', label: c.actions, width: '110px', align: 'right' },
  ]

  const load = () => {
    setLoading(true)
    api.listSubmissions().then(setRows).finally(() => setLoading(false))
  }

  useEffect(load, [])

  useEffect(() => {
    if (searchParams.get('add') === '1') {
      openAdd()
      router.replace('/admin/members')
    }
  }, [searchParams])

  const pendingCount = rows.filter((r) => r.status === 'new').length
  const approvedCount = rows.length - pendingCount
  const dateLocale = lang === 'ta' ? 'ta-IN' : 'en-IN'

  const filtered = useMemo(() => {
    let list = rows
    if (filter === 'pending') list = list.filter((r) => r.status === 'new')
    if (filter === 'approved') list = list.filter((r) => r.status !== 'new')
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((r) =>
        `${r.name} ${r.father_name} ${r.village} ${r.phone} ${r.aadhaar} ${r.email}`.toLowerCase().includes(q),
      )
    }
    return list
  }, [rows, filter, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => compareRows(a, b, sortKey, sortDir))
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, safePage, pageSize])

  useEffect(() => {
    setPage(1)
  }, [filter, search, sortKey, sortDir, pageSize])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleSort = (columnId: string) => {
    const key = columnId as SortKey
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'date' ? 'desc' : 'asc')
    }
  }

  const openAdd = () => {
    setEditId(null)
    setEditSource(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (row: Submission) => {
    setEditId(row.id)
    setEditSource(row.source ?? 'website')
    setForm({
      name: row.name,
      father_name: row.father_name ?? '',
      village: row.village,
      phone: row.phone,
      aadhaar: row.aadhaar ?? '',
      email: row.email ?? '',
      status: row.status,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditId(null)
    setEditSource(null)
    router.push('/admin/members')
  }

  const save = async () => {
    try {
      if (editId) {
        await api.updateSubmission(editId, form)
        showToast(m.memberUpdated)
      } else {
        await api.createSubmission(form)
        showToast(m.memberAdded)
      }
      closeModal()
      load()
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const remove = async (id: string) => {
    if (!confirm(c.confirmDeleteMember)) return
    try {
      await api.deleteSubmission(id)
      showToast(c.deleted)
      load()
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const approve = async (id: string) => {
    try {
      await api.updateSubmission(id, { status: 'contacted' })
      showToast(m.memberApproved)
      load()
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Approve failed')
    }
  }

  const exportCsv = () => {
    const headers = [c.name, c.fatherName, c.village, c.phone, c.aadhaar, c.email, c.date, c.source, c.status]
    const csvRows = sorted.map((r) => [
      r.name,
      r.father_name,
      r.village,
      r.phone,
      r.aadhaar,
      r.email,
      new Date(r.created_at).toISOString(),
      r.source,
      r.status,
    ])
    const csv = [headers, ...csvRows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `members-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <Button variant="outlined" size="small" onClick={exportCsv} sx={{ textTransform: 'none' }}>
          Export CSV
        </Button>
      </Box>

      <MpFilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { key: 'all', label: c.all, count: rows.length },
          { key: 'pending', label: c.pending, count: pendingCount },
          { key: 'approved', label: c.approved, count: approvedCount },
        ]}
      />

      <MpGridTable
        columns={headerColumns}
        minWidth={1280}
        loading={loading}
        emptyMessage={c.noResults}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        footer={
          !loading && sorted.length > 0 ? (
            <MpTablePagination
              page={safePage}
              pageSize={pageSize}
              total={sorted.length}
              rowsPerPageLabel={m.rowsPerPage}
              showingLabel={m.showing}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          ) : undefined
        }
      >
        {!loading && sorted.length === 0 ? (
          <MpGridEmpty message={c.noResults} />
        ) : (
          pageRows.map((row) => (
            <MpGridRow key={row.id} columns={columns}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <MpAvatar name={row.name} />
                <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: mp.textDark, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {row.name}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 14, color: mp.textBody }}>{row.father_name || '—'}</Typography>
              <Typography sx={{ fontSize: 14, color: mp.textBody }}>{row.village}</Typography>
              <Typography sx={{ fontSize: 14, color: mp.textBody }}>{row.phone}</Typography>
              <Typography sx={{ fontFamily: mp.fontAccent, fontSize: 14, color: mp.textBody }}>
                {maskAadhaar(row.aadhaar)}
              </Typography>
              <Typography sx={{ fontSize: 14, color: mp.textBody, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {row.email || '—'}
              </Typography>
              <Typography sx={{ fontFamily: mp.fontAccent, fontSize: 12.5, color: mp.textSubtle }}>
                {new Date(row.created_at).toLocaleDateString(dateLocale)}
              </Typography>
              <Box>
                <MpStatusChip
                  label={row.source === 'manual' ? c.manual : c.website}
                  tone={row.source === 'manual' ? 'info' : 'neutral'}
                />
              </Box>
              <Box>
                <MpStatusChip
                  label={row.status === 'new' ? c.pending : c.approved}
                  tone={row.status === 'new' ? 'warning' : 'success'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                {row.status === 'new' && (
                  <MpIconAction variant="approve" title={c.approve} onClick={() => approve(row.id)}>
                    <CheckIcon sx={{ fontSize: 16 }} />
                  </MpIconAction>
                )}
                <MpIconAction variant="edit" title={c.edit} onClick={() => openEdit(row)}>
                  <EditIcon sx={{ fontSize: 16 }} />
                </MpIconAction>
                <MpIconAction variant="delete" title={c.delete} onClick={() => remove(row.id)}>
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </MpIconAction>
              </Box>
            </MpGridRow>
          ))
        )}
      </MpGridTable>

      <AdminModal
        open={modalOpen}
        size="wide"
        titleTa={editId ? m.editMember : m.addMember}
        titleEn={editId ? m.editMember : m.addMember}
        saveLabel={editId ? c.save : c.add}
        onClose={closeModal}
        onSave={save}
      >
        {!editId ? (
          <MpCallout tone="info">{m.manualNote}</MpCallout>
        ) : (
          <MpCallout tone="neutral">
            {c.source}: <strong>{editSource === 'manual' ? c.manual : c.website}</strong>
          </MpCallout>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.25 }}>
          {(
            [
              ['name', c.name],
              ['father_name', c.fatherName],
              ['phone', c.phone],
              ['aadhaar', c.aadhaar],
              ['village', c.village],
              ['email', c.email],
            ] as const
          ).map(([key, label]) => (
            <ModalField key={key} labelTa={label} labelEn={label}>
              <TextField
                type={key === 'email' ? 'email' : 'text'}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={key === 'aadhaar' ? '12-digit Aadhaar' : undefined}
              />
            </ModalField>
          ))}
        </Box>
        <ModalField labelTa={c.status} labelEn={c.status}>
          <TextField select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Submission['status'] }))}>
            <MenuItem value="contacted">{c.approved}</MenuItem>
            <MenuItem value="new">{c.pending}</MenuItem>
            <MenuItem value="archived">{c.archived}</MenuItem>
          </TextField>
        </ModalField>
      </AdminModal>
    </>
  )
}
