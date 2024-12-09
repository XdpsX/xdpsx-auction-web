import { Icon } from '@iconify/react'
import {
  Button,
  Input,
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
  useDisclosure
} from '@nextui-org/react'
import { Key, useCallback, useState } from 'react'
import { Page } from '~/app/features/page/type'
import { cancelWithdrawAsync, updateWithdrawStatusAsync } from '~/app/features/withdrawal/slice'
import { UpdateWithdrawStatusPayload, Withdraw, WithdrawStatus } from '~/app/features/withdrawal/type'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { CopyText } from '~/components/CopyText'
import { withdrawlsColumns } from '~/utils/columns'
import { formatDateTime, formatPrice } from '~/utils/format'

function WithdrawalTable({ withdrawalPage, isLoading }: { withdrawalPage: Page<Withdraw>; isLoading: boolean }) {
  const dispatch = useAppDispatch()
  const { userRole } = useAppSelector((state) => state.user)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [reason, setReason] = useState('')
  const [withdrawId, setWithdrawId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const onUpdate = useCallback(
    (withdrawId: number, status: WithdrawStatus) => {
      const payload: UpdateWithdrawStatusPayload = {
        status
      }
      if (status === 'CANCELLED') {
        dispatch(cancelWithdrawAsync(withdrawId))
        return
      }
      dispatch(updateWithdrawStatusAsync({ withdrawId, payload }))
    },
    [dispatch]
  )

  const onReject = useCallback(() => {
    if (!withdrawId) return
    const payload: UpdateWithdrawStatusPayload = {
      status: 'REJECTED',
      reason
    }
    dispatch(updateWithdrawStatusAsync({ withdrawId, payload }))
  }, [dispatch, reason, withdrawId])

  const onOpenModal = useCallback(
    (withdrawId: number) => {
      setWithdrawId(withdrawId)
      onOpen()
    },
    [onOpen]
  )

  const renderCell = useCallback(
    (withdrawal: Withdraw, columnKey: Key) => {
      switch (columnKey) {
        case 'id':
          return <CopyText>{`${withdrawal.id}`}</CopyText>
        case 'bankName':
          return (
            <div>
              <CopyText className='text-base text-gray-800'>{withdrawal.accountNumber}</CopyText>
              <p className='text-sm italic text-gray-600'>{withdrawal.bankName}</p>
            </div>
          )
        case 'holderName':
          return <p className='text-sm'>{withdrawal.holderName}</p>
        case 'status':
          return <p className='text-sm'>{withdrawal.status}</p>
        case 'amount':
          return <p className='text-sm'>{formatPrice(withdrawal.amount)}</p>
        case 'updatedAt':
          return <p className='text-sm'>{formatDateTime(withdrawal.updatedAt)}</p>

        case 'actions':
          return (
            <div className='relative flex items-center justify-center gap-3'>
              {withdrawal.status === 'PENDING' && userRole === 'SELLER' && (
                <Button
                  color='danger'
                  title='Cancel'
                  isIconOnly
                  onClick={onUpdate.bind(null, withdrawal.id, 'CANCELLED')}
                >
                  <Icon icon='mdi:close' width={24} />
                </Button>
              )}
              {withdrawal.status === 'PENDING' && userRole === 'ADMIN' && (
                <Button
                  color='primary'
                  title='Confimerd'
                  isIconOnly
                  onClick={onUpdate.bind(null, withdrawal.id, 'CONFIRMED')}
                >
                  <Icon icon='fluent-mdl2:processing' width={24} />
                </Button>
              )}
              {withdrawal.status === 'CONFIRMED' && userRole === 'ADMIN' && (
                <>
                  <Button
                    color='success'
                    title='Completed'
                    isIconOnly
                    onClick={onUpdate.bind(null, withdrawal.id, 'COMPLETED')}
                  >
                    <Icon icon='mdi:tick' width={24} color='white' />
                  </Button>
                  <Button
                    color='danger'
                    title='Rejected'
                    isIconOnly
                    // onClick={handleOpen.bind(null, 'REJECTED', seller.id)}
                    onClick={onOpenModal.bind(null, withdrawal.id)}
                  >
                    <Icon icon='mdi:close' width={24} />
                  </Button>
                </>
              )}
            </div>
          )
        default:
          return null
      }
    },
    [onOpenModal, onUpdate]
  )

  return (
    <>
      <Table aria-label='Withdrawls Table'>
        <TableHeader columns={withdrawlsColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={withdrawalPage.items}
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
              <ModalHeader className='flex flex-col gap-1'>Enter rejected reason</ModalHeader>
              <ModalBody>
                <Input
                  type='reason'
                  label='Reason'
                  required
                  value={reason}
                  onValueChange={(value) => {
                    setError('')
                    setReason(value)
                  }}
                  isInvalid={!!error}
                />
                {error && <p className='text-red-500'>{error}</p>}
                {/* <p className='text-red-500 text-sm'>Reason Required</p> */}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    if (!reason) {
                      setError('Reason Required')
                      return
                    }
                    setReason('')
                    onReject()
                    onClose()
                  }}
                >
                  Reject
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
export default WithdrawalTable
