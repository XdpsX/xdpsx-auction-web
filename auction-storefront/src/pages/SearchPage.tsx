import { useNavigate } from 'react-router-dom'
import useQueryParams from '../hooks/useQueryParams'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useEffect } from 'react'
import { searchAuctionsAsync, selectAuction } from '../features/auction/slice'
import { AuctionTime, AuctionType } from '../models/auction.type'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import AuctionFilters from '../components/auction/AuctionFilters'
import AuctionList from '../components/auction/AuctionList'

function SearchPage() {
  const {
    params: {
      keyword,
      categoryId,
      pageNum,
      auctionTime: time,
      auctionType: type,
      minPrice,
      maxPrice,
    },
  } = useQueryParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, searchAuctions } = useAppSelector(selectAuction)

  useEffect(() => {
    if (!keyword) {
      navigate('/')
      return
    }
    dispatch(
      searchAuctionsAsync({
        keyword,
        pageNum: +pageNum,
        categoryId: categoryId === 'all' ? null : +categoryId,
        minPrice: minPrice ? +minPrice : null,
        maxPrice: maxPrice ? +maxPrice : null,
        type: type === 'all' ? null : (type as AuctionType),
        time: time === 'all' ? null : (time as AuctionTime),
      })
    )
  }, [
    categoryId,
    dispatch,
    keyword,
    maxPrice,
    minPrice,
    navigate,
    pageNum,
    time,
    type,
  ])

  if (isLoading) return <LoadingOverlay />
  if (!searchAuctions) return null
  console.log(searchAuctions)
  return (
    <div className="w-full flex flex-wrap px-8 py-14 md:px-12 xl:px-32">
      <div className="w-full md:w-2/12">
        <AuctionFilters />
      </div>
      <div className="w-full md:w-10/12">
        <div className="py-4 bg-white mb-10 px-3 rounded-md flex justify-between items-start border">
          <h2 className="text-lg font-medium text-slate-600">
            {searchAuctions.totalItems} Totals Auciton
          </h2>
        </div>
        <div>
          {searchAuctions.items.length > 0 ? (
            <AuctionList
              auctions={searchAuctions.items}
              className="xl:grid-cols-4 3xl:grid-cols-5"
            />
          ) : (
            <div className="text-center text-gray-500 text-lg">
              No auction found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default SearchPage
