import SockJS from 'sockjs-client'

const socket = new SockJS('http://localhost:8080/ws')

export default socket
