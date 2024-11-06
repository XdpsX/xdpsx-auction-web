import { SelectItemType } from '~/components/Selection/type'

export const publishedOptions: SelectItemType[] = [
  { key: 'all', title: 'All' },
  { key: 'true', title: 'Published' },
  { key: 'false', title: 'Unpublished' }
]

export const sortOptions = [
  { title: 'Newest', key: '-date' },
  { title: 'Oldest', key: 'date' },
  { title: 'Name Z-A', key: '-name' },
  { title: 'Name A-Z', key: 'name' }
]

export const statusOptions = [
  { name: 'Upcoming', uid: 'upcoming' },
  { name: 'Live', uid: 'live' },
  { name: 'Ended', uid: 'ended' }
] as const

export type StatusOptions = (typeof statusOptions)[number]['name']

export const statusColorMap: Record<StatusOptions, string> = {
  Upcoming: 'currentColor',
  Live: '#17C964',
  Ended: '#F31260'
  // Vacation: '#F5A524'
}
