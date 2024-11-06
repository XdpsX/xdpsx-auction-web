import { Spinner } from '@nextui-org/react'
import THUMB from '~/assets/loading-thumb.png'

function LoadingOverlay() {
  return (
    <div className='flex justify-center mt-10'>
      <div className='flex flex-col items-center'>
        <img src={THUMB} alt='loading thumbnail' className='w-80' />
        <Spinner
          size='lg'
          classNames={{
            wrapper: 'h-24 w-24'
          }}
        />
      </div>
    </div>
  )
}
export default LoadingOverlay
