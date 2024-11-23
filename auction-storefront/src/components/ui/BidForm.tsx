import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Bid, BidPayload, bidSchema } from '../../models/bid.type'
import Input from './Input'
import { AuctionDetails } from '../../models/auction.type'
import Button from './Button'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { placeBid } from '../../features/bid/bid.slice'
import { toast } from 'react-toastify'
import { selectUser, subtractBalance } from '../../features/user/user.slice'

function BidForm({
  auction,
  highestBid,
}: {
  auction: AuctionDetails
  highestBid: Bid | null
}) {
  const dispatch = useAppDispatch()
  const { userProfile } = useAppSelector(selectUser)
  const minAmount = highestBid
    ? highestBid.amount + auction.stepPrice
    : auction.startingPrice
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bidSchema),
    defaultValues: {
      amount: minAmount,
    },
  })

  const onSubmit = (data: BidPayload) => {
    console.log(data)
    dispatch(placeBid({ auctionId: auction.id, payload: data }))
      .unwrap()
      .then((data) => {
        dispatch(subtractBalance(data.amount * 0.1))
        toast.success('Bid successfully')
      })
      .catch((err) => {
        console.log(err)
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((key) => {
            setError(key as keyof BidPayload, {
              type: 'manual',
              message: err.fieldErrors[key],
            })
          })
        } else {
          toast.error(err.message)
        }
      })
  }
  if (userProfile && userProfile.id === auction.seller.id) {
    return (
      <p className="text-lg font-bold">You can't bid on your own auction</p>
    )
  }

  if (userProfile && userProfile.id === highestBid?.bidderId) {
    return (
      <p className="text-lg font-semibold text-green-500">
        You are the highest bidder
      </p>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="amount">Amount:</label>
        <Input
          control={control}
          id="amount"
          name="amount"
          type="number"
          placeholder="Enter bid amount"
          classNameInput="pr-5"
          min={minAmount}
          step={auction.stepPrice}
          error={errors.amount}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          // onClick={add_card}
          className="px-8 py-2 uppercase bg-blue-500 text-white hover:bg-blue-600"
        >
          Bid
        </Button>
      </div>
    </form>
  )
}
export default BidForm
