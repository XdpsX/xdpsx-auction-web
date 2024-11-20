import { formatDateTime } from '../../utils/format'
import { Status } from './Status'

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
    return { daysLeft, hoursLeft }
  }

  const renderContent = (
    daysLeft: number,
    hoursLeft: number,
    timeLabel: string,
    time: string,
    labelClassName: string = ''
  ) => (
    <div className="bg-gray-100 shadow-sm px-2 py-2">
      <p className={labelClassName}>
        {daysLeft > 0 ? `${daysLeft} days left` : `${hoursLeft} hours left`}{' '}
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
    const { daysLeft, hoursLeft } = getTimeLeft(startingTime)
    const content = renderContent(
      daysLeft,
      hoursLeft,
      'until auction starts',
      startingDate,
      'text-slate-600'
    )
    return <Status status="Upcoming" content={content} />
  } else if (endingTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
    const { hoursLeft } = getTimeLeft(endingTime)
    const content = (
      <div className="bg-gray-100 shadow-sm px-2 py-2">
        <p className="font-semibold text-red-500">{hoursLeft} hours left</p>
        <p>Ending time: {formatDateTime(endingDate)}</p>
      </div>
    )
    return <Status status="Ending soon" content={content} />
  } else {
    const { daysLeft, hoursLeft } = getTimeLeft(endingTime)
    const content = renderContent(
      daysLeft,
      hoursLeft,
      'until auction ends',
      endingDate,
      'text-green-500'
    )
    return <Status status="Live" content={content} />
  }
}

export default AuctionDate
