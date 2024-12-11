import { Spinner } from '@nextui-org/react'
import { useEffect } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { fetchAuctionTypeCountAsync } from '~/app/features/report'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'

const COLORS = ['#FFBB28', '#FF8042']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function AuctionTypeChart() {
  const dispatch = useAppDispatch()
  const { auctionTypeCount, isLoadingAuctionTypeCount } = useAppSelector((state) => state.report)

  useEffect(() => {
    dispatch(fetchAuctionTypeCountAsync())
  }, [dispatch])

  if (isLoadingAuctionTypeCount) return <Spinner size='lg' />
  if (!auctionTypeCount) return null

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart margin={{ top: -24 }}>
        <Pie
          data={auctionTypeCount}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill='#8884d8'
          dataKey='count'
          nameKey='type'
        >
          {auctionTypeCount.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
export default AuctionTypeChart
