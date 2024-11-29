import { memo, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'
import SidebarLinkGroup from './SidebarLinkGroup'
import { SidebarItem } from './type'
import useAppSelector from '~/app/hooks/useAppSelector'

const Sidebar = ({ sidebarItems }: { sidebarItems: SidebarItem[] }) => {
  const location = useLocation()
  const { pathname } = location
  const { userRole } = useAppSelector((state) => state.user)

  const renderGroupItem = useMemo(
    () => (item: SidebarItem) => {
      if (item.roles && userRole && !item.roles.includes(userRole)) return null
      return <SidebarLinkGroup key={item.key} activeCondition={pathname === item.key} item={item} />
    },
    [pathname, userRole]
  )

  const renderItem = useMemo(
    () => (item: SidebarItem) => {
      if (item.roles && userRole && !item.roles.includes(userRole)) return null
      return (
        <NavLink
          to={item.path ?? '#'}
          className={`group nav-item ${(pathname === item.key || pathname.includes(item.key)) && 'bg-yellow-600 hover:text-white'}`}
        >
          <div className='flex items-center '>
            <div className='w-8'>{item.icon && <Icon icon={item.icon} width={24} />}</div>
            {item.title}
          </div>
        </NavLink>
      )
    },
    [pathname, userRole]
  )

  return (
    <nav className='mt-5 py-4 px-4 text-white'>
      <ul className='mb-6 flex flex-col gap-3'>
        {sidebarItems.map((item) => (item.group ? renderGroupItem(item) : <li key={item.key}>{renderItem(item)}</li>))}
      </ul>
    </nav>
  )
}

export default memo(Sidebar)
