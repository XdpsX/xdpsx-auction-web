import { Link } from 'react-router-dom'
import { selectUser } from '../../features/user/slice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { AuctionDetails } from '../../models/auction.type'
import { Bid } from '../../models/bid.type'
import BidForm from '../bid/BidForm'
import { getUserBidAsync, selectBid } from '../../features/bid/slice'
import { useEffect } from 'react'

interface AuctionBidProps {
  isAuctionEnded: boolean
  auction: AuctionDetails
  highestBid: Bid | null
}

function AuctionBid({ isAuctionEnded, auction, highestBid }: AuctionBidProps) {
  const dispatch = useAppDispatch()
  const { userBid } = useAppSelector(selectBid)
  const { userProfile } = useAppSelector(selectUser)
  const isAuthenticated = !!userProfile

  useEffect(() => {
    if (!userProfile) return
    dispatch(getUserBidAsync(auction.id))
  }, [auction.id, dispatch, userProfile])

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

  if (
    userProfile &&
    userProfile.sellerDetails &&
    userProfile.sellerDetails.id === auction.seller.id
  ) {
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

  if (auction.type === 'SEALED_BID' && userBid && userBid.status === 'LOST') {
    return (
      <p className="text-lg font-semibold text-red-500">You lost the auction</p>
    )
  }

  return <BidForm auction={auction} highestBid={highestBid} userBid={userBid} />
}
export default AuctionBid
