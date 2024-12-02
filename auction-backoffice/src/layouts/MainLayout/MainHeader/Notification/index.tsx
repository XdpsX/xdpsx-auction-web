import { Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { formatNotificationDate } from '~/utils/format'
import { Link } from 'react-router-dom'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { useEffect } from 'react'
import { addNotification, fetchUserNotificationsAsync, markNotificationAsReadAsync } from '~/app/features/notification'
import useWebSocket from '~/app/hooks/useWebSocket'

function Notification() {
  const dispatch = useAppDispatch()
  const { notifications, unreadCount } = useAppSelector((state) => state.notification)
  const { profile } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUserNotificationsAsync())
  }, [dispatch])

  useWebSocket({
    topic: profile ? `/topic/notification/${profile.id}` : null,
    onMessage: (newNotification: Notification) => {
      dispatch(addNotification(newNotification))
    }
  })

  const handleMarkAsRead = (id: number) => {
    dispatch(markNotificationAsReadAsync(id))
  }

  if (!notifications) return null

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='light' isIconOnly>
          <Badge
            color='danger'
            content={unreadCount > 99 ? '99+' : unreadCount}
            isInvisible={unreadCount <= 0}
            shape='circle'
          >
            <Icon className='text-default-500' icon='akar-icons:bell' width={24} />
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        emptyContent='No notifications'
        aria-label='Notification'
        className='w-[320px] max-h-[300px] overflow-y-auto'
        itemClasses={{
          base: ['data-[hover=true]:bg-transparent']
        }}
        topContent={
          <div className='flex items-center justify-between border-b py-2 px-1'>
            <h3 className='font-semibold text-lg'>Notification</h3>
            <button className='text-sm text-blue-500 underline hover:no-underline'>View all</button>
          </div>
        }
      >
        {notifications.items.map((noti) => (
          <DropdownItem key={noti.id} textValue={`${noti.id}`}>
            <Link
              to={noti.href || '#'}
              onClick={handleMarkAsRead.bind(null, noti.id)}
              className='hover:underline group'
            >
              <h4 className='font-bold text-sm capitalize '>{noti.title}</h4>
              <p className='text-sm '>{noti.message}</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='text-[12px] text-default-400 '>{formatNotificationDate(noti.createdAt)}</p>
                {noti.isRead && <Icon icon='material-symbols-light:check' width={24} />}
              </div>
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
export default Notification
