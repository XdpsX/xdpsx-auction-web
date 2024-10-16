import { Link, useLocation } from 'react-router-dom'
import LOGO from '../../assets/logo.svg'

function AuthHeader() {
  // const registerMatch = useMatch('/register')
  const location = useLocation()
  const isRegisterPage = location.pathname === '/register'

  return (
    <header>
      <div className="container mx-auto px-6 md:px-0 lg:px-36">
        <nav className="flex items-center gap-2">
          <Link to="/">
            <img src={LOGO} alt="Logo" className="h-16" />
          </Link>
          <div className="text-lg lg:text-xl">
            {isRegisterPage ? 'Register' : 'Login'}
          </div>
        </nav>
      </div>
    </header>
  )
}
export default AuthHeader
