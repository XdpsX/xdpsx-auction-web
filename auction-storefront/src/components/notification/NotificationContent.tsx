import { Link } from 'react-router-dom'
import { BsCheck2 } from 'react-icons/bs'
import { Page } from '../../models/page.type'
import { formatNotificationDate } from '../../utils/format'
import { useAppDispatch } from '../../store/hooks'
import { Notification } from '../../models/notification.type'
import { markNotificaitonAsReadAsync } from '../../features/notification/slice'

function NotificationContent({
  notifications,
}: {
  notifications: Page<Notification> | null
}) {
  const dispatch = useAppDispatch()

  const handleMarkAsRead = (id: number) => {
    dispatch(markNotificaitonAsReadAsync(id))
  }

  const handleMarkAllAsRead = () => {
    if (notifications && notifications.items.length > 0) {
      const unreadIds = notifications.items
        .filter((noti) => !noti.isRead)
        .map((noti) => noti.id)
      if (unreadIds.length > 0) {
        unreadIds.forEach((id) => {
          dispatch(markNotificaitonAsReadAsync(id))
        })
      }
    }
  }

  if (!notifications) return null

  if (notifications.items.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-800 py-2 w-[320px] shadow-md">
        <div className="flex items-center justify-between py-2 px-4">
          <h3 className="font-semibold">Notification</h3>
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="text-center py-8 flex items-center justify-center h-full font-bold">
          No notifications
        </div>
      </div>
    )
  }
  const items = notifications.items
  return (
    <div className="bg-gray-50 py-2 w-[320px] shadow-md">
      <div className="flex items-center justify-between py-2 px-4">
        <h3 className="font-semibold">Notification</h3>
        <button
          className="text-sm text-blue-500 underline"
          onClick={handleMarkAllAsRead}
        >
          Mark viewed all
        </button>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="max-h-[300px] overflow-y-auto">
        {items.map((noti) => (
          <Link
            to={noti.href ? noti.href : '#'}
            key={noti.id}
            onClick={handleMarkAsRead.bind(null, noti.id)}
            className="hover:underline group"
          >
            <div className={`px-4 py-2 ${noti.isRead ? '' : 'bg-white'}`}>
              <h4 className="font-bold text-sm capitalize group-hover:text-blue-500">
                {noti?.title || 'New notification'}
              </h4>
              <p className="text-sm group-hover:text-blue-500">
                {noti.message}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[12px] text-gray-500">
                  {formatNotificationDate(noti.createdAt)}
                </p>
                {noti.isRead && (
                  <BsCheck2 size={16} className=" group-hover:text-blue-500" />
                )}
              </div>
            </div>
            <div className="border-t border-gray-200"></div>
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="text-center">
        <Link to="#" className="text-sm text-blue-500 underline">
          View all notifications
        </Link>
      </div>
    </div>
  )
}

export default NotificationContent
