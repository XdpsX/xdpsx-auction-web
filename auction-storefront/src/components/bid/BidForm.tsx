import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Bid, BidPayload, bidSchema } from '../../models/bid.type'
import Input from '../ui/Input'
import { AuctionDetails } from '../../models/auction.type'
import Button from '../ui/Button'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { toast } from 'react-toastify'
import { selectUser } from '../../features/user/user.slice'
import { useEffect, useState } from 'react'
import {
  getUserBidAsync,
  placeBidAsync,
  selectBid,
} from '../../features/bid/slice'
import BidAttention from './BidAttention'
import { formatPrice } from '../../utils/format'

function BidForm({
  auction,
  highestBid,
}: {
  auction: AuctionDetails
  highestBid: Bid | null
}) {
  const dispatch = useAppDispatch()
  const { userBid } = useAppSelector(selectBid)
  const { userProfile } = useAppSelector(selectUser)
  const isAuthenticated = !!userProfile

  const [securityFee, setSecurityFee] = useState(0)
  const [showBidAttention, setShowBidAttention] = useState(
    localStorage.getItem('show-bid-attention') !== 'false'
  )
  const [showAttentionAgain, setShowAttentionAgain] = useState(true)
  const [openAttention, setOpenAttention] = useState(false)

  const minAmount = highestBid
    ? highestBid.amount + auction.stepPrice
    : auction.startingPrice + auction.stepPrice
  const {
    control,
    handleSubmit,
    setError,
    watch,
    getValues,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bidSchema),
    defaultValues: {
      amount: minAmount,
    },
  })
  const amountWatch = watch('amount')

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserBidAsync(auction.id))
    }
  }, [auction.id, dispatch, isAuthenticated])

  useEffect(() => {
    reset({ amount: minAmount })
  }, [highestBid, minAmount, reset])

  useEffect(() => {
    if (userBid) {
      setSecurityFee((amountWatch - userBid.amount) * 0.1)
    } else {
      setSecurityFee(amountWatch * 0.1)
    }
  }, [userBid, amountWatch])

  const increaseAmount = () => {
    clearErrors('amount')
    const amount = Number(getValues('amount'))
    setValue('amount', amount + auction.stepPrice)
  }

  const decreaseAmount = () => {
    clearErrors('amount')
    const amount = Number(getValues('amount'))
    if (amount > minAmount) {
      setValue('amount', amount - auction.stepPrice)
    } else {
      setError('amount', {
        type: 'manual',
        message: 'Amount must be greater than the current bid',
      })
    }
  }

  const onSubmit = (data: BidPayload) => {
    if (!showAttentionAgain) {
      setShowBidAttention(false)
      localStorage.setItem('show-bid-attention', 'false')
    }
    if (openAttention) {
      setOpenAttention(false)
    }

    dispatch(placeBidAsync({ auctionId: auction.id, payload: data }))
      .unwrap()
      .then(() => {
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

  const handleCloseModal = () => {
    setOpenAttention(false)
    setShowAttentionAgain(true)
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
    <>
      <BidAttention
        open={openAttention}
        onClose={handleCloseModal}
        showAttentionAgain={showAttentionAgain}
        setShowAttentionAgain={setShowAttentionAgain}
        onSubmit={handleSubmit(onSubmit)}
      />
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (showBidAttention) {
            setOpenAttention(true)
          } else {
            handleSubmit(onSubmit)()
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label htmlFor="amount">Enter your bid:</label>
            <span className="text-gray-500 text-sm">
              Security Fee: {formatPrice(securityFee)}
            </span>
          </div>

          <div className={`flex items-center gap-4 ${errors.amount && 'mb-5'}`}>
            <button
              type="button"
              onClick={decreaseAmount}
              className="w-10 h-10 rounded-full text-lg cursor-pointer border border-blue-500 text-blue-500 font-bold"
            >
              -
            </button>
            <Input
              control={control}
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter bid amount"
              error={errors.amount}
              classNameInput="ring-blue-500 focus:outline-blue-500"
            />
            <button
              type="button"
              onClick={increaseAmount}
              className="w-10 h-10 rounded-full text-lg cursor-pointer border border-blue-500 text-blue-500 font-bold"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="px-8 py-2 uppercase bg-blue-500 text-white hover:bg-blue-600">
            Bid
          </Button>
        </div>
      </form>
    </>
  )
}
export default BidForm
