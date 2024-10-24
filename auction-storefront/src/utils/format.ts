export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  // const formattedPrice = new Intl.NumberFormat('en-US', {
  //   minimumFractionDigits: 0,
  //   maximumFractionDigits: 0,
  // }).format(price)

  // return `C.${formattedPrice}`
}

export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US')
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US')
}
