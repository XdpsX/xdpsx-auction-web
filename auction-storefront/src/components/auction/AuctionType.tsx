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
        ' p-2 text-white text-sm font-semibold text-center',
        {
          'bg-blue-500': type === 'English',
          'bg-yellow-500': type !== 'English',
        },
        className
      )}
    >
      {type}
    </div>
  )
}

export default AuctionType
