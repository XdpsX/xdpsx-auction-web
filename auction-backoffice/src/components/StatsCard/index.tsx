import { Card, Chip, cn } from '@nextui-org/react'
import { Icon } from '@iconify/react'

interface StatsCardProps {
  icon: string
  title: string
  value: string
  change: string
  changeType: 'positive' | 'neutral' | 'negative'
  trendChipVariant?: 'flat' | 'light'
  divIconClassName?: string
  iconClassName?: string
}

function StatsCard({
  icon,
  title,
  value,
  change,
  changeType,
  trendChipVariant = 'light',
  divIconClassName,
  iconClassName
}: StatsCardProps) {
  return (
    <Card className=' border border-transparent dark:border-default-100'>
      <div className='py-4 px-6'>
        <div className='grid grid-cols-2 items-center'>
          <div className={cn('h-12 w-12 rounded-full flex items-center justify-center', divIconClassName)}>
            <Icon icon={icon} className={cn('h-1/2 w-1/2', iconClassName)} />
          </div>
          <dd className='text-2xl font-bold text-default-700 justify-self-end pr-6'>{value}</dd>
          <dt className='text-sm font-semibold text-default-500'>{title}</dt>
          <div className='justify-self-end'>
            <Chip
              classNames={{
                content: 'font-medium'
              }}
              color={changeType === 'positive' ? 'success' : changeType === 'neutral' ? 'warning' : 'danger'}
              size='md'
              startContent={
                changeType === 'positive' ? (
                  <Icon height={20} icon={'solar:arrow-right-up-linear'} width={20} />
                ) : changeType === 'neutral' ? (
                  <Icon height={20} icon={'solar:arrow-right-linear'} width={20} />
                ) : (
                  <Icon height={20} icon={'solar:arrow-right-down-linear'} width={20} />
                )
              }
              variant={trendChipVariant}
            >
              {change}
            </Chip>
          </div>
        </div>
      </div>
    </Card>
  )
}
export default StatsCard
