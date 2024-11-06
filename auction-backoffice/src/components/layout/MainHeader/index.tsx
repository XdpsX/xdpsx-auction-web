import { Icon } from '@iconify/react'
import { User, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { ThemeSwitcher } from '~/components/shared/ThemeSwitcher'
import { logout } from '~/features/auth.slice'
import { setProfile } from '~/features/user.slice'

function MainHeader({ isHidden, setIsHidden }: { isHidden: boolean; setIsHidden: (isHidden: boolean) => void }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { profile } = useAppSelector((state) => state.user)

  const onLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        dispatch(setProfile(null))
        navigate('/login')
        toast.success('Logout successfully')
      })
  }

  if (!profile) return null

  return (
    <header className='flex items-center justify-between gap-3 rounded-medium border-small border-divider p-4 sm:pr-12'>
      <Button isIconOnly size='sm' variant='light' onPress={() => setIsHidden(!isHidden)}>
        <Icon className='text-default-500' height={24} icon='solar:sidebar-minimalistic-outline' width={24} />
      </Button>
      <div className='flex items-center gap-6'>
        <ThemeSwitcher />
        <Dropdown>
          <DropdownTrigger>
            <div className='flex items-center gap-2'>
              <User
                name={profile?.name}
                description={profile?.email}
                avatarProps={{
                  isBordered: true,
                  src: profile?.avatarUrl || 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                }}
                as='button'
                className='transition-transform'
              />
              <Icon className='text-default-500' icon='solar:alt-arrow-down-outline' />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label='Profile Actions'>
            <DropdownItem
              startContent={<Icon icon='solar:logout-2-outline' />}
              key='delete'
              className='text-danger'
              color='danger'
              onClick={onLogout}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  )
}
export default MainHeader
