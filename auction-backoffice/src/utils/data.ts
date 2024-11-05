import { SelectItemType } from '~/components/shared/Selection/type'

export const publishedOptions: SelectItemType[] = [
  { key: '', title: 'All' },
  { key: 'true', title: 'Published' },
  { key: 'false', title: 'Unpublished' }
]

export const sortOptions = [
  { title: 'Name A-Z', key: 'name' },
  { title: 'Name Z-A', key: '-name' },
  { title: 'Oldest', key: 'date' },
  { title: 'Newest', key: '-date' }
]
