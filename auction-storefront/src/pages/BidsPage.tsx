import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import useQueryParams from '../hooks/useQueryParams'
import { fetchMyBidsAsync, selectBid } from '../features/bid/slice'
import { bidSortOptions } from '../utils/data'
import { useEffect } from 'react'
import BidTable from '../components/bid/BidTable'
import Select from '../components/ui/Select'

const tabs = [
  { name: 'Active', href: '?status=ACTIVE', id: 'ACTIVE' },
  { name: 'Won', href: '?status=WON', id: 'WON' },
  { name: 'Lost', href: '?status=LOST', id: 'LOST' },
  { name: 'Paid', href: '?status=PAID', id: 'PAID' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function BidsPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, sort, status },
    setParams,
  } = useQueryParams()
  const { userBids, isLoading } = useAppSelector(selectBid)
  const filteredSort =
    bidSortOptions.find((option) => option.key === sort) || bidSortOptions[0]
  const filteredStatus = tabs.find((tab) => tab.id === status)

  useEffect(() => {
    dispatch(
      fetchMyBidsAsync({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        sort: sort,
        status: status,
      })
    )
  }, [dispatch, pageNum, pageSize, sort, status])

  const onSortChange = (key: string) => {
    setParams({ sort: key })
  }

  return (
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-12 space-y-4">
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Status
          </label>
          <select
            id="tabs"
            name="tabs"
            defaultValue={filteredStatus?.name || tabs[0].name}
            className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => navigate(`?status=${e.target.value}`)}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav aria-label="Tabs" className="-mb-px flex">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.href}
                  aria-current={
                    tab.id === filteredStatus?.id ? 'page' : undefined
                  }
                  className={classNames(
                    tab.id === filteredStatus?.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'w-full border-b-2 px-1 py-4 text-center text-sm font-medium'
                  )}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <span className="bg-gray-200 text-gray-800 rounded-lg px-2 py-1 font-semibold">
            {userBids?.totalItems || 0} items
          </span>
          <Select
            className="border"
            selectKey={filteredSort.key}
            options={bidSortOptions}
            onChange={onSortChange}
          />
        </div>
        <BidTable bidPage={userBids} isLoading={isLoading} status={status} />
      </div>
    </div>
  )
}
export default BidsPage
