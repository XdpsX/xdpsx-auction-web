import GOOGLE_ICON from '../../assets/google.svg'
import FACEBOOK_ICON from '../../assets/facebook.svg'
import { useGoogleOneTapLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { setToken } from '../../features/auth/slice'
import { toast } from 'react-toastify'
import { useAppDispatch } from '../../store/hooks'

function SocialLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      const idToken = credentialResponse.credential
      api
        .post('/auth/google/callback', { token: idToken })
        .then((res) => {
          dispatch(setToken(res.data))
          toast.success('Login Successful')
          navigate('/')
        })
        .catch((err) => {
          console.log(err)
          navigate('/login')
        })
    },
    onError: () => {
      navigate('/login')
      console.log('Login Failed')
    },
    use_fedcm_for_prompt: false,
  })

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
        <a
          href="http://localhost:8080/oauth2/authorization/google"
          className="flex w-full items-center justify-center gap-3 border border-slate-500 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          <img src={GOOGLE_ICON} alt="" className="h-6" />
          <span className="text-sm font-semibold leading-6">Google</span>
        </a>
        <a
          href="http://localhost:8080/oauth2/authorization/facebook"
          className="flex w-full items-center justify-center gap-3 border border-slate-500 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          <img src={FACEBOOK_ICON} alt="" className="h-6" />
          <span className="text-sm font-semibold leading-6">Facebook</span>
        </a>
      </div>
    </div>
  )
}
export default SocialLogin
