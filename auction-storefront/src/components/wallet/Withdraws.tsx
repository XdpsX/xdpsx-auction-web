import { useEffect } from 'react'
import {
  fetchMyWithdrawalsAsync,
  selectWallet,
} from '../../features/wallet/slice'
import useQueryParams from '../../hooks/useQueryParams'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { withdrawSortOptions, withdrawStatusOptions } from '../../utils/data'
import { WithdrawStatusParam } from '../../models/wallet.type'
import Select from '../ui/Select'
import WithdrawTable from './WithdrawTable'

function Withdraws() {
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, sort, withdrawStatus: status },
    setParams,
  } = useQueryParams()
  const { userWithdrawals, isFetchingWithdrawals: isLoading } =
    useAppSelector(selectWallet)
  const filteredSort =
    withdrawSortOptions.find((option) => option.key === sort) ||
    withdrawSortOptions[0]
  const filteredStatus =
    withdrawStatusOptions.find((option) => option.key === status) ||
    withdrawStatusOptions[0]

  useEffect(() => {
    dispatch(
      fetchMyWithdrawalsAsync({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        sort: sort,
        status:
          status === 'all' ? null : (Number(status) as WithdrawStatusParam),
      })
    )
  }, [dispatch, pageNum, pageSize, sort, status])

  const onStatusChange = (key: string) => {
    setParams({ status: key })
  }
  const onSortChange = (key: string) => {
    setParams({ sort: key })
  }
  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="bg-gray-200 text-gray-800 rounded-lg px-2 py-1 font-semibold">
            {userWithdrawals?.totalItems || 0} items
          </span>
          <Select
            className="border"
            selectKey={filteredStatus.key}
            options={withdrawStatusOptions}
            onChange={onStatusChange}
          />
        </div>
        <Select
          className="border"
          selectKey={filteredSort.key}
          options={withdrawSortOptions}
          onChange={onSortChange}
        />
      </div>
      <WithdrawTable withdrawPage={userWithdrawals} isLoading={isLoading} />
    </div>
  )
}
export default Withdraws
