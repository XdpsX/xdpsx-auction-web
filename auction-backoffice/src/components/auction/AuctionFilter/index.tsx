import Search from '~/components/shared/Search'
import Selection from '~/components/shared/Selection'
import { SelectItemType } from '~/components/shared/Selection/type'
import { publishedOptions, sortOptions } from '~/utils/data'

interface AuctionFilterProps {
  keyword: string
  filteredPublished?: SelectItemType
  filteredSort?: SelectItemType
  onClear: () => void
  onSearchChange: (value: string) => void
  onPublishedChange: (key: string) => void
  onSortChange: (key: string) => void
}

function AuctionFilter({
  keyword,
  filteredPublished,
  filteredSort,
  onClear,
  onSearchChange,
  onPublishedChange,
  onSortChange
}: AuctionFilterProps) {
  return (
    <div className='gap-4 bg-white rounded-xl p-4'>
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

export default AuctionFilter
