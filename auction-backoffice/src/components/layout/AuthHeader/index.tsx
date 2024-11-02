import { useLocation } from 'react-router-dom'
import LOGO from '~/assets/logo.svg'

function AuthHeader() {
  const location = useLocation()
  const isRegisterPage = location.pathname === '/register'

  return (
    <header className='container mx-auto px-6 xl:px-36'>
      <nav className='flex items-center'>
        <a href='#'>
          <img src={LOGO} alt='Logo' className='w-32' />
        </a>
        <div className='text-lg lg:text-2xl'>{isRegisterPage ? 'Seller Register' : 'Seller Login'}</div>
      </nav>
    </header>
  )
}
export default AuthHeader
