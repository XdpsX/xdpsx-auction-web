import Popover from '../ui/Popover'
import { FaBell } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect } from 'react'
import {
  addNotification,
  fetchUserNotificaitonsAsync,
  selectNotification,
} from '../../features/notification/slice'
import { useSelector } from 'react-redux'
import { Notification } from '../../models/notification.type'
import { Client } from '@stomp/stompjs'
import { selectUser } from '../../features/user/user.slice'
import NotificationContent from './NotificationContent'
import socket from '../../utils/socket'

function Notifications() {
  const dispatch = useAppDispatch()
  const { notifications, unreadCount } = useSelector(selectNotification)
  const { userProfile } = useAppSelector(selectUser)

  useEffect(() => {
    dispatch(fetchUserNotificaitonsAsync())
  }, [dispatch])

  useEffect(() => {
    if (!userProfile) return
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe(
          `/topic/notification/${userProfile.id}`,
          (message) => {
            const newNotification: Notification = JSON.parse(message.body)
            dispatch(addNotification(newNotification))
          }
        )
      },
      onStompError: (frame) => {
        console.error('STOMP error: ', frame)
      },
    })

    stompClient.activate()

    return () => {
      stompClient.deactivate()
      console.log('Disconnected')
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
        <div className="absolute top-[-10px] right-[-10px] z-[10]  w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-white text-[12px]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Popover>
  )
}

export default Notifications
