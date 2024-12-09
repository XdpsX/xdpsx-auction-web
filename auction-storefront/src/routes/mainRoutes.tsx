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
import OrderRedirect from '../pages/redirect/OrderRedirect'
import SearchPage from '../pages/SearchPage'

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
        path: '/search',
        element: (
          <>
            <PageTitle title="Search" />
            <SearchPage />
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
  {
    path: '/orders/:orderId/payment/redirect',
    element: (
      <ProtectedRoute>
        <OrderRedirect />
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
]

export default mainRoutes
