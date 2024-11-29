import {
  Button,
  Chip,
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
  useDisclosure,
  User
} from '@nextui-org/react'
import { Key, useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { Page } from '~/app/features/page/type'
import { updateSellerStatusAsync } from '~/app/features/seller'
import { SellerProfile } from '~/app/features/seller/type'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import { CopyText } from '~/components/CopyText'
import { sellerColumns } from '~/utils/columns'
import { formatDateTime } from '~/utils/format'
import { capitalize } from '~/utils/helper'

function SellerTable({ sellerPage, isLoading }: { sellerPage: Page<SellerProfile>; isLoading: boolean }) {
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [status, setStatus] = useState('')
  const [sellerId, setSellerId] = useState<number | null>(null)

  const handleOpen = (state: string, sellerId: number) => {
    setStatus(state)
    setSellerId(sellerId)
    onOpen()
  }

  const handleUpdateStatus = () => {
    if (!sellerId) return
    dispatch(updateSellerStatusAsync({ sellerId, status }))
      .unwrap()
      .then(() => {
        toast.success(`Seller status has been updated to ${status}`)
      })
  }

  const renderCell = useCallback((seller: SellerProfile, columnKey: Key) => {
    switch (columnKey) {
      case 'id':
        return <CopyText>{`${seller.id}`}</CopyText>
      case 'user':
        return (
          <User
            avatarProps={{
              radius: 'lg',
              src: seller.user.avatarUrl ? seller.user.avatarUrl : 'https://i.pravatar.cc/150?u=a04258114e29026702d'
            }}
            name={seller.user.name}
            description={seller.user.email}
          >
            {seller.name}
          </User>
        )
      case 'shop':
        return (
          <User avatarProps={{ radius: 'lg', src: seller.avatarUrl }} name={seller.name}>
            {seller.name}
          </User>
        )
      case 'address':
        return <p className='text-sm'>{seller.address}</p>
      case 'mobilePhone':
        return <p className='text-sm'>{seller.mobilePhone}</p>
      case 'registeredAt': {
        return <p className='text-sm'>{formatDateTime(seller.createdAt)}</p>
      }
      case 'status':
        if (seller.status === 'APPROVED') {
          return (
            <Chip size='sm' className='bg-green-100 text-green-600'>
              {capitalize(seller.status)}
            </Chip>
          )
        }
        if (seller.status === 'PENDING') {
          return (
            <Chip size='sm' className='bg-gray-100 text-gray-600'>
              {capitalize(seller.status)}
            </Chip>
          )
        }
        return (
          <Chip size='sm' className='bg-red-100 text-red-600'>
            {capitalize(seller.status)}
          </Chip>
        )
      case 'actions':
        if (seller.status === 'PENDING') {
          return (
            <div className='flex items-center justify-center gap-2'>
              <Button color='success' size='sm' onClick={handleOpen.bind(null, 'APPROVED', seller.id)}>
                Approved
              </Button>
              <Button color='danger' size='sm' onClick={handleOpen.bind(null, 'REJECTED', seller.id)}>
                Reject
              </Button>
            </div>
          )
        }
        return null
      default:
        return null
    }
  }, [])

  return (
    <>
      <Table aria-label='Sellers Table'>
        <TableHeader columns={sellerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' || column.uid === 'status' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={sellerPage.items}
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
                  Do you want to update seller status to <strong>{status}</strong>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    handleUpdateStatus()
                    onClose()
                  }}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
export default SellerTable
