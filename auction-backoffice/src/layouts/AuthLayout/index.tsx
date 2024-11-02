import { Outlet } from 'react-router-dom'
import AuthHeader from '~/components/layout/AuthHeader'
import Footer from '~/components/layout/Footer'

function AuthLayout() {
  return (
    <div className='h-screen flex flex-col'>
      <AuthHeader />
      <div className='bg-primary py-20 border-y flex-1'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
export default AuthLayout
