import { Icon } from '@iconify/react'
import { User, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { ThemeSwitcher } from '~/components/shared/ThemeSwitcher'

function MainHeader({ isHidden, setIsHidden }: { isHidden: boolean; setIsHidden: (isHidden: boolean) => void }) {
  return (
    <header className='flex items-center justify-between gap-3 rounded-medium border-small border-divider p-4 sm:pr-12'>
      <Button isIconOnly size='sm' variant='light' onPress={() => setIsHidden(!isHidden)}>
        <Icon className='text-default-500' height={24} icon='solar:sidebar-minimalistic-outline' width={24} />
      </Button>
      <div className='flex items-center gap-6'>
        <ThemeSwitcher />
        <Dropdown>
          <DropdownTrigger>
            <User
              name='Jane Doe'
              description='Product Designer'
              avatarProps={{
                isBordered: true,
                src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
              }}
              as='button'
              className='transition-transform'
            />
          </DropdownTrigger>
          <DropdownMenu aria-label='Profile Actions'>
            <DropdownItem key='new'>New file</DropdownItem>
            <DropdownItem key='copy'>Copy link</DropdownItem>
            <DropdownItem key='edit'>Edit file</DropdownItem>
            <DropdownItem key='delete' className='text-danger' color='danger'>
              Delete file
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  )
}
export default MainHeader
