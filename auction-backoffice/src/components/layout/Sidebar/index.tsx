import { useCallback, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'
import SidebarLinkGroup from './SidebarLinkGroup'
import { SidebarItem } from './type'

function Sidebar({ sidebarItems }: { sidebarItems: SidebarItem[] }) {
  const location = useLocation()
  const { pathname } = location

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )

  const renderGroupItem = useCallback(
    (item: SidebarItem) => {
      return (
        <SidebarLinkGroup key={item.title} activeCondition={pathname.includes(item.key)}>
          {(handleClick, open) => (
            <>
              <NavLink
                to='#'
                className={`group nav-item justify-between ${
                  (pathname === item.path || pathname.includes(item.key)) && 'bg-yellow-600 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  if (sidebarExpanded) {
                    handleClick()
                  } else {
                    setSidebarExpanded(true)
                  }
                }}
              >
                <div className='flex items-center '>
                  <div className='w-8'>{item.icon && <Icon icon={item.icon} width={24} />}</div>
                  {item.title}
                </div>
                {open ? <Icon icon='solar:alt-arrow-up-outline' /> : <Icon icon='solar:alt-arrow-down-outline' />}
              </NavLink>
              {/* <!-- Dropdown Menu Start --> */}
              {item.children && (
                <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                  <ul className='mt-1.5 mb-5.5 ml-2 flex flex-col gap-1.5 pl-5 border-l-1 border-gray-400'>
                    {item.children.map((child) => (
                      <li key={child.key}>
                        <NavLink
                          to={child.index ? (item.path ?? '#') : (child.path ?? '#')}
                          className={({ isActive }) =>
                            'group    text-sm  rounded-md px-4 font-medium text-slate-300 duration-300 ease-in-out hover:text-white ' +
                            (isActive && '!text-yellow-400 cursor-default')
                          }
                        >
                          {child.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* <!-- Dropdown Menu End --> */}
            </>
          )}
        </SidebarLinkGroup>
      )
    },
    [pathname, sidebarExpanded]
  )

  const renderItem = useCallback(
    (item: SidebarItem) => {
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
    [pathname]
  )

  return (
    <nav className='mt-5 py-4 px-4 text-white'>
      <ul className='mb-6 flex flex-col gap-3'>
        {sidebarItems.map((item) => (item.group ? renderGroupItem(item) : <li key={item.key}>{renderItem(item)}</li>))}
      </ul>
    </nav>
  )
}

export default Sidebar
