import { Spinner } from '@nextui-org/react'
import { useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchRevenueAsync } from '~/app/features/report'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { formatNumber } from '~/utils/format'
import { capitalize } from '~/utils/helper'

function RevenueChart() {
  const dispatch = useAppDispatch()
  const { revenues, isLoadingRevenue } = useAppSelector((state) => state.report)

  useEffect(() => {
    dispatch(fetchRevenueAsync())
  }, [dispatch])

  if (isLoadingRevenue) return <Spinner size='lg' />
  if (!revenues) return null

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart data={revenues} margin={{ left: 16, top: 24 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' reversed />
        <YAxis tickFormatter={(value) => formatNumber(value)} />
        <Tooltip formatter={(value, name) => [formatNumber(value as number), capitalize(name as string)]} />
        <Legend />
        <Bar dataKey='revenue' fill='#3b82f6' />
      </BarChart>
    </ResponsiveContainer>
  )
}
export default RevenueChart
