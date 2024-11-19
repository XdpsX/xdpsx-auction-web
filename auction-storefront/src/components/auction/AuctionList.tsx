import { Auction } from '../../models/auction.type'
import AuctionCard from './AuctionCard'

function AuctionList({ auctions }: { auctions: Auction[] }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5  gap-6 md:gap-8">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  )
}
export default AuctionList
