import ProtectedRoute from '../components/route/ProtectedRoute'
import UserLayout from '../layouts/UserLayout'
import { userLinks } from '../utils/links'
import createUserRoutesFromLinks from './createUserRoutesFromLinks'

// const userRoutes = [
//   {
//     element: (
//       <ProtectedRoute>
//         <UserLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       {
//         path: '/user/profile',
//         element: (
//           <>
//             <PageTitle title="Profile" />
//             <Profile />
//           </>
//         ),
//       },
//       {
//         path: '/user/change-password',
//         element: (
//           <>
//             <PageTitle title="Change Password" />
//             <ChangePasswordPage />
//           </>
//         ),
//       },
//       {
//         path: '/wallet/deposit',
//         element: (
//           <>
//             <PageTitle title="Wallet | Deposit" />
//             <Deposit />
//           </>
//         ),
//       },
//       {
//         path: '/user/bids',
//         element: (
//           <>
//             <PageTitle title="My Bids" />
//             <BidsPage />
//           </>
//         ),
//       },
//       {
//         path: '/user/seller-register',
//         element: (
//           <NonRoleProtected exceptRole="SELLER">
//             <PageTitle title="Seller Register" />
//             <SellerRegisterPage />
//           </NonRoleProtected>
//         ),
//       },
//     ],
//   },
// ]

// export default userRoutes

const userRoutes = [
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: createUserRoutesFromLinks(userLinks),
  },
]

export default userRoutes
