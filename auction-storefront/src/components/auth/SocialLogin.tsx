import { Link } from 'react-router-dom'
import GOOGLE_ICON from '../../assets/google.svg'
import FACEBOOK_ICON from '../../assets/facebook.svg'

function SocialLogin() {
  return (
    <div className="mt-3">
      <div className="relative ">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-4 text-gray-600 capitalize">
            Or login with
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          to="#"
          className="flex w-full items-center justify-center gap-3 border border-slate-500 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          <img src={GOOGLE_ICON} alt="" className="h-6" />
          <span className="text-sm font-semibold leading-6">Google</span>
        </Link>
        <Link
          to="#"
          className="flex w-full items-center justify-center gap-3 border border-slate-500 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          <img src={FACEBOOK_ICON} alt="" className="h-6" />
          <span className="text-sm font-semibold leading-6">Facebook</span>
        </Link>
      </div>
    </div>
  )
}
export default SocialLogin
