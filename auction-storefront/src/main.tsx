import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './store'
import App from './App.tsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-multi-carousel/lib/styles.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" autoClose={1200} />
    </Provider>
  </GoogleOAuthProvider>
  // </StrictMode>
)
