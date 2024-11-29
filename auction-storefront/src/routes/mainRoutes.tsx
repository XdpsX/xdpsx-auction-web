import Home from '../pages/Home'
import MainLayout from '../layouts/MainLayout'
import AuctionDetailsPage from '../pages/AuctionDetailsPage'
import PageTitle from '../components/layout/PageTitle'
import ProtectedRoute from '../components/route/ProtectedRoute'
import PaymentRedirect from '../pages/redirect/PaymentRedirect'
import PaymentHandler from '../pages/handler/PaymentHandler'

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
    path: '/transactions/:transactionId/payment/redirect',
    element: (
      <ProtectedRoute>
        <PaymentRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/handler',
    element: (
      <ProtectedRoute>
        <PaymentHandler />
      </ProtectedRoute>
    ),
  },
]

export default mainRoutes
