import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import MainHeader from '../components/layout/MainHeader'

function MainLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
      <Footer />
    </>
  )
}
export default MainLayout
