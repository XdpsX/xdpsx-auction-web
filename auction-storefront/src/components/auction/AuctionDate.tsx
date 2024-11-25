import { formatDateTime } from '../../utils/format'
import { Status } from '../ui/Status'

function AuctionDate({
  endingDate,
  startingDate,
}: {
  endingDate: string
  startingDate: string
}) {
  const now = new Date()
  const endingTime = new Date(endingDate)
  const startingTime = new Date(startingDate)

  const getTimeLeft = (targetTime: Date) => {
    const timeDifference = targetTime.getTime() - now.getTime()
    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    const hoursLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutesLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    )
    return { daysLeft, hoursLeft, minutesLeft }
  }

  const renderContent = (
    daysLeft: number,
    hoursLeft: number,
    minutesLeft: number,
    timeLabel: string,
    time: string,
    labelClassName: string = ''
  ) => (
    <div className="bg-gray-100 shadow-sm px-2 py-2">
      <p className={labelClassName}>
        {daysLeft > 0
          ? `${daysLeft} days left`
          : hoursLeft > 0
          ? `${hoursLeft} hours left`
          : `${minutesLeft > 0 ? minutesLeft : 1} minutes left`}{' '}
        {timeLabel}
      </p>
      <p>
        {timeLabel === 'until auction starts'
          ? `Starting time: ${formatDateTime(time)}`
          : `Ending time: ${formatDateTime(time)}`}
      </p>
    </div>
  )

  if (now < startingTime) {
    const { daysLeft, hoursLeft, minutesLeft } = getTimeLeft(startingTime)
    const content = renderContent(
      daysLeft,
      hoursLeft,
      minutesLeft,
      'until auction starts',
      startingDate,
      'text-slate-600'
    )
    return <Status status="Upcoming" content={content} />
  } else if (endingTime.getTime() - now.getTime() < 60 * 60 * 1000) {
    const { minutesLeft } = getTimeLeft(endingTime)
    const content = (
      <div className="bg-gray-100 shadow-sm px-2 py-2">
        <p className="font-semibold text-red-500">
          {minutesLeft > 0 ? minutesLeft : 1} minutes left
        </p>
        <p>Ending time: {formatDateTime(endingDate)}</p>
      </div>
    )
    return <Status status="Ending soon" content={content} />
  } else {
    const { daysLeft, hoursLeft, minutesLeft } = getTimeLeft(endingTime)
    const content = renderContent(
      daysLeft,
      hoursLeft,
      minutesLeft,
      'until auction ends',
      endingDate,
      'text-green-500'
    )
    return <Status status="Live" content={content} />
  }
}

export default AuctionDate
