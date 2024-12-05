import Home from '../pages/Home'
import MainLayout from '../layouts/MainLayout'
import AuctionDetailsPage from '../pages/AuctionDetailsPage'
import PageTitle from '../components/layout/PageTitle'
import ProtectedRoute from '../components/route/ProtectedRoute'
import DepositRedirect from '../pages/redirect/DepositRedirect'
import PaymentFailure from '../pages/handler/PaymentFailure'
import PaymentSuccess from '../pages/handler/PaymentSuccess'

const mainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <PageTitle title="Home" />
            <Home />
          </>
        ),
      },
      {
        path: '/auctions/:slug',
        element: (
          <>
            <PageTitle title="Auction Details" />
            <AuctionDetailsPage />
          </>
        ),
      },
    ],
  },
  {
    path: '/deposits/:transactionId/payment/redirect',
    element: (
      <ProtectedRoute>
        <DepositRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/success',
    element: (
      <ProtectedRoute>
        <PaymentSuccess />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/failed',
    element: (
      <ProtectedRoute>
        <PaymentFailure />
      </ProtectedRoute>
    ),
  },
]

export default mainRoutes
