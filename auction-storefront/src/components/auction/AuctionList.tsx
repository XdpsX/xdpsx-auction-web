import AuctionCard from './AuctionCard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuctionList({ auctions }: { auctions: any[] }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5  gap-6 md:gap-8">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  )
}
export default AuctionList
