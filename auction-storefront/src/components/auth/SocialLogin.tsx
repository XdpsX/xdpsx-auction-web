import { Link } from 'react-router-dom'
import GOOGLE_ICON from '../../assets/google.svg'

function SocialLogin() {
  return (
    <div className="mt-2">
      <div className="relative ">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-6 text-gray-900 capitalize">
            Or login with
          </span>
        </div>
      </div>

      <div className="mt-2">
        <Link
          to="#"
          className="flex w-full items-center justify-center gap-3 border border-slate-500 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          <img src={GOOGLE_ICON} alt="" className="h-6" />
          <span className="text-sm font-semibold leading-6">Google</span>
        </Link>
      </div>
    </div>
  )
}
export default SocialLogin
