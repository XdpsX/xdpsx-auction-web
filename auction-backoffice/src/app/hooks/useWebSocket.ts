import { useEffect } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { SOCKET_URL } from '~/constants'

interface UseWebSocketProps {
  socketUrl?: string
  topic: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage: (message: any) => void
}

const useWebSocket = ({ socketUrl = SOCKET_URL, topic, onMessage }: UseWebSocketProps) => {
  useEffect(() => {
    if (!topic) return

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        stompClient.subscribe(topic, (message) => {
          const parsedMessage = JSON.parse(message.body)
          onMessage(parsedMessage)
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error: ', frame)
      }
    })

    stompClient.activate()
    return () => {
      stompClient.deactivate()
      console.log(`Disconnected from topic: ${topic}`)
    }
  }, [socketUrl, topic, onMessage])
}

export default useWebSocket
