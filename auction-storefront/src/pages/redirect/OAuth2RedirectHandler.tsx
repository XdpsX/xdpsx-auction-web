import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { setToken } from '../../features/auth/slice'

function OAuth2RedirectHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    console.log('OAuth2RedirectHandler: Params:', params.toString())

    if (refreshToken && accessToken) {
      try {
        dispatch(setToken({ accessToken, refreshToken }))
        // Delay navigation to ensure local storage operations complete
        setTimeout(() => {
          navigate('/')
        }, 100)
      } catch (error) {
        console.error('Token decoding failed:', error)
        navigate('/login')
      }
    } else {
      console.log('Token not found in URL, redirecting to login')
      navigate('/login')
    }
  }, [location, navigate, dispatch])

  return <div></div>
}
export default OAuth2RedirectHandler
