import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import AppRouter from './router'
import useAppDispatch from './app/hooks/useAppDispatch'
import useAppSelector from './app/hooks/useAppSelector'
import { fetchUserProfile, setProfile, setRoles } from './app/features/user'
import LoadingOverlay from './components/LoadingOverlay'

export default function App() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector((state) => state.auth)
  const { isLoading } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserProfile())
      dispatch(setRoles(accessToken))
    } else {
      dispatch(setProfile(null))
      dispatch(setRoles(null))
    }
  }, [dispatch, accessToken])

  if (isLoading) {
    return <LoadingOverlay />
  }
  return (
    <NextThemesProvider attribute='class' defaultTheme='light'>
      <NextUIProvider navigate={navigate}>
        <AppRouter />
      </NextUIProvider>
    </NextThemesProvider>
  )
}
