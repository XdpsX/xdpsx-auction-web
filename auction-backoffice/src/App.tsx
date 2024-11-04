import { useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import AppRouter from './router'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { useEffect } from 'react'
import { fetchUserProfile, setProfile } from './features/user.slice'
import LoadingOverlay from './components/shared/LoadingOverlay'

export default function App() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector((state) => state.auth)
  const { isLoading } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserProfile())
    } else {
      dispatch(setProfile(null))
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
