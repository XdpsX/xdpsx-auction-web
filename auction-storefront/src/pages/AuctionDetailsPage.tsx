import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatPrice, getIdFromSlug } from '../utils/format'
import { useEffect } from 'react'
import { fetchAuctionDetailsAPI } from '../features/auction/auction.service'
import { AuctionDetails } from '../models/auction.type'
import PreviewImages from '../components/ui/PreviewImages'
import Button from '../components/ui/Button'
import AuctionType from '../components/ui/AuctionType'
import AuctionDate from '../components/ui/AuctionDate'
import { useAppSelector } from '../store/hooks'
import { selectAuth } from '../features/auth/auth.slice'
import RichText from '../components/ui/RichText'
import BidForm from '../components/ui/BidForm'
import SockJS from 'sockjs-client'
import { Stomp, type Frame } from '@stomp/stompjs'
import { Bid } from '../models/bid.type'
// import { Client } from '@stomp/stompjs'

function AuctionDetailsPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const id = useMemo(() => +getIdFromSlug(slug as string), [slug])
  const [auction, setAuction] = useState<AuctionDetails | null>(null)
  const [highestBid, setHighestBid] = useState<Bid | null>(null)
  const [showImage, setShowImage] = useState('')
  const { accessToken } = useAppSelector(selectAuth)
  const isAuthenticated = !!accessToken

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
    // const client = new Client({
    //   brokerURL: 'http://localhost:8080/ws',
    //   onConnect: () => {
    //     client.subscribe('/topic/auction/${id}', (message) =>
    //       console.log(`Received: ${message.body}`)
    //     )
    //   },
    // })
    // client.activate()
    // return () => {
    //   client.deactivate()
    // }

    const socket = new SockJS('http://localhost:8080/ws') // Địa chỉ WebSocket
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, (frame: Frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe(`/topic/auction/${id}`, (message) => {
        const bidResponse: Bid = JSON.parse(message.body)
        console.log('New bid received:', bidResponse)
        setHighestBid(bidResponse)
        // Cập nhật state với bid mới
        // setBids((prevBids) => [...prevBids, bidResponse])
      })
    })
    // Cleanup function to disconnect the WebSocket when the component unmounts
    return () => {
      stompClient.disconnect(() => {
        console.log('Disconnected')
      })
    }
  }, [id])

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
                <AuctionDate
                  endingDate={auction.endingTime}
                  startingDate={auction.startingTime}
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
                  <span className="text-red-500 font-bold">
                    {formatPrice(
                      highestBid ? highestBid.amount : auction.startingPrice
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-red-500 text-white text-lg rounded-md hover:bg-red-600"
            >
              Login to bid
            </Link>
          ) : (
            <BidForm auction={auction} highestBid={highestBid} />
          )}
        </div>
      </div>

      <hr />

      <div className="flex items-center gap-5 py-4 ">
        <img
          src={auction.seller.avatarUrl || '/images/default-avatar.png'}
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
