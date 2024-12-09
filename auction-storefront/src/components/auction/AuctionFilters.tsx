import useQueryParams from '../../hooks/useQueryParams'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useState } from 'react'
import { toast } from 'react-toastify'

const auctionTypes = [
  { id: 'all', title: 'All' },
  { id: 'ENGLISH', title: 'English' },
  { id: 'SEALED_BID', title: 'Sealed_Bid' },
]

const auctionTimes = [
  { id: 'all', title: 'All' },
  { id: 'UPCOMING', title: 'Upcoming' },
  { id: 'LIVE', title: 'Live' },
]

function AuctionFilters() {
  const {
    params: {
      auctionType: type,
      auctionTime: time,
      minPrice: min,
      maxPrice: max,
    },
    setParams,
  } = useQueryParams()

  // State for auction type and time
  const [selectedAuctionType, setSelectedAuctionType] = useState(type)
  const [selectedAuctionTime, setSelectedAuctionTime] = useState(time)

  // State for price range
  const [minPrice, setMinPrice] = useState(min || '')
  const [maxPrice, setMaxPrice] = useState(max || '')

  const onFilter = () => {
    if (minPrice && maxPrice && minPrice > maxPrice) {
      toast.error('Min price should be less than max price')
      return
    }
    setParams({
      type: selectedAuctionType,
      time: selectedAuctionTime,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    })
  }

  const onReset = () => {
    // setSelectedAuctionType('all')
    // setSelectedAuctionTime('all')
    // setMinPrice('')
    // setMaxPrice('')
    setParams({
      type: 'all',
      time: 'all',
      minPrice: null,
      maxPrice: null,
    })
  }
  return (
    <div className="pr-10 space-y-6">
      <h2 className="text-lg font-bold ">Auction Filters</h2>
      <div className="space-y-4">
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-gray-900">
            Auction Type
          </legend>
          <div className="mt-4 space-y-2">
            {auctionTypes.map((opt) => (
              <div key={opt.id} className="flex items-center">
                <input
                  defaultChecked={opt.id === selectedAuctionType}
                  id={opt.id}
                  name="auction-type"
                  type="radio"
                  value={opt.id}
                  onChange={(e) => setSelectedAuctionType(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <label
                  htmlFor={opt.id}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {opt.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-gray-900">
            Auction Time
          </legend>
          <div className="mt-4 space-y-2">
            {auctionTimes.map((opt) => (
              <div key={opt.id} className="flex items-center">
                <input
                  defaultChecked={opt.id === selectedAuctionTime}
                  id={opt.id}
                  name="auction-time"
                  value={opt.id}
                  onChange={(e) => setSelectedAuctionTime(e.target.value)}
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <label
                  htmlFor={opt.id}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {opt.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-gray-900">
            Auction Price
          </legend>
          <div className="mt-4 space-y-2 flex items-center gap-4">
            <Input
              name="minPrice"
              placeholder="Min"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              classNameInput="pr-1"
            />
            -
            <Input
              name="maxPrice"
              placeholder="Max"
              type="number"
              classNameInput="pr-1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </fieldset>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={onFilter} className="bg-blue-500">
          Filter
        </Button>
        <Button onClick={onReset} className="bg-red-500">
          Clear
        </Button>
      </div>
    </div>
  )
}
export default AuctionFilters
