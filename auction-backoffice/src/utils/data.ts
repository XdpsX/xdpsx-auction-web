import { SelectItemType } from '~/components/shared/Selection/type'

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
