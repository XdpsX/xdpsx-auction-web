import React from 'react'
import { Button, ScrollShadow, Spacer } from '@nextui-org/react'
import { cn } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import Sidebar from '~/components/layout/Sidebar'
import sidebarItems from '~/utils/sidebar.items'
import LOGO from '~/assets/logo.svg'
import MainHeader from '~/components/layout/MainHeader'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  const [isHidden, setIsHidden] = React.useState(false)

  return (
    <div className='flex h-dvh overflow-hidden w-full'>
      <div
        className={cn(
          'relative bg-black/90 flex h-full w-72 max-w-[288px] flex-1 flex-col !border-r-small border-divider p-6 transition-[transform,opacity,margin] duration-250 ease-in-out',
          {
            '-ml-72 -translate-x-72': isHidden
          }
        )}
      >
        <div className='flex items-center gap-2 px-2'>
          <img src={LOGO} alt='logo' className='w-40' />
        </div>
        <ScrollShadow className='-mr-6 h-full max-h-full py-6 pr-6'>
          <Sidebar defaultSelectedKey='home' items={sidebarItems} />
        </ScrollShadow>
        <Spacer y={8} />
        <div className='mt-auto flex flex-col'>
          <Button
            fullWidth
            className='justify-start text-default-500 data-[hover=true]:text-foreground'
            startContent={<Icon className='text-default-500' icon='solar:info-circle-line-duotone' width={24} />}
            variant='light'
          >
            Help & Information
          </Button>
          <Button
            className='justify-start text-default-500 data-[hover=true]:text-foreground'
            startContent={
              <Icon className='rotate-180 text-default-500' icon='solar:minus-circle-line-duotone' width={24} />
            }
            variant='light'
          >
            Log Out
          </Button>
        </div>
      </div>
      <div className='w-full flex-1 flex-col py-4 px-8 bg-slate-200/75'>
        <MainHeader isHidden={isHidden} setIsHidden={setIsHidden} />
        <main className='mt-8 py-12 h-full w-full overflow-visible'>
          <div className='flex h-[90%] w-full flex-col gap-4 rounded-medium'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
