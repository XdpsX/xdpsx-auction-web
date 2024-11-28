import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import MainHeader from '../components/layout/MainHeader'
import UserSidebar from '../components/layout/UserSidebar'

function UserLayout() {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 md:px-0 lg:px-20 xl:px-32 pt-6 pb-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
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
