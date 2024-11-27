import { Link } from 'react-router-dom'
import { selectUser } from '../../features/user/user.slice'
import { useAppSelector } from '../../store/hooks'
import { AuctionDetails } from '../../models/auction.type'
import { Bid } from '../../models/bid.type'
import BidForm from '../bid/BidForm'

interface AuctionBidProps {
  isAuctionEnded: boolean
  auction: AuctionDetails
  highestBid: Bid | null
}

function AuctionBid({ isAuctionEnded, auction, highestBid }: AuctionBidProps) {
  const { userProfile } = useAppSelector(selectUser)
  const isAuthenticated = !!userProfile

  if (isAuctionEnded) {
    return (
      <p className="text-red-500 font-bold">
        Auction has ended. Bidding is closed.
      </p>
    )
  }

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="px-4 py-2 bg-red-500 text-white text-lg rounded-md hover:bg-red-600"
      >
        Login to bid
      </Link>
    )
  }

  if (userProfile && userProfile.id === auction.seller.id) {
    return (
      <p className="text-lg font-bold">You can't bid on your own auction</p>
    )
  }

  if (userProfile && userProfile.id === highestBid?.bidderId) {
    return (
      <p className="text-lg font-semibold text-green-500">
        You are the highest bidder
      </p>
    )
  }

  return <BidForm auction={auction} highestBid={highestBid} />
}
export default AuctionBid
