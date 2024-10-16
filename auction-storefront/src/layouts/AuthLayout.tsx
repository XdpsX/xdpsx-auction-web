import { Outlet } from 'react-router-dom'
import AuthHeader from '../components/layout/AuthHeader'
import Footer from '../components/layout/Footer'

function AuthLayout() {
  return (
    <div>
      <AuthHeader />
      <div className="bg-blue-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-20 py-12 text-gray-100">
            <div className="text-center md:w-1/2 lg:w-1/3 hidden md:block">
              <h1 className="text-3xl lg:text-5xl font-bold mb-4">
                Welcome to Auction
              </h1>
              <p className="text-lg lg:text-xl">
                Join our community to receive updates on the latest auctions and
                special offers!
              </p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default AuthLayout
