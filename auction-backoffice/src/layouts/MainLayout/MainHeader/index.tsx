import React from 'react'
import { Icon } from '@iconify/react'
import { Button } from '@nextui-org/react'
import ThemeSwitcher from './ThemeSwitcher'
import Notification from './Notification'
import UserInfo from './UserInfo'

const MainHeader = React.memo(
  ({ isHidden, setIsHidden }: { isHidden: boolean; setIsHidden: (isHidden: boolean) => void }) => {
    return (
      <header className='flex items-center justify-between gap-3 rounded-medium border-small border-divider p-4 sm:pr-12'>
        <Button isIconOnly size='sm' variant='light' onPress={() => setIsHidden(!isHidden)}>
          <Icon className='text-default-500' height={24} icon='solar:sidebar-minimalistic-outline' width={24} />
        </Button>
        <div className='flex items-center gap-6'>
          <ThemeSwitcher />
          <Notification />
          <UserInfo />
        </div>
      </header>
    )
  }
)

export default MainHeader
