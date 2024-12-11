import { Spinner } from '@nextui-org/react'
import { useEffect } from 'react'
import { fetchAdminStatsAsync, fetchSellerStatsAsync } from '~/app/features/report'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import StatsCard from '~/components/StatsCard'
import { formatNumber } from '~/utils/format'

function Stats() {
  const dispatch = useAppDispatch()
  const { userRole } = useAppSelector((state) => state.user)
  const { adminStats, sellerStats, isLoadingStats } = useAppSelector((state) => state.report)

  useEffect(() => {
    if (!userRole) return

    if (userRole === 'ADMIN') {
      dispatch(fetchAdminStatsAsync())
    } else {
      dispatch(fetchSellerStatsAsync())
    }
  }, [dispatch, userRole])

  const getChangeType = (percentageChange: number) => {
    if (percentageChange > 0) return 'positive'
    if (percentageChange < 0) return 'negative'
    return 'neutral'
  }

  if (isLoadingStats) return <Spinner size='lg' />

  if (userRole === 'ADMIN') {
    if (!adminStats) return null
    return (
      <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8'>
        <StatsCard
          icon='solar:sledgehammer-outline'
          title='Total Auctions'
          value={formatNumber(adminStats.auction.totalCount)}
          change={`${adminStats.auction.percentageChange}%`}
          changeType={getChangeType(adminStats.auction.percentageChange)}
          iconClassName='text-blue-500'
          divIconClassName='bg-blue-100'
        />
        <StatsCard
          icon='solar:box-linear'
          title='Total Orders'
          value={formatNumber(adminStats.order.totalCount)}
          change={`${adminStats.order.percentageChange}%`}
          changeType={getChangeType(adminStats.order.percentageChange)}
          iconClassName='text-green-500'
          divIconClassName='bg-green-100'
        />
        <StatsCard
          icon='material-symbols:person-outline'
          title='Total Users'
          value={formatNumber(adminStats.user.totalCount)}
          change={`${adminStats.user.percentageChange}%`}
          changeType={getChangeType(adminStats.user.percentageChange)}
          iconClassName='text-yellow-500'
          divIconClassName='bg-yellow-100'
        />
        <StatsCard
          icon='carbon:sales-ops'
          title='Total Sellers'
          value={formatNumber(adminStats.seller.totalCount)}
          change={`${adminStats.seller.percentageChange}%`}
          changeType={getChangeType(adminStats.seller.percentageChange)}
          iconClassName='text-purple-500'
          divIconClassName='bg-purple-100'
        />
      </section>
    )
  }

  if (!sellerStats) return null
  return (
    <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8'>
      <StatsCard
        icon='solar:sledgehammer-outline'
        title='Total Auctions'
        value={formatNumber(sellerStats.auction.totalCount)}
        change={`${sellerStats.auction.percentageChange}%`}
        changeType={getChangeType(sellerStats.auction.percentageChange)}
        iconClassName='text-blue-500'
        divIconClassName='bg-blue-100'
      />
      <StatsCard
        icon='solar:box-linear'
        title='Total Orders'
        value={formatNumber(sellerStats.order.totalCount)}
        change={`${sellerStats.order.percentageChange}%`}
        changeType={getChangeType(sellerStats.order.percentageChange)}
        iconClassName='text-green-500'
        divIconClassName='bg-green-100'
      />
      <StatsCard
        icon='material-symbols:person-outline'
        title='Total Bidders'
        value={formatNumber(sellerStats.bidder.totalCount)}
        change={`${sellerStats.bidder.percentageChange}%`}
        changeType={getChangeType(sellerStats.bidder.percentageChange)}
        iconClassName='text-yellow-500'
        divIconClassName='bg-yellow-100'
      />
      <StatsCard
        icon='ph:hand-withdraw'
        title='Total Withdrawals'
        value={formatNumber(sellerStats.withdraw.totalCount)}
        change={`${sellerStats.withdraw.percentageChange}%`}
        changeType={getChangeType(sellerStats.withdraw.percentageChange)}
        iconClassName='text-purple-500'
        divIconClassName='bg-purple-100'
      />
    </section>
  )
}
export default Stats
