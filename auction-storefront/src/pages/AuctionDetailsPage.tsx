import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatPrice, getIdFromSlug } from '../utils/format'
import { useEffect } from 'react'
import Button from '../components/ui/Button'
import AuctionType from '../components/auction/AuctionType'
import AuctionStatus from '../components/auction/AuctionStatus'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import RichText from '../components/ui/RichText'
import { Client } from '@stomp/stompjs'
import { selectUser } from '../features/user/slice'
import { toast } from 'react-toastify'
import USER_ICON from '../assets/default-user-icon.png'
import AuctionBid from '../components/auction/AuctionBid'
import {
  fetchAuctionDetailsAsync,
  selectAuction,
  setAuctionDetailsEndingTime,
  setHighestBid,
} from '../features/auction/slice'
import AuctionImages from '../components/auction/AuctionImages'
import SockJS from 'sockjs-client'
import socketUrl from '../utils/socket'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import BidHistories from '../components/bid/BidHistories'
import { addBidHistory } from '../features/bid/slice'

function AuctionDetailsPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const id = useMemo(() => +getIdFromSlug(slug as string), [slug])
  const dispatch = useAppDispatch()
  const { auctionDetails, isLoading } = useAppSelector(selectAuction)

  const [isBidUpdated, setIsBidUpdated] = useState(false)
  const [isAuctionEnded, setIsAuctionEnded] = useState(false)
  const { userProfile } = useAppSelector(selectUser)

  useEffect(() => {
    dispatch(fetchAuctionDetailsAsync(id))
      .unwrap()
      .catch(() => {
        navigate('/not-found')
      })
  }, [dispatch, id, navigate])

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: (frame) => {
        console.log('Connected: ' + frame)
        stompClient.subscribe(`/topic/auction/${id}`, (message) => {
          const newHighestBid = JSON.parse(message.body)
          dispatch(setHighestBid(newHighestBid))
          setIsBidUpdated(true)
          if (newHighestBid.bidderId !== userProfile?.id) {
            toast.warn('New bid has been placed')
          }
          dispatch(
            addBidHistory({
              id: newHighestBid.id,
              amount: newHighestBid.amount,
              bidder: {
                id: newHighestBid.bidder.id,
                name: newHighestBid.bidder.name,
              },
              updatedAt: newHighestBid.updatedAt,
            })
          )
          setTimeout(() => {
            setIsBidUpdated(false)
          }, 1500)
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error: ', frame)
      },
    })

    stompClient.activate()
    return () => {
      stompClient.deactivate()
      console.log('Disconnected')
    }
  }, [dispatch, id, userProfile?.id])

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: (frame) => {
        console.log('Connected: ' + frame)
        stompClient.subscribe(`/topic/auction/${id}/end`, (message) => {
          const userId = JSON.parse(message.body)
          dispatch(setAuctionDetailsEndingTime(new Date().toISOString()))
          if (userId !== userProfile?.id) {
            toast.warn('Auction has been bought')
          }
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error: ', frame)
      },
    })

    stompClient.activate()
    return () => {
      stompClient.deactivate()
      console.log('Disconnected')
    }
  }, [dispatch, id, userProfile?.id])

  useEffect(() => {
    return () => {
      setIsAuctionEnded(false)
    }
  })

  if (isLoading) {
    return <LoadingOverlay />
  }

  if (!auctionDetails) return null

  const highestBid = auctionDetails.highestBid

  return (
    <main className="lg:w-[65%] md:w-[95%] w-[90%] h-full mx-auto py-16 space-y-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 lg:gap-12 ">
        <AuctionImages auction={auctionDetails} />
        <div>
          <div className="flex flex-col gap-3 pb-4 border-b mb-5">
            <div className="space-y-2">
              <h1 className="text-2xl text-gray-800 font-bold">
                {auctionDetails.name}
              </h1>
            </div>
            <div className="grid grid-cols-2 items-center gap-y-6">
              <div className="flex gap-2">
                <span className="font-semibold">Category:</span>
                <span>{auctionDetails.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Auction Type:</span>
                <AuctionType type={auctionDetails.type} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <AuctionStatus
                  endingDate={auctionDetails.endingTime}
                  startingDate={auctionDetails.startingTime}
                  onAuctionEnd={() => setIsAuctionEnded(true)}
                />
              </div>
              <div></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {auctionDetails.type === 'ENGLISH'
                    ? 'Starting Bid'
                    : 'Buy Now'}
                  :
                </span>
                <span className="text-blue-500 font-bold">
                  {formatPrice(auctionDetails.startingPrice)}
                </span>
              </div>
              {auctionDetails.type === 'ENGLISH' && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Step Bid:</span>
                  <span className="text-yellow-500 font-bold">
                    {formatPrice(auctionDetails.stepPrice)}
                  </span>
                </div>
              )}
              {auctionDetails.type === 'ENGLISH' && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Current Bid:</span>
                  <span
                    className={`font-bold text-xl ${
                      isBidUpdated ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formatPrice(
                      highestBid
                        ? highestBid.amount
                        : auctionDetails.startingPrice
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <AuctionBid
            isAuctionEnded={isAuctionEnded}
            auction={auctionDetails}
            highestBid={highestBid}
          />
        </div>
      </div>

      {auctionDetails.type === 'ENGLISH' && <BidHistories auctionId={id} />}

      <hr />

      <div className="flex items-center gap-5 py-4 ">
        <img
          src={auctionDetails.seller.avatarUrl || USER_ICON}
          alt="Seller avatar"
          className="w-16 h-16 object-cover rounded-full"
        />
        <div className="space-y-2">
          <p className="font-semibold">{auctionDetails.seller.name}</p>
          <Button className="border text-gray-800 text-sm">
            View Auctions
          </Button>
        </div>
      </div>
      {auctionDetails.description && (
        <>
          <hr />
          <RichText
            description={auctionDetails.description}
            label="Description"
          />
        </>
      )}
    </main>
  )
}
export default AuctionDetailsPage
