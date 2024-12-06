import { Icon } from '@iconify/react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
  User
} from '@nextui-org/react'
import { Key, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateOrderStatusAsync } from '~/app/features/order'
import { Order, OrderStatus } from '~/app/features/order/type'
import { Page } from '~/app/features/page/type'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import { CopyText } from '~/components/CopyText'
import { orderColumns } from '~/utils/columns'
import { getNextStatus, orderActions } from '~/utils/data'
import { formatDateTime, formatPrice } from '~/utils/format'

function OrderTable({
  orderPage,
  isLoading,
  status
}: {
  orderPage: Page<Order>
  isLoading: boolean
  status: OrderStatus
}) {
  const actions = orderActions[status]
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const dispatch = useAppDispatch()
  const [action, setAction] = useState('')
  const [orderId, setOrderId] = useState<number | null>(null)

  const handleOpen = useCallback(
    (action: string, orderId: number) => {
      setAction(action)
      setOrderId(orderId)
      onOpen()
    },
    [onOpen]
  )

  const onSubmit = () => {
    if (action === 'Update' && orderId) {
      dispatch(updateOrderStatusAsync(orderId))
        .unwrap()
        .then(() => {
          toast.success('Update order status successfully')
        })
    }
  }

  const renderCell = useCallback(
    (order: Order, columnKey: Key) => {
      switch (columnKey) {
        case 'trackNumber':
          return <CopyText>{`${order.trackNumber}`}</CopyText>
        case 'auction':
          return (
            <User
              className='flex flex-col items-start'
              avatarProps={{
                radius: 'lg',
                src: order.auction.mainImage
                  ? order.auction.mainImage
                  : 'https://i.pravatar.cc/150?u=a04258114e29026702d'
              }}
              name={order.auction.name}
            >
              {order.auction.name}
            </User>
          )
        case 'totalAmount':
          return <p className='text-sm'>{formatPrice(order.totalAmount)}</p>
        case 'shippingAddress':
          return (
            <div className='text-sm'>
              <p className='font-semibold'>{order.shippingInfo.recipient}</p>
              <p>{order.shippingInfo.shippingAddress}</p>
            </div>
          )
        case 'updatedAt':
          return <p className='text-sm'>{formatDateTime(order.updatedAt)}</p>

        case 'actions':
          return (
            <div className='relative flex items-center justify-center gap-3'>
              {actions.includes('View') && (
                <Tooltip content='Details'>
                  <Link to='#' className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                    <Icon icon='solar:eye-outline' width={20} />
                  </Link>
                </Tooltip>
              )}
              {actions.includes('Update') && (
                <Tooltip content='Update Status'>
                  <Button
                    onClick={() => handleOpen('Update', order.id)}
                    variant='light'
                    isIconOnly
                    className='text-lg text-primary-400 cursor-pointer active:opacity-50'
                  >
                    <Icon icon='carbon:next-outline' width={20} />
                  </Button>
                </Tooltip>
              )}
              {actions.includes('Cancel') && (
                <Tooltip color='danger' content='Cancel'>
                  <Button
                    onClick={() => handleOpen('Cancel', order.id)}
                    variant='light'
                    isIconOnly
                    className='text-lg text-danger cursor-pointer active:opacity-50'
                  >
                    <Icon icon='mdi:cancel' width={20} />
                  </Button>
                </Tooltip>
              )}
            </div>
          )
        default:
          return null
      }
    },
    [actions, handleOpen]
  )

  return (
    <>
      <Table aria-label='Orders Table'>
        <TableHeader columns={orderColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={orderPage.items}
          emptyContent={<p>No item found</p>}
          isLoading={isLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Confirm action</ModalHeader>
              <ModalBody>
                <p>
                  {action === 'Update' && `Do you want to update order status to ${getNextStatus(status)} ?`}
                  {action === 'Cancel' && `Do you want to cancel this order?`}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    onSubmit()
                    onClose()
                  }}
                >
                  {action}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
export default OrderTable
