import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { Key, useCallback } from 'react'
import { Page } from '~/app/features/page/type'
import { Withdraw } from '~/app/features/withdrawal/type'
import { CopyText } from '~/components/CopyText'
import { withdrawlsColumns } from '~/utils/columns'
import { formatDateTime, formatPrice } from '~/utils/format'

function WithdrawalTable({ withdrawalPage, isLoading }: { withdrawalPage: Page<Withdraw>; isLoading: boolean }) {
  const renderCell = useCallback((withdrawal: Withdraw, columnKey: Key) => {
    switch (columnKey) {
      case 'bankName':
        return <p className='text-sm'>{withdrawal.bankName}</p>
      case 'accountNumber':
        return <CopyText>{withdrawal.accountNumber}</CopyText>
      case 'holderName':
        return <p className='text-sm'>{withdrawal.holderName}</p>
      case 'status':
        return <p className='text-sm'>{withdrawal.status}</p>
      case 'amount':
        return <p className='text-sm'>{formatPrice(withdrawal.amount)}</p>
      case 'updatedAt':
        return <p className='text-sm'>{formatDateTime(withdrawal.updatedAt)}</p>

      case 'actions':
        return <div className='relative flex items-center justify-center gap-3'></div>
      default:
        return null
    }
  }, [])

  return (
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
  )
}
export default WithdrawalTable
