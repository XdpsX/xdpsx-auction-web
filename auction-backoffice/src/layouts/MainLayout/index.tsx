import React from 'react'
import { Outlet } from 'react-router-dom'
import { cn } from '@nextui-org/react'

import MainHeader from '~/components/layout/MainHeader'
import Sidebar from '~/components/layout/Sidebar'
import LOGO from '~/assets/logo.svg'
import sidebarItems from '~/utils/sidebar.items'

export default function MainLayout() {
  const [isHidden, setIsHidden] = React.useState(false)

  return (
    <div className='flex h-dvh w-full'>
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
        <Sidebar sidebarItems={sidebarItems} />
      </div>
      <div className='w-full flex-1 flex-col py-4 px-8 bg-slate-200/75 overflow-y-scroll'>
        <MainHeader isHidden={isHidden} setIsHidden={setIsHidden} />
        <main className='mt-8 3xl:py-12 h-full w-full overflow-visible'>
          <div className='flex h-[90%] w-full flex-col gap-4 rounded-medium'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
