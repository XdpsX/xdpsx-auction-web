import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Switch,
  Tooltip,
  User
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import React, { Key } from 'react'
import { CopyText } from '../../CopyText'
import { Auction } from '~/app/features/auction/type'
import { formatDateTime, formatPrice } from '~/utils/format'
import { Status } from '../../Status'
import { capitalize } from '~/utils/helper'
import { Page } from '~/app/features/page/type'
import useAppSelector from '~/app/hooks/useAppSelector'
import { auctionColumns } from '~/utils/columns'
import { Link } from 'react-router-dom'

function AuctionTable({
  auctionPage,
  isLoading,
  page
}: {
  auctionPage: Page<Auction>
  isLoading: boolean
  page: 'list' | 'trashed'
}) {
  const { userRole } = useAppSelector((state) => state.user)

  const filteredColumns = React.useMemo(
    () => auctionColumns.filter((column) => !column.roles || (userRole && column.roles.includes(userRole))),
    [userRole]
  )

  const renderCell = React.useCallback(
    (auction: Auction, columnKey: Key) => {
      switch (columnKey) {
        case 'id':
          return <CopyText>{`${auction.id}`}</CopyText>
        case 'image':
          return (
            <img
              className='w-10 h-10 object-cover'
              src={auction.mainImage || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
            />
          )
        case 'name':
          return <p className='text-bold text-sm capitalize max-w-[140px] truncate'>{auction.name}</p>
        case 'price':
          return <p className='text-sm'>{formatPrice(auction.startingPrice)}</p>
        case 'published':
          return <Switch isSelected={auction.published} />
        case 'status': {
          const now = new Date()
          const content = (
            <div>
              <p>
                <span className='font-semibold'>Starting time:</span> {formatDateTime(auction.startingTime)}
              </p>
              <p>
                <span className='font-semibold'>Ending time:</span> {formatDateTime(auction.endingTime)}
              </p>
            </div>
          )
          if (now < new Date(auction.startingTime)) {
            return <Status status='Upcoming' content={content} />
          } else if (now < new Date(auction.endingTime)) {
            return <Status status='Live' content={content} />
          } else {
            return <Status status='Ended' content={content} />
          }
        }
        case 'type':
          return auction.type === 'ENGLISH' ? (
            <Chip className='bg-green-500/90'>{capitalize(auction.type)}</Chip>
          ) : (
            <Chip color='warning' className='dark:text-white'>
              {capitalize(auction.type)}
            </Chip>
          )
        case 'seller':
          if (!auction.seller) return null

          return (
            <User
              avatarProps={{ radius: 'lg', src: auction.seller.avatarUrl }}
              // description={auction[columnKey].name}
              name={auction[columnKey]?.name}
            >
              {auction.seller.name}
            </User>
          )
        case 'category':
          return <p className='text-sm'>{auction.category}</p>
        case 'actions':
          return (
            <div className='relative flex items-center justify-center gap-2'>
              <Tooltip content='Details'>
                <Link
                  to={`/auctions/details/${auction.id}`}
                  className='text-lg text-default-400 cursor-pointer active:opacity-50'
                >
                  <Icon icon='solar:eye-outline' height={18} width={18} />
                </Link>
              </Tooltip>
              {page !== 'trashed' && (
                <>
                  <Tooltip content='Edit user'>
                    <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                      <Icon icon='solar:pen-2-outline' height={18} width={18} />
                    </span>
                  </Tooltip>
                  <Tooltip color='danger' content='Delete user'>
                    <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                      <Icon icon='solar:trash-bin-minimalistic-outline' height={18} width={18} />
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
          )
        default:
          return null
      }
    },
    [page]
  )

  return (
    <Table aria-label='Auctions Table'>
      <TableHeader columns={filteredColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' || column.uid === 'published' ? 'center' : 'start'}
          >
            {column.info ? (
              <div className='flex min-w-[108px] items-center gap-2'>
                {column.name}
                <Tooltip className='max-w-[40]' content={column.info}>
                  <Icon className='text-default-400' height={16} icon='solar:info-circle-linear' width={16} />
                </Tooltip>
              </div>
            ) : (
              column.name
            )}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={auctionPage.items}
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
export default AuctionTable
