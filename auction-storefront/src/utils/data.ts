import { SelectOptionType } from '../components/ui/Select'

export const statusOptions = [
  { name: 'Upcoming', uid: 'upcoming' },
  { name: 'Live', uid: 'live' },
  { name: 'Ending soon', uid: 'endingSoon' },
  { name: 'Ended', uid: 'ended' },
] as const

export type StatusOptions = (typeof statusOptions)[number]['name']

export const statusColorMap: Record<StatusOptions, string> = {
  Upcoming: 'currentColor',
  Live: '#17C964',
  'Ending soon': '#F5A524',
  Ended: '#F31260',
}

export const bidSortOptions: SelectOptionType[] = [
  { title: 'Newest', key: '-date' },
  { title: 'Oldest', key: 'date' },
  { title: 'Amount 9-0', key: '-amount' },
  { title: 'Amount 0-9', key: 'amount' },
]
export const orderSortOptions: SelectOptionType[] = bidSortOptions
export const transactionSortOptions: SelectOptionType[] = bidSortOptions

export const pageNumOptions: SelectOptionType[] = [
  { key: '5', title: '5' },
  { key: '10', title: '10' },
  { key: '20', title: '20' },
]
