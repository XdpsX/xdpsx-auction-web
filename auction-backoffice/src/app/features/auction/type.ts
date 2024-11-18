import * as yup from 'yup'

export type Auction = {
  id: number
  mainImage: string
  name: string
  startingPrice: number
  startingTime: string
  endingTime: string
  auctionType: string
  published: boolean
  category: string
}

export const auctionSchema = yup.object().shape({
  name: yup.string().required('Please enter auction name').max(128, 'Name must not exceed 128 characters'),
  description: yup.string().max(2000, 'Description must not exceed 2000 characters'),
  auctionType: yup.string().required('Please select auction type').oneOf(['ENGLISH', 'SEALED_BID']),
  startingPrice: yup
    .number()
    .required('Please enter starting price')
    .min(1, 'Starting price must be greater than 0')
    .max(2_000_000_000, 'Starting price must not exceed 2,000,000,000'),
  stepPrice: yup.number().when('auctionType', ([auctionType], schema) => {
    if (auctionType === 'ENGLISH') {
      return schema.required('Please enter step price').min(1, 'Step price must be greater than 0')
    }
    return schema.notRequired()
  }),
  startingTime: yup.string().required('Please select starting time'),
  endingTime: yup.string().required('Please select ending time'),
  published: yup.boolean().required('Please select published status'),
  categoryId: yup.number().required('Please select category'),
  mainImageId: yup.number(),
  imageIds: yup.array().of(yup.number())
})

export type AuctionPayload = yup.InferType<typeof auctionSchema>
