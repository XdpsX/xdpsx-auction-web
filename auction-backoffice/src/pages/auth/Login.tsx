import { Link } from 'react-router-dom'
import LoginForm from '~/components/auth/LoginForm'
import SocialButtons from '~/components/auth/SocialButtons'

export default function Login() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small'>
        <p className='pb-2 text-xl font-medium'>Log In</p>
        <LoginForm />
        <SocialButtons />
        <p className='text-center text-small'>
          Need to create an account?&nbsp;
          <Link to='/register' className='text-blue-500'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}