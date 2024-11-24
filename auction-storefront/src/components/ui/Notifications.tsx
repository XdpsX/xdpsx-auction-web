import Popover from './Popover'
import { FaBell } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect } from 'react'
import {
  addNotification,
  fetchUserNotificaitons,
  selectNotification,
} from '../../features/notification/notification.slice'
import { useSelector } from 'react-redux'
import { Notification } from '../../models/notification.type'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { selectUser } from '../../features/user/user.slice'
import NotificationContent from './NotificationContent'

function Notifications() {
  const dispatch = useAppDispatch()
  const { notifications, unreadCount } = useSelector(selectNotification)
  const { userProfile } = useAppSelector(selectUser)

  useEffect(() => {
    dispatch(fetchUserNotificaitons())
  }, [dispatch])

  useEffect(() => {
    if (!userProfile) return
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, () => {
      stompClient.subscribe(
        `/topic/notification/${userProfile.id}`,
        (message) => {
          const newNotification: Notification = JSON.parse(message.body)
          dispatch(addNotification(newNotification))
        }
      )
    })

    return () => {
      stompClient.disconnect(() => {
        console.log('Disconnected')
      })
    }
  }, [dispatch, userProfile])

  return (
    <Popover
      placement="bottom"
      className="flex relative cursor-pointer  items-center"
      renderPopover={<NotificationContent notifications={notifications} />}
    >
      <FaBell size={20} />
      {unreadCount > 0 && (
        <div className="absolute top-[-10px] right-[-10px] z-[99]  w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-white text-[12px]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Popover>
  )
}

export default Notifications
