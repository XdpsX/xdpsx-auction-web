import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import MainHeader from '../components/layout/MainHeader'
import UserSidebar from '../components/layout/UserSidebar'

function UserLayout() {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-32 py-16">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-12">
          <div className="md:col-span-3 lg:col-span-2">
            <UserSidebar />
          </div>
          <div className="md:col-span-9 lg:col-span-10">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default UserLayout
