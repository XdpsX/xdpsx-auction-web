import { useState, useEffect, useCallback } from 'react'
import { formatDateTime } from '../../utils/format'
import { Status } from '../ui/Status'
import { StatusOptions } from '../../utils/data'

function AuctionStatus({
  endingDate,
  startingDate,
  onAuctionEnd,
}: {
  endingDate: string
  startingDate: string
  onAuctionEnd?: () => void
}) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const [auctionStatus, setAuctionStatus] = useState<StatusOptions>('Upcoming')

  const calculateTimeLeft = useCallback(() => {
    const currentTime = new Date().getTime()
    const startTime = new Date(startingDate).getTime()
    const endTime = new Date(endingDate).getTime()

    if (currentTime < startTime) {
      // Time until auction starts
      const difference = startTime - currentTime
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
      setAuctionStatus('Upcoming')
      return true
    }

    if (currentTime >= startTime && currentTime < endTime) {
      // Time until auction ends
      const difference = endTime - currentTime
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
      setAuctionStatus(difference <= 86400000 ? 'Ending soon' : 'Live') // 24 hours = 86400000 ms
      return true
    }

    // Auction ended
    setTimeLeft(null)
    setAuctionStatus('Ended')
    return false
  }, [endingDate, startingDate])

  useEffect(() => {
    const updateTimeLeft = () => {
      const isAuctionLive = calculateTimeLeft()
      if (!isAuctionLive) {
        onAuctionEnd?.()
      }
    }

    updateTimeLeft()
    const intervalId = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(intervalId)
  }, [calculateTimeLeft, onAuctionEnd])

  const renderAuctionStatus = useCallback(() => {
    if (!timeLeft) return <Status status="Ended" />
    switch (auctionStatus) {
      case 'Upcoming':
        return (
          <Status
            status="Upcoming"
            content={
              <div className="bg-gray-100 shadow-sm px-2 py-2">
                <p className="text-slate-500">
                  Start in {timeLeft?.days > 0 && `${timeLeft?.days}d `}
                  {timeLeft?.hours > 0 && `${timeLeft?.hours}h `}
                  {timeLeft?.minutes > 0 && `${timeLeft?.minutes}m `}
                  {timeLeft?.seconds}s
                </p>
                <p>Starting time: {formatDateTime(startingDate)}</p>
              </div>
            }
          />
        )
      case 'Ending soon':
        return (
          <Status
            status="Ending soon"
            content={
              <div className="bg-gray-100 shadow-sm px-2 py-2">
                <p className="text-yellow-500 font-bold">
                  {timeLeft?.hours > 0 && `${timeLeft?.hours}h `}
                  {timeLeft?.minutes > 0 && `${timeLeft?.minutes}m `}
                  {timeLeft?.seconds}s left
                </p>
                <p>Ending time: {formatDateTime(endingDate)}</p>
              </div>
            }
          />
        )
      case 'Live':
        return (
          <Status
            status="Live"
            content={
              <div className="bg-gray-100 shadow-sm px-2 py-2">
                <p className="text-green-500">
                  {timeLeft?.days > 0 && `${timeLeft?.days}d `}
                  {timeLeft?.hours > 0 && `${timeLeft?.hours}h `}
                  {timeLeft?.minutes > 0 && `${timeLeft?.minutes}m `}
                  {timeLeft?.seconds}s left
                </p>
                <p>Ending time: {formatDateTime(endingDate)}</p>
              </div>
            }
          />
        )
      case 'Ended':
        return <Status status="Ended" />
      default:
        return <Status status="Ended" />
    }
  }, [timeLeft, auctionStatus, startingDate, endingDate])

  return renderAuctionStatus()
}

export default AuctionStatus
