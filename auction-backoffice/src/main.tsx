import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import App from './App.tsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <NextThemesProvider attribute='class' defaultTheme='light'>
          <App />
          <ToastContainer />
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
  </StrictMode>
)
