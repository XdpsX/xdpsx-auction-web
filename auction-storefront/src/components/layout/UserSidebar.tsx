import { Link, NavLink } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import USER_ICON from '../../assets/default-user-icon.png'
import { selectUser } from '../../features/user/user.slice'

function UserSidebar() {
  const { userProfile } = useAppSelector(selectUser)

  return (
    <div>
      <div className="flex items-center border-b border-b-gray-200 py-4">
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
          <div className="mb-1 truncate font-semibold text-gray-600">
            {userProfile?.name}
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <NavLink
          to="/user/profile"
          className="flex items-center capitalize transition-color text-gray-600"
        >
          My Account
        </NavLink>
        <NavLink
          to="#"
          className="flex items-center capitalize transition-color text-gray-600"
        >
          Change Password
        </NavLink>
        <NavLink
          to="/wallet/deposit"
          className="flex items-center capitalize transition-color text-gray-600"
        >
          Deposite
        </NavLink>
        <NavLink
          to="#"
          className="flex items-center capitalize transition-color text-gray-600"
        >
          Withdraw
        </NavLink>
        <NavLink
          to="#"
          className="flex items-center capitalize transition-color text-gray-600"
        >
          Auctions
        </NavLink>
        <NavLink
          to="#"
          className="flex items-center capitalize transition-color text-gray-600"
        >
          Bids
        </NavLink>
      </div>
    </div>
  )
}
export default UserSidebar
