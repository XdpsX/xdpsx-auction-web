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
          'bg-blue-200/90 text-blue-600': type === 'English',
          'bg-yellow-200/90 text-yellow-600': type !== 'English',
        },
        className
      )}
    >
      {type.toLowerCase()}
    </div>
  )
}

export default AuctionType
