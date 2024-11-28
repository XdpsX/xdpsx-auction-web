import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaQuestionCircle,
  FaArrowRight,
  FaBars,
  FaAngleDown,
} from 'react-icons/fa'
import USER_ICON from '../../assets/default-user-icon.png'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectUser } from '../../features/user/user.slice'
import Popover from '../ui/Popover'

import { toast } from 'react-toastify'
import { googleLogout } from '@react-oauth/google'
import Notification from '../notification/Notifications'
import { logoutAsync } from '../../features/auth/slice'

function HeaderTop({
  setShowSidebar,
}: {
  setShowSidebar: (value: boolean) => void
}) {
  const dispatch = useAppDispatch()
  const { userProfile } = useAppSelector(selectUser)

  const handleLogout = () => {
    dispatch(logoutAsync())
      .unwrap()
      .then(() => {
        toast.success('Logout successfully')
        googleLogout()
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div className="container-lg mx-auto px-10 md:pl-12 md:pr-24 py-2">
      <div className="flex items-center justify-between">
        <div className="block md:hidden">
          <button onClick={() => setShowSidebar(true)}>
            <FaBars />
          </button>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <div className="divider-next">
            <Link
              to="#"
              className="font-medium text-slate-700 hover:text-slate-500"
            >
              Daily Deals
            </Link>
          </div>
          <div className="divider-next">
            <Link
              to="#"
              className="font-medium text-slate-700 hover:text-slate-500"
            >
              Brand Outlet
            </Link>
          </div>
          <div className="divider-next">
            <Link
              to="#"
              className="font-medium text-slate-700 hover:text-slate-500"
            >
              Gift Cards
            </Link>
          </div>
          <div className="flex gap-3">
            <Link to="#">
              <FaFacebookF size={16} />
            </Link>
            <Link to="#">
              <FaTwitter size={16} />
            </Link>
            <Link to="#">
              <FaLinkedin size={16} />
            </Link>
            <Link to="#">
              <FaEnvelope size={16} />
            </Link>
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link to="#" className="font-medium text-slate-700">
              <FaQuestionCircle size={20} />
            </Link>
            {userProfile && <Notification />}
          </div>

          {!userProfile ? (
            <Link
              to="/login"
              className="font-medium text-white bg-green-600 px-2 py-1 rounded-md hover:bg-green-700 flex items-center gap-1"
            >
              <span>Login</span>
              <FaArrowRight size={12} className="mt-[2px]" />
            </Link>
          ) : (
            <span className="text-slate-700 font-medium">
              <Popover
                className=" flex cursor-pointer items-center py-1 hover:text-slate-700/80"
                renderPopover={
                  <div className="relative rounded-sm border border-gray-200 bg-white shadow-md min-w-[150px]">
                    <Link
                      to="/user/profile"
                      className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-blue-500"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-blue-500"
                    >
                      Logout
                    </button>
                  </div>
                }
              >
                <Link
                  to="/user/profile"
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <img
                    src={userProfile.avatarUrl || USER_ICON}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <p className="max-w-[100px] truncate">{userProfile.name}</p>
                  <FaAngleDown />
                </Link>
              </Popover>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
export default HeaderTop
