import { Auction } from '../../models/auction.type'
import cn from '../../utils/cn'
import AuctionCard from './AuctionCard'

function AuctionList({
  auctions,
  className,
}: {
  auctions: Auction[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5  gap-6 md:gap-8',
        className
      )}
    >
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  )
}
export default AuctionList
