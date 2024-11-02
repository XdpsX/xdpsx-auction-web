import { Outlet } from 'react-router-dom'
import AuthHeader from '~/components/layout/AuthHeader'
import Footer from '~/components/layout/Footer'

function AuthLayout() {
  return (
    <>
      <AuthHeader />
      <Outlet />
      <Footer />
    </>
  )
}
export default AuthLayout
