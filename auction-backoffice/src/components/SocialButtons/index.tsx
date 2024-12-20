import { Button, Divider } from '@nextui-org/react'
import { Icon } from '@iconify/react'

function SocialButtons() {
  return (
    <>
      <div className='flex items-center gap-4 py-2'>
        <Divider className='flex-1' />
        <p className='shrink-0 text-tiny text-default-500'>OR</p>
        <Divider className='flex-1' />
      </div>
      <div className='flex flex-col gap-2'>
        <Button startContent={<Icon icon='flat-color-icons:google' width={24} />} variant='bordered'>
          Continue with Google
        </Button>
        <Button startContent={<Icon className='text-default-500' icon='fe:github' width={24} />} variant='bordered'>
          Continue with Github
        </Button>
      </div>
    </>
  )
}
export default SocialButtons
