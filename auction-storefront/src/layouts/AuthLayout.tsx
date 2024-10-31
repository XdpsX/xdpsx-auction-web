import { Outlet } from 'react-router-dom'
import AuthHeader from '../components/layout/AuthHeader'
import Footer from '../components/layout/Footer'
import AuthDescription from '../components/auth/AuthDescription'

function AuthLayout() {
  return (
    <>
      <AuthHeader />
      <div className="bg-blue-500">
        <div className="container-lg mx-auto px-4">
          <div className="flex items-center justify-center gap-8 lg:gap-20 py-10 text-gray-100">
            <div className="md:w-2/5 hidden md:block">
              <AuthDescription />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default AuthLayout
