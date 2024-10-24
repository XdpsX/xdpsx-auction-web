import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import store from './store'
import App from './App.tsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-multi-carousel/lib/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" autoClose={2000} />
    </Provider>
  </StrictMode>
)
