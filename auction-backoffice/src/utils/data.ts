import { OrderStatus } from '~/app/features/order/type'
import { SelectItemType } from '~/components/Selection/type'

export const publishedOptions: SelectItemType[] = [
  { key: 'all', title: 'All' },
  { key: 'true', title: 'Published' },
  { key: 'false', title: 'Unpublished' }
]

export const sortOptions = [
  { title: 'Newest', key: '-date' },
  { title: 'Oldest', key: 'date' },
  { title: 'Name Z-A', key: '-name' },
  { title: 'Name A-Z', key: 'name' }
]

export const orderSortOptions = [
  { title: 'Newest', key: '-date' },
  { title: 'Oldest', key: 'date' },
  { title: 'Amount 9-0', key: '-amount' },
  { title: 'Amount 0-9', key: 'amount' }
]

export const statusOptions = [
  { name: 'Upcoming', uid: 'upcoming' },
  { name: 'Live', uid: 'live' },
  { name: 'Ended', uid: 'ended' }
] as const

export type StatusOptions = (typeof statusOptions)[number]['name']

export const statusColorMap: Record<StatusOptions, string> = {
  Upcoming: 'currentColor',
  Live: '#17C964',
  Ended: '#F31260'
  // Vacation: '#F5A524'
}

export const sellerStatus: SelectItemType[] = [
  { key: 'all', title: 'All' },
  { key: 'APPROVED', title: 'Approved' },
  { key: 'REJECTED', title: 'Rejected' }
]

export const orderActions: { [key in OrderStatus]: string[] } = {
  Pending: ['View', 'Update', 'Cancel'],
  Confirmed: ['View', 'Update', 'Cancel'],
  Shipped: ['View', 'Update', 'Cancel'],
  Delivered: ['View'],
  Cancelled: ['View'],
  Returned: ['View']
}

const orderStatusList: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  const currentIndex = orderStatusList.indexOf(currentStatus)
  if (currentIndex === -1 || currentIndex === orderStatusList.length - 1) {
    return null // Trả về null nếu không tìm thấy trạng thái hoặc đã là trạng thái cuối
  }
  return orderStatusList[currentIndex + 1] // Trả về trạng thái tiếp theo
}
