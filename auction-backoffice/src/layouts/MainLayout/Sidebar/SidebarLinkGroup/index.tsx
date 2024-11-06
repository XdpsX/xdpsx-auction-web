import { useRef, useState, useCallback, memo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { SidebarItem } from '../type'
import { Icon } from '@iconify/react'

const SidebarLinkGroup = memo(({ activeCondition, item }: { activeCondition: boolean; item: SidebarItem }) => {
  const location = useLocation()
  const { pathname } = location
  const [open, setOpen] = useState<boolean>(activeCondition)
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )
  const groupRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (sidebarExpanded) {
        setOpen(!open)
      } else {
        setSidebarExpanded(true)
      }
    },
    [sidebarExpanded, open]
  )

  return (
    <div>
      <NavLink
        to='#'
        className={`group nav-item justify-between ${
          (pathname === item.path || pathname.includes(item.key)) && 'bg-yellow-600 hover:text-white'
        }`}
        onClick={handleClick}
      >
        <div className='flex items-center '>
          <div className='w-8'>{item.icon && <Icon icon={item.icon} width={24} />}</div>
          {item.title}
        </div>
        {open ? <Icon icon='solar:alt-arrow-up-outline' /> : <Icon icon='solar:alt-arrow-down-outline' />}
      </NavLink>
      {/* <!-- Dropdown Menu Start --> */}
      {item.children && (
        <div
          ref={groupRef}
          className={`overflow-hidden transition-all duration-3000 ease-in-out`}
          style={{ height: open ? `${groupRef.current && groupRef.current.scrollHeight}px` : '0px' }}
        >
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
    </div>
  )
})

export default SidebarLinkGroup
