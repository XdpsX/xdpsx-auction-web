import { Link } from 'react-router-dom'
import { formatDateTime, formatPrice } from '../../utils/format'
import { Auction } from '../../models/auction.type'
import DEFAULT_AVATAR from '../../assets/default-user-icon.png'
import { Status } from '../ui/Status'

function AuctionCard({ auction }: { auction: Auction }) {
  const renderDate = (auction: Auction) => {
    const now = new Date()
    const endingTime = new Date(auction.endingTime)

    if (now < new Date(auction.startingTime)) {
      const content = (
        <div className="bg-gray-100 shadow-sm px-2 py-2">
          <p>Starting time: {formatDateTime(auction.startingTime)}</p>
        </div>
      )
      return <Status status="Upcoming" content={content} />
    } else if (endingTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      const timeDifference = endingTime.getTime() - now.getTime()
      const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60))
      const content = (
        <div className="bg-gray-100 shadow-sm px-2 py-2">
          <p className="font-semibold text-red-500">{hoursLeft} hours left</p>
          <p>Ending time: {formatDateTime(auction.endingTime)}</p>
        </div>
      )
      return <Status status="Ending soon" content={content} />
    } else {
      const content = (
        <div className="bg-gray-100 shadow-sm px-2 py-2">
          <p>Starting time: {formatDateTime(auction.startingTime)}</p>
          <p>Ending time: {formatDateTime(auction.endingTime)}</p>
        </div>
      )
      return <Status status="Live" content={content} />
    }
  }

  return (
    <Link
      to={'/auctions/details'}
      key={auction.id}
      className="relative border space-y-4 pb-4 group transition-all duration-500 shadow-sm hover:shadow-md hover:-translate-y-2"
    >
      <div
        className={`absolute left-2 top-2 p-2 text-white text-sm ${
          auction.auctionType === 'English' ? 'bg-blue-500' : 'bg-yellow-500'
        }`}
      >
        {auction.auctionType}
      </div>

      <div className="overflow-hidden">
        <img
          className="w-full h-56 object-contain"
          src={auction.mainImage}
          alt={auction.name}
        />
      </div>

      <div className="px-4 space-y-4">
        <h3 className="text-gray-800 text-lg font-semibold line-clamp-2">
          {auction.name}
        </h3>
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold">{formatPrice(auction.startingPrice)}</p>
          <span className="text-sm">1 bids</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 flex items-center gap-2">
            <img
              src={
                auction.seller.avatarUrl
                  ? auction.seller.avatarUrl
                  : DEFAULT_AVATAR
              }
              alt="Seller avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>{auction.seller.name}</span>
          </p>
          {renderDate(auction)}
        </div>
      </div>
    </Link>
  )
}
export default AuctionCard
