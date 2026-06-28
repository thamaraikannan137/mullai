import type { BearerItem, DemandItem } from '../../i18n/translations'

export interface LeadersSection {
  sectionLabel: string
  presidentName: string
  presidentRoleShort: string
  quote: string
  p1: string
  presidentRole: string
  bearersTitle: string
  bearers: BearerItem[]
}

export interface DemandsSection {
  sectionLabel: string
  title: string
  intro: string
  items: DemandItem[]
}
