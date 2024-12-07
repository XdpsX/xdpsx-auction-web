import PulseLoader from 'react-spinners/PulseLoader'
import { Order, OrderStatus } from '../../models/order.type'
import { Page } from '../../models/page.type'
import cn from '../../utils/cn'
import { formatDateTime, formatPrice } from '../../utils/format'
import Pagination from '../ui/Pagination'
import Select from '../ui/Select'
import useQueryParams from '../../hooks/useQueryParams'
import { pageNumOptions } from '../../utils/data'
import Button from '../ui/Button'
import { useAppDispatch } from '../../store/hooks'
import { cancelOrderAsync, confirmOrderAsync } from '../../features/order/slice'
import ConfirmModal from '../ui/ConfirmModal'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { continueOrderPaymentAPI } from '../../features/order/service'
import { MdOutlineCancel, MdOutlinePayment } from 'react-icons/md'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { FaRegEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function OrderTable({
  orderPage,
  isLoading,
  status,
}: {
  orderPage: Page<Order> | null
  isLoading: boolean
  status: OrderStatus
}) {
  const dispatch = useAppDispatch()
  const { setParams } = useQueryParams()
  const [openModal, setOpenModal] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [action, setAction] = useState<string | null>(null)

  const onPageChange = (pageNum: number) => {
    setParams({ pageNum: pageNum })
  }

  const onPageSizeChange = (pageSize: string) => {
    console.log(pageSize)
    setParams({ pageSize: pageSize, pageNum: '1', sort: null })
  }

  const handleOpenModal = (action: string, orderId: number) => {
    setOrderId(orderId)
    setAction(action)
    setOpenModal(true)
  }

  const handleSubmit = async () => {
    if (action === 'cancel' && orderId) {
      dispatch(cancelOrderAsync(orderId))
        .unwrap()
        .then(() => {
          toast.success('Order has been canceled')
        })
    } else if (action === 'confirm' && orderId) {
      dispatch(confirmOrderAsync(orderId))
        .unwrap()
        .then(() => {
          toast.success('Order has been confirmed')
        })
    } else if (action === 'continue' && orderId) {
      const paymentUrl = await continueOrderPaymentAPI(orderId)
      window.location.replace(paymentUrl)
    }
    setOpenModal(false)
  }

  if (!orderPage) return null

  const { items, pageNum, pageSize, totalPages } = orderPage

  if (items.length === 0) {
    return (
      <p className="text-center py-12 font-bold text-xl">No orders found</p>
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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-1 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Auction
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {status === 'Creating' ? 'Amount to pay' : 'Total Amount'}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Shipping Address
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Updated At
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.id}
                    </td>
                    <td className=" whitespace-nowrap py-4 pl-4  font-medium text-gray-900 sm:pl-0">
                      <div className="flex flex-col gap-2">
                        <div className="w-12 h-12">
                          <img
                            src={item.auction.mainImage}
                            alt="Auction image"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="max-w-[220px]">
                          <p className="truncate">{item.auction.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {status === 'Creating'
                        ? formatPrice(item.totalAmount * 0.9)
                        : formatPrice(item.totalAmount)}
                    </td>
                    <td className="whitespace-wrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.shippingInfo.recipient}
                        </p>
                        <p>{item.shippingInfo.shippingAddress}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDateTime(item.updatedAt)}
                    </td>

                    <td className="whitespace-nowrap text-left py-4 pl-3  text-sm font-medium flex items-center gap-2">
                      <Link
                        to={`/user/orders/${item.id}`}
                        title="View"
                        className="bg-yellow-600 hover:bg-yellow-700 py-1 px-3 text-white rounded-md"
                      >
                        <FaRegEye size={20} />
                      </Link>
                      {status === 'Creating' && (
                        <Button
                          title="Continue Payment"
                          className="bg-blue-600 hover:bg-blue-700 py-1"
                          onClick={handleOpenModal.bind(
                            null,
                            'continue',
                            item.id
                          )}
                        >
                          <MdOutlinePayment size={24} />
                        </Button>
                      )}
                      {(status === 'Pending' || status === 'Confirmed') && (
                        <Button
                          title="Cancel"
                          className="bg-red-600 hover:bg-red-700 py-1"
                          onClick={handleOpenModal.bind(
                            null,
                            'cancel',
                            item.id
                          )}
                        >
                          <MdOutlineCancel size={20} />
                        </Button>
                      )}
                      {status === 'Delivered' && (
                        <Button
                          title="Confirm"
                          className="bg-blue-600 hover:bg-blue-700 py-1"
                          onClick={handleOpenModal.bind(
                            null,
                            'confirm',
                            item.id
                          )}
                        >
                          <IoCheckmarkOutline size={20} />
                        </Button>
                      )}
                    </td>
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
        content={`Do you want to ${action} this order?`}
      />
    </>
  )
}
export default OrderTable
