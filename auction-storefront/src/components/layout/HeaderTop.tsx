import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaBell,
  FaQuestionCircle,
  FaArrowRight,
  FaBars,
} from 'react-icons/fa'
import { useAppSelector } from '../../store/hooks'
import { selectUser } from '../../features/user/user.slice'

function HeaderTop({
  setShowSidebar,
}: {
  setShowSidebar: (value: boolean) => void
}) {
  const { userProfile } = useAppSelector(selectUser)

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
              <FaFacebookF />
            </Link>
            <Link to="#">
              <FaTwitter />
            </Link>
            <Link to="#">
              <FaLinkedin />
            </Link>
            <Link to="#">
              <FaEnvelope />
            </Link>
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-6">
          <div className="divider-next">
            <Link to="#" className="font-medium text-slate-700">
              <FaQuestionCircle />
            </Link>
          </div>
          <div className="divider-next">
            <div className="font-medium text-slate-700">
              <FaBell />
            </div>
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
            <div>
              <span className="text-slate-700 font-medium">
                {userProfile.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default HeaderTop
