import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, generateSlug } from '../../utils/format'
import { Auction } from '../../models/auction.type'
import DEFAULT_AVATAR from '../../assets/default-user-icon.png'
import AuctionType from './AuctionType'
import AuctionStatus from './AuctionStatus'

function AuctionCard({ auction }: { auction: Auction }) {
  const auctionSlug = useMemo(
    () =>
      generateSlug({
        name: auction.name,
        id: auction.id,
      }),
    [auction.name, auction.id]
  )

  return (
    <Link
      to={`/auctions/${auctionSlug}`}
      key={auction.id}
      className="relative border space-y-4 pb-4 group transition-all duration-500 shadow-sm hover:shadow-md hover:-translate-y-2"
    >
      <AuctionType type={auction.type} className="absolute left-2 top-2" />

      <div className="overflow-hidden">
        <img
          className="w-full h-56 object-contain"
          src={auction.mainImage}
          alt={auction.name}
        />
      </div>

      <div className="px-4 space-y-4">
        <div className="h-16">
          <h3 className="text-gray-800 text-lg font-semibold line-clamp-2">
            {auction.name}
          </h3>
        </div>
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
          <AuctionStatus
            endingDate={auction.endingTime}
            startingDate={auction.startingTime}
          />
        </div>
      </div>
    </Link>
  )
}
export default AuctionCard
