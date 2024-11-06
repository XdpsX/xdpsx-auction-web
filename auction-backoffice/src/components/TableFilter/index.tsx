import Search from '~/components/Search'
import Selection from '~/components/Selection'
import { SelectItemType } from '~/components/Selection/type'
import { publishedOptions, sortOptions } from '~/utils/data'

interface TableFilterProps {
  keyword: string
  filteredPublished?: SelectItemType
  filteredSort?: SelectItemType
  onClear: () => void
  onSearchChange: (value: string) => void
  onPublishedChange: (key: string) => void
  onSortChange: (key: string) => void
}

function TableFilter({
  keyword,
  filteredPublished,
  filteredSort,
  onClear,
  onSearchChange,
  onPublishedChange,
  onSortChange
}: TableFilterProps) {
  return (
    <div className='gap-4  rounded-xl p-4'>
      <div className='flex items-center gap-6 '>
        <Search value={keyword} onClear={onClear} onSearch={onSearchChange} />

        <Selection
          label='Has Published ?'
          selectedKey={[filteredPublished?.key || '']}
          items={publishedOptions}
          onChange={onPublishedChange}
          variant='outline'
        />

        <Selection
          label='Sort'
          selectedKey={[filteredSort?.key || '-date']}
          items={sortOptions}
          onChange={onSortChange}
          variant='outline'
        />
      </div>
    </div>
  )
}

export default TableFilter
