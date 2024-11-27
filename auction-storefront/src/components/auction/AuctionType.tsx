import cn from '../../utils/cn'

function AuctionType({
  type,
  className,
}: {
  type: string
  className?: string
}) {
  return (
    <div
      className={cn(
        ' p-2 text-white text-sm font-semibold text-center capitalize tracking-wider',
        {
          'bg-green-200/90 text-green-600': type === 'ENGLISH',
          'bg-yellow-200/90 text-yellow-600': type !== 'ENGLISH',
        },
        className
      )}
    >
      {type.toLowerCase()}
    </div>
  )
}

export default AuctionType
