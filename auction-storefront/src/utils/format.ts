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

export const formatNotificationDate = (dateString: string) => {
  const dateObj = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `Just now`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}min ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else if (diffInSeconds < 172800) {
    return 'yesterday'
  } else {
    return dateObj.toLocaleDateString()
  }
}

const removeSpecialCharacter = (str: string) =>
  str.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ''
  )

export const generateSlug = ({
  name,
  id,
}: {
  name: string
  id: string | number
}) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromSlug = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}
