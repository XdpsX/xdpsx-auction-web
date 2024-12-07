import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='text-center pt-32'>
      <h1 className='font-bold text-4xl mb-4'>404 Not Found</h1>
      <Link to='/' className='text-blue-500 underline text-lg hover:no-underline'>
        Go back to Dashboard
      </Link>
    </div>
  )
}
export default NotFound
