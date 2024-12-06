import Home from '../pages/Home'
import MainLayout from '../layouts/MainLayout'
import AuctionDetailsPage from '../pages/AuctionDetailsPage'
import PageTitle from '../components/layout/PageTitle'
import ProtectedRoute from '../components/route/ProtectedRoute'
import DepositRedirect from '../pages/redirect/DepositRedirect'
import PaymentFailure from '../pages/handler/PaymentFailure'
import PaymentSuccess from '../pages/handler/PaymentSuccess'
import CheckoutPage from '../pages/CheckoutPage'
import OrderSuccess from '../pages/handler/OrderSuccess'

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
      {
        path: '/checkout',
        element: (
          <ProtectedRoute>
            <PageTitle title="Checkout" />
            <CheckoutPage />
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
      {
        path: '/order/success',
        element: (
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
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
]

export default mainRoutes
