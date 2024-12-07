import { memo, useCallback, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { SidebarLinkType } from './UserSidebar'

// export type SidebarItem = {
//   key: string
//   title: string
//   icon?: string
//   path?: string
//   group?: boolean | false
//   index?: boolean | false
//   children?: SidebarItem[]
//   exceptRole?: string
// }

const SidebarLinkGroup = memo(
  ({
    activeCondition,
    item,
  }: {
    activeCondition: boolean
    item: SidebarLinkType
  }) => {
    const location = useLocation()
    const { pathname } = location
    const [open, setOpen] = useState<boolean>(activeCondition)
    const groupRef = useRef<HTMLDivElement>(null)

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setOpen(!open)
      },
      [open]
    )

    return (
      <div>
        <NavLink
          key={item.title}
          to={item.to || '#'}
          className={`group flex items-center justify-between px-2 py-1 rounded-sm capitalize transition-colors text-gray-600 hover:text-white hover:bg-blue-500 ${
            (pathname === item.to || pathname.includes(item.to || '#')) &&
            'text-white bg-blue-500'
          }`}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            {item.icon && <item.icon size={20} />}
            {item.title}
          </div>
          {open ? (
            <FaChevronUp color=" #adaeb1" size={14} />
          ) : (
            <FaChevronDown color="#adaeb1" size={14} />
          )}
        </NavLink>
        {/* <!-- Dropdown Menu Start --> */}
        {item.children && (
          <div
            ref={groupRef}
            className={`overflow-hidden transition-all duration-3000 ease-in-out`}
            style={{
              height: open
                ? `${groupRef.current && groupRef.current.scrollHeight}px`
                : '0px',
            }}
          >
            <ul className="mt-1.5 mb-5.5 ml-2  flex flex-col gap-1.5 pl-5 border-l border-gray-400">
              {item.children.map((child) => {
                return (
                  <li key={child.title}>
                    <NavLink
                      to={child.index ? item.to ?? '#' : child.to ?? '#'}
                      className={() =>
                        'group text-sm rounded-md font-medium text-gray-700 duration-300 ease-in-out hover:text-blue-500'
                      }
                    >
                      {child.title}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {/* <!-- Dropdown Menu End --> */}
      </div>
    )
  }
)

export default SidebarLinkGroup
