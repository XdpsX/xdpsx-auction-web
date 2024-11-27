import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatPrice, getIdFromSlug } from '../utils/format'
import { useEffect } from 'react'
import { fetchAuctionDetailsAPI } from '../features/auction/service'
import { AuctionDetails } from '../models/auction.type'
import PreviewImages from '../components/ui/PreviewImages'
import Button from '../components/ui/Button'
import AuctionType from '../components/auction/AuctionType'
import AuctionStatus from '../components/auction/AuctionStatus'
import { useAppSelector } from '../store/hooks'
import RichText from '../components/ui/RichText'
import { Client } from '@stomp/stompjs'
import { Bid } from '../models/bid.type'
import { selectUser } from '../features/user/user.slice'
import { toast } from 'react-toastify'
import USER_ICON from '../assets/default-user-icon.png'
import AuctionBid from '../components/auction/AuctionBid'
import socket from '../utils/socket'

function AuctionDetailsPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const id = useMemo(() => +getIdFromSlug(slug as string), [slug])
  const [auction, setAuction] = useState<AuctionDetails | null>(null)
  const [highestBid, setHighestBid] = useState<Bid | null>(null)
  const [showImage, setShowImage] = useState('')
  const [isBidUpdated, setIsBidUpdated] = useState(false)
  const [isAuctionEnded, setIsAuctionEnded] = useState(false)
  const { userProfile } = useAppSelector(selectUser)

  useEffect(() => {
    fetchAuctionDetailsAPI(id)
      .then((data) => {
        setAuction(data)
        setHighestBid(data.highestBid)
      })
      .catch((error) => {
        console.log(error)
        navigate('/not-found')
      })
  }, [id, navigate])

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Connected: ' + frame)
        stompClient.subscribe(`/topic/auction/${id}`, (message) => {
          const bidResponse = JSON.parse(message.body)
          setHighestBid(bidResponse)
          setIsBidUpdated(true)
          if (bidResponse.bidderId !== userProfile?.id) {
            toast.warn('New bid has been placed')
          }
          setTimeout(() => {
            setIsBidUpdated(false)
          }, 1000)
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
  }, [id, userProfile?.id])

  if (!auction) return null
  const previewImages = [auction.mainImage, ...auction.images]

  return (
    <main className="lg:w-[65%] md:w-[80%] w-[90%] h-full mx-auto py-16 space-y-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-12 ">
        <div className="space-y-5">
          <div className="p-5 border">
            <img
              className="w-full h-60 mx-auto object-contain"
              src={showImage ? showImage : previewImages[0]}
              alt="Product image"
            />
          </div>
          {auction.images && (
            <PreviewImages images={previewImages} setShowImage={setShowImage} />
          )}
        </div>

        <div className="">
          <div className="flex flex-col gap-4 pb-6 border-b mb-4">
            <div className="space-y-2">
              <h1 className="text-2xl text-gray-800 font-bold">
                {auction.name}
              </h1>
            </div>
            <div className="grid grid-cols-2 items-center gap-y-6">
              <div className="flex gap-2">
                <span className="font-semibold">Category:</span>
                <span>{auction.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Auction Type:</span>
                <AuctionType type={auction.auctionType} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <AuctionStatus
                  endingDate={auction.endingTime}
                  startingDate={auction.startingTime}
                  onAuctionEnd={() => setIsAuctionEnded(true)}
                />
              </div>
              <div></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Starting Bid:</span>
                <span className="text-blue-500 font-bold">
                  {formatPrice(auction.startingPrice)}
                </span>
              </div>
              {auction.auctionType === 'ENGLISH' && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Step Bid:</span>
                  <span className="text-yellow-500 font-bold">
                    {formatPrice(auction.stepPrice)}
                  </span>
                </div>
              )}
              {auction.auctionType === 'ENGLISH' && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Current Bid:</span>
                  <span
                    className={`font-bold text-xl ${
                      isBidUpdated ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formatPrice(
                      highestBid ? highestBid.amount : auction.startingPrice
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <AuctionBid
            isAuctionEnded={isAuctionEnded}
            auction={auction}
            highestBid={highestBid}
          />
        </div>
      </div>

      <hr />

      <div className="flex items-center gap-5 py-4 ">
        <img
          src={auction.seller.avatarUrl || USER_ICON}
          alt="Seller avatar"
          className="w-16 h-16 object-cover rounded-full"
        />
        <div className="space-y-2">
          <p className="font-semibold">{auction.seller.name}</p>
          <Button className="border text-gray-800 text-sm">
            View Auctions
          </Button>
        </div>
      </div>
      {auction.description && (
        <>
          <hr />
          <RichText description={auction.description} label="Description" />
        </>
      )}
    </main>
  )
}
export default AuctionDetailsPage
