import { FaFacebookF, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { FaPhoneAlt } from 'react-icons/fa'
import LOGO from '../../assets/logo.svg'

interface MainSideBarProps {
  showSidebar: boolean
  setShowSidebar: (value: boolean) => void
}

function MainSideBar({ showSidebar, setShowSidebar }: MainSideBarProps) {
  return (
    <div className="block md:hidden">
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 transition-all ${
          !showSidebar ? 'invisible' : 'visible'
        } block md:hidden w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-[9999]`}
      ></div>

      <div
        className={`w-[300px] z-[9999] transition-all duration-200 fixed ${
          !showSidebar ? '-left-[300px] top-0' : 'left-0 top-0'
        } overflow-y-auto bg-white h-screen py-6 px-8 `}
      >
        <div className="flex justify-start flex-col gap-6">
          <Link to="/">
            <img src={LOGO} alt="logo" className="w-32" />
          </Link>

          <ul className="flex flex-col justify-start items-start text-sm font-bold uppercase">
            <li>
              <Link to={'/'} className="py-2 block">
                Home
              </Link>
            </li>
            <li>
              <Link to={'/'} className="py-2 block">
                Daily Deals
              </Link>
            </li>
            <li>
              <Link to="/" className="py-2 block">
                Brand Outlet
              </Link>
            </li>
            <li>
              <Link to="/shops" className="py-2 block">
                Gift Cards
              </Link>
            </li>
          </ul>
          <div className="flex justify-start items-center gap-4 text-black">
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaLinkedin />
            </a>
          </div>

          <ul className="flex flex-col justify-start items-start gap-3 text-gray-600">
            <li className="flex justify-start items-center gap-2 text-sm">
              <FaPhoneAlt />
              <span>+1234567890</span>
            </li>
            <li className="flex justify-start items-center gap-2 text-sm">
              <FaEnvelope />

              <span>support@xdpsx.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default MainSideBar
