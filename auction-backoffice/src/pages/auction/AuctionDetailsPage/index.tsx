import { Chip, Tab, Tabs } from '@nextui-org/react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchAuctionDetailsAsync } from '~/app/features/auction'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import LoadingOverlay from '~/components/LoadingOverlay'
import { formatDateTime, formatPrice } from '~/utils/format'
import { capitalize } from '~/utils/helper'
import DOMPurify from 'dompurify'

function AuctionDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { auctionDetailsGet, isLoading } = useAppSelector((state) => state.auction)

  useEffect(() => {
    if (!id) return
    dispatch(fetchAuctionDetailsAsync(+id))
      .unwrap()
      .catch(() => navigate('/'))
  }, [dispatch, id, navigate])

  if (isLoading) return <LoadingOverlay />
  if (!auctionDetailsGet) return null

  const { auctionContent: auction, highestBid } = auctionDetailsGet

  return (
    <section className='flex flex-col gap-12'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='page-heading'>Auction Details</h1>
      </div>

      <div className='flex w-full flex-col'>
        <Tabs size='lg' aria-label='Auction Details'>
          <Tab key='info' title='Info'>
            <div className='space-y-8 md:px-8 max-w-[1000px] '>
              <div className='flex gap-5 flex-col'>
                <div className='flex gap-5 justify-start items-center text-slate-600'>
                  <div className='flex gap-2'>
                    <div className='w-32'>
                      <img className='object-contain w-full h-full' src={auction.mainImage.url} alt='Auction Image' />
                    </div>
                    <div className='flex flex-col justify-start items-start'>
                      <p className='text-xl font-bold'>{auction.name}</p>
                      {auction.type === 'ENGLISH' ? (
                        <Chip className='bg-green-500/90 text-white'>{capitalize(auction.type)}</Chip>
                      ) : (
                        <Chip color='warning' className='dark:text-white'>
                          {capitalize(auction.type)}
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='md:grid md:grid-cols-4 gap-y-2 gap-x-3 items-center justify-center'>
                <span className='md:col-p-1 order-key'>Starting price:</span>
                <p className=' md:col-span-3 mb-4  md:mb-0'>{formatPrice(auction.startingPrice)}</p>

                {auction.type === 'ENGLISH' && (
                  <>
                    <span className='md:col-span-1 order-key'>Step price:</span>
                    <p className=' md:col-span-3 mb-4 md:mb-0'>{formatPrice(auction.stepPrice)}</p>
                  </>
                )}

                {highestBid && (
                  <>
                    <span className='md:col-span-1 order-key'>Highest Bid:</span>
                    <p className=' md:col-span-3 mb-4 md:mb-0'>{formatPrice(highestBid.amount)}</p>
                  </>
                )}

                <span className='md:col-span-1 order-key'>Starting Time:</span>
                <p className='md:col-span-3 mb-4 md:mb-0'>{formatDateTime(auction.startingTime)}</p>

                <span className='md:col-span-1 order-key'>Ending Time:</span>
                <p className='md:col-span-3 mb-4 md:mb-0'>{formatDateTime(auction.endingTime)}</p>

                <span className='md:col-span-1 order-key'>Status:</span>
                <p className='md:col-span-3 mb-4 md:mb-0'>{auction.status}</p>
                {auction.trashed !== null && (
                  <>
                    <span className='md:col-span-1 order-key'>Trashed:</span>
                    <p className='md:col-span-3 mb-4 md:mb-0'>{auction.trashed ? 'True' : 'False'}</p>
                  </>
                )}
                {auction.published !== null && (
                  <>
                    <span className='md:col-span-1 order-key'>Published:</span>
                    <p className='md:col-span-3 mb-4 md:mb-0'>{auction.published ? 'True' : 'False'}</p>
                  </>
                )}

                <span className='md:col-span-1 order-key'>Category:</span>
                <p className='md:col-span-3'>{auction.category}</p>
              </div>
            </div>
          </Tab>
          <Tab key='images' title='Images'>
            <div className='flex flex-wrap gap-4'>
              {auction.images.map((image) => (
                <div className='w-60 border-2 p-2'>
                  <img key={image.id} src={image.url} alt='Auction Image' className='w-full h-full object-cover' />
                </div>
              ))}
            </div>
          </Tab>
          <Tab key='description' title='Description'>
            <div className='border p-2'>
              {auction.description && (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(auction.description) }} />
              )}
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className='flex justify-center'>
        <button onClick={() => navigate(-1)} className='bg-default-200 text-default-800 px-4 py-2 text-lg'>
          Back
        </button>
      </div>
    </section>
  )
}
export default AuctionDetailsPage
