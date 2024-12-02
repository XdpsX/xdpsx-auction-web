import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from '~/app/features/auth'
import { setProfile } from '~/app/features/user'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'

function UserInfo() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { profile, userRole } = useAppSelector((state) => state.user)

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
    <Dropdown>
      <DropdownTrigger>
        <div className='flex items-center gap-2'>
          {userRole === 'SELLER' && profile.sellerDetails ? (
            <User
              name={profile.sellerDetails.name}
              description={profile?.email}
              avatarProps={{
                isBordered: true,
                src: profile.sellerDetails.avatarUrl || 'https://i.pravatar.cc/150?u=a04258114e29026702d'
              }}
              as='button'
              className='transition-transform'
            />
          ) : (
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
          )}
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
  )
}
export default UserInfo
