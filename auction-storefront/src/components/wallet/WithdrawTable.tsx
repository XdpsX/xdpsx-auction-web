import PulseLoader from 'react-spinners/PulseLoader'
import useQueryParams from '../../hooks/useQueryParams'
import { Page } from '../../models/page.type'
import { Withdraw } from '../../models/wallet.type'
import Select from '../ui/Select'
import { pageNumOptions } from '../../utils/data'
import Pagination from '../ui/Pagination'
import cn from '../../utils/cn'
import { formatPrice } from '../../utils/format'
import ConfirmModal from '../ui/ConfirmModal'
import { useState } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { cancelWithdrawAsync } from '../../features/wallet/slice'
import { toast } from 'react-toastify'
import Button from '../ui/Button'
import { MdOutlineCancel } from 'react-icons/md'
import { FaRegEye } from 'react-icons/fa'
import Modal from '../ui/Modal'

function WithdrawTable({
  withdrawPage,
  isLoading,
}: {
  withdrawPage: Page<Withdraw> | null
  isLoading: boolean
}) {
  const dispatch = useAppDispatch()
  const { setParams } = useQueryParams()
  const [openModal, setOpenModal] = useState(false)
  const [reasonModal, setReasonModal] = useState(false)
  const [reason, setReason] = useState<string | null>()
  const [withdrawId, setWithdrawId] = useState<number | null>(null)

  const onPageChange = (pageNum: number) => {
    setParams({ pageNum: pageNum })
  }

  const onPageSizeChange = (pageSize: string) => {
    console.log(pageSize)
    setParams({ pageSize: pageSize, pageNum: '1', sort: null })
  }

  const handleOpenReasonModal = (reason: string | null) => {
    setReason(reason)
    setReasonModal(true)
  }

  const handleOpenModal = (withdrawId: number) => {
    setWithdrawId(withdrawId)
    setOpenModal(true)
  }

  const handleSubmit = () => {
    if (withdrawId) {
      dispatch(cancelWithdrawAsync(withdrawId))
        .unwrap()
        .then(() => {
          setOpenModal(false)
          toast.success('Withdraw request has been canceled')
        })
        .catch()
    }
  }

  if (!withdrawPage) return null

  const { items, pageNum, pageSize, totalPages } = withdrawPage

  if (items.length === 0) {
    return (
      <p className="text-center py-12 font-bold text-xl">
        No withdraw requests found
      </p>
    )
  }

  return (
    <>
      <div className="flow-root space-y-6">
        <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:pl-8 relative">
            <table
              className={cn('min-w-full divide-y divide-gray-300', {
                'opacity-50': isLoading,
              })}
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-1 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Bank
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Holder
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="pl-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className=" whitespace-nowrap py-4 pl-4  font-medium text-gray-900 sm:pl-0">
                      {item.id}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {formatPrice(item.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                      <div>
                        <p className="text-gray-800">{item.accountNumber}</p>
                        <p className="italic text-gray-600 text-sm">
                          {item.bankName}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-wrap px-3 py-4 text-sm">
                      {item.holderName}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {item.status}
                    </td>
                    {item.status === 'PENDING' && (
                      <td className="whitespace-nowrap text-left py-4 pl-3  text-sm font-medium">
                        <Button
                          title="Cancel"
                          className="bg-red-600 hover:bg-red-700 py-1"
                          onClick={handleOpenModal.bind(null, item.id)}
                        >
                          <MdOutlineCancel size={20} />
                        </Button>
                      </td>
                    )}
                    {item.status === 'REJECTED' && (
                      <td className="whitespace-nowrap text-left py-4 pl-3  text-sm font-medium">
                        <Button
                          title="Rejection Reason"
                          className="bg-yellow-600 hover:bg-yellow-700 py-1"
                          onClick={handleOpenReasonModal.bind(
                            null,
                            item.reason
                          )}
                        >
                          <FaRegEye size={20} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PulseLoader color="#3b82f6" />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <Select
            label="Rows:"
            className="rounded-none border-b "
            selectKey={pageSize.toString()}
            options={pageNumOptions}
            onChange={onPageSizeChange}
          />
          {totalPages > 1 && (
            <Pagination
              pageNum={pageNum}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        content={`Do you want to cancel this withdraw request?`}
      />
      <Modal open={reasonModal} onClose={() => setReasonModal(false)}>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Rejection Reason</h3>
          <p className="text-gray-800">{reason}</p>
        </div>
      </Modal>
    </>
  )
}
export default WithdrawTable
