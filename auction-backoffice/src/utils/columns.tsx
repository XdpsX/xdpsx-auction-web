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
