import { Outlet, useNavigate } from 'react-router-dom'
import AuthHeader from '../components/layout/AuthHeader'
import Footer from '../components/layout/Footer'
import AuthDescription from '../components/auth/AuthDescription'
import { useGoogleOneTapLogin } from '@react-oauth/google'
import api from '../utils/api'
import { useAppDispatch } from '../store/hooks'
import { setToken } from '../features/auth/auth.slice'
import { toast } from 'react-toastify'

function AuthLayout() {
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
    use_fedcm_for_prompt: true,
  })

  return (
    <>
      <AuthHeader />
      <div className="bg-blue-500">
        <div className="container-lg mx-auto px-4">
          <div className="flex items-center justify-center gap-8 lg:gap-20 py-10 text-gray-100">
            <div className="md:w-2/5 hidden md:block">
              <AuthDescription />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default AuthLayout
