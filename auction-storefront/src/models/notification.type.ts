export type Notification = {
  id: number
  message: string
  isRead: boolean
  type: 'SYSTEM' | 'EVENT' | 'AUCTION'
  createdAt: string
}
