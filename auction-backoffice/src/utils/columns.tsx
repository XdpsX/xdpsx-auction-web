export const auctionColumns = [
  { name: 'ID', uid: 'id', roles: ['ADMIN', 'SELLER'] },
  { name: 'IMAGE', uid: 'image', roles: ['ADMIN', 'SELLER'] },
  { name: 'NAME', uid: 'name', roles: ['ADMIN', 'SELLER'] },
  {
    name: 'PRICE',
    uid: 'price',
    roles: ['ADMIN', 'SELLER'],
    info: (
      <div className='text-sm'>
        <p>
          <span className='font-semibold'>English:</span> starting bid amount
        </p>
        <p>
          <span className='font-semibold'>Sealead bid:</span> buy now amount
        </p>
      </div>
    )
  },
  { name: 'STATUS', uid: 'status', roles: ['ADMIN', 'SELLER'] },
  { name: 'TYPE', uid: 'type', roles: ['ADMIN', 'SELLER'] },
  { name: 'SELLER', uid: 'seller', roles: ['ADMIN'] },
  { name: 'CATEGORY', uid: 'category', roles: ['ADMIN', 'SELLER'] },
  { name: 'PUBLISHED', uid: 'published', roles: ['ADMIN'] },
  { name: 'ACTIONS', uid: 'actions', roles: ['ADMIN', 'SELLER'] }
]

export const sellerColumns = [
  { name: 'ID', uid: 'id' },
  { name: 'USER', uid: 'user' },
  { name: 'SHOP', uid: 'shop' },
  { name: 'ADDRESS', uid: 'address' },
  { name: 'MOBILE PHONE', uid: 'mobilePhone' },
  { name: 'REGISTERED AT', uid: 'registeredAt' },
  { name: 'STATUS', uid: 'status', showIn: ['list'] },
  { name: 'ACTIONS', uid: 'actions', showIn: ['register-list'] }
]

export const orderColumns = [
  { name: 'ID', uid: 'id' },
  { name: 'TRACKING NUMBER', uid: 'trackNumber', roles: ['ADMIN', 'SELLER'] },
  { name: 'AUCTION', uid: 'auction', roles: ['ADMIN', 'SELLER'] },
  {
    name: 'TOTAL AMOUNT',
    uid: 'totalAmount',
    roles: ['ADMIN', 'SELLER']
  },
  { name: 'SHIPPING ADDRESS', uid: 'shippingAddress', roles: ['ADMIN', 'SELLER'] },
  { name: 'UPDATED AT', uid: 'updatedAt', roles: ['ADMIN', 'SELLER'] },
  { name: 'ACTIONS', uid: 'actions', roles: ['ADMIN', 'SELLER'] }
]

export const withdrawlsColumns = [
  { name: 'ID', uid: 'id' },
  { name: 'BANK', uid: 'bankName' },
  {
    name: 'HOLDER NAME',
    uid: 'holderName'
  },
  { name: 'AMOUNT', uid: 'amount' },
  { name: 'STATUS', uid: 'status' },
  { name: 'UPDATED AT', uid: 'updatedAt' },
  { name: 'ACTIONS', uid: 'actions' }
]
