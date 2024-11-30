import { Link, NavLink } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import USER_ICON from '../../assets/default-user-icon.png'
import { selectUser } from '../../features/user/slice'
import cn from '../../utils/cn'

import { sidebarLinks } from '../../utils/sidebar-links'
import { selectWallet } from '../../features/wallet/wallet.slice'
import { formatPrice } from '../../utils/format'
import DropDown from '../ui/DropDown'
import { IconType } from 'react-icons/lib'
import SidebarLinkGroup from './SidebarLinkGroup'
import React from 'react'

export type SidebarLinkType = {
  to?: string
  icon?: IconType
  title: string
  exceptRole?: string
  group?: boolean | false
  index?: boolean | false
  children?: SidebarLinkType[]
}

function UserSidebar() {
  const { userProfile, roles } = useAppSelector(selectUser)
  const { wallet } = useAppSelector(selectWallet)
  const { pathname } = location

  const renderMobileLink = (link: SidebarLinkType, parentIcon?: IconType) => {
    return (
      <NavLink
        key={link.title}
        to={link.to || '#'}
        className={() =>
          cn(
            'flex px-2 py-2 rounded-sm items-center gap-2 capitalize transition-colors text-gray-600 hover:text-white hover:bg-blue-500'
          )
        }
      >
        {link.icon && <link.icon size={20} />}
        {!link.icon &&
          parentIcon &&
          React.createElement(parentIcon, { size: 20 })}
        {link.title}
      </NavLink>
    )
  }

  return (
    <div>
      <div className="flex items-center border-b border-b-gray-200 ">
        <Link
          to="/user/profile"
          className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10"
        >
          <img
            src={userProfile?.avatarUrl || USER_ICON}
            alt="logo"
            className="h-full w-full object-cover"
          />
        </Link>
        <div className="flex-grow pl-4">
          <div className="flex flex-col">
            <span className="truncate font-semibold text-gray-600">
              {userProfile?.name}
            </span>
            <span className="text-sm">{formatPrice(wallet?.balance || 0)}</span>
          </div>
        </div>
      </div>
      <div className="hidden md:block mt-4 space-y-2">
        {sidebarLinks.map((link) => {
          if (link.exceptRole && roles.includes(link.exceptRole)) {
            return null
          }
          if (link.group) {
            return (
              <SidebarLinkGroup
                key={link.title}
                item={link}
                activeCondition={pathname === link.to}
              />
            )
          }
          return (
            <NavLink
              key={link.title}
              to={link.to || '#'}
              className={({ isActive }) =>
                cn(
                  'flex px-2 py-1 rounded-sm items-center gap-2 capitalize transition-colors text-gray-600 hover:text-white hover:bg-blue-500',
                  isActive ? 'text-white bg-blue-500' : ''
                )
              }
            >
              {link.icon && <link.icon size={20} />}
              {link.title}
            </NavLink>
          )
        })}
      </div>
      {/* Mobile */}
      <div className="block md:hidden">
        <DropDown
          className="border"
          renderDropDown={
            <ul className="bg-white">
              {sidebarLinks.map((link) => {
                if (link.exceptRole && roles.includes(link.exceptRole)) {
                  return null
                }
                if (link.group && link.children) {
                  renderMobileLink(link)
                  return link.children.map((child) =>
                    renderMobileLink(child, link.icon)
                  )
                }
                return renderMobileLink(link)
              })}
            </ul>
          }
        >
          <div className="text-sm font-semibold text-black transition-colors">
            Categories
          </div>
        </DropDown>
      </div>
    </div>
  )
}
export default UserSidebar
