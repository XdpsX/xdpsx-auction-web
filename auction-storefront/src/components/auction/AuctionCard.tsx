import { Link } from 'react-router-dom'
import { formatDate, formatPrice } from '../../utils/format'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuctionCard({ auction }: { auction: any }) {
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
        <div className="space-y-2 font-semibold">
          <h3 className="text-gray-800 text-lg line-clamp-2">{auction.name}</h3>
          <p className="text-gray-600">by {auction.owner}</p>
        </div>
        <div className="flex justify-between gap-4">
          <span className="font-semibold">
            {formatPrice(auction.startingPrice)}
            {auction.stepPrice && ` / ${formatPrice(auction.stepPrice)}`}
          </span>
          <span className="">{auction.bids} bids</span>
        </div>
        <div>
          {formatDate(auction.startingTime)} - {formatDate(auction.endingTime)}
        </div>
      </div>
    </Link>
  )
}
export default AuctionCard
