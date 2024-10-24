import { Link } from 'react-router-dom'
import { formatDate, formatPrice } from '../../utils/format'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuctionCard({ auction }: { auction: any }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const redenrDate = (auction: any) => {
    const currentTime = new Date()
    const endingTime = new Date(auction.endingTime)

    const timeDifference = endingTime.getTime() - currentTime.getTime()
    const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60))

    if (timeDifference < 24 * 60 * 60 * 1000) {
      return <p className="font-bold text-red-600">{-hoursLeft} hours left</p>
    } else {
      return `${formatDate(auction.startingTime)} - ${formatDate(
        auction.endingTime
      )}`
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
        <div>{redenrDate(auction)}</div>
      </div>
    </Link>
  )
}
export default AuctionCard
