import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { getLocalTimeZone, today, parseZonedDateTime, now } from '@internationalized/date'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input, DatePicker, RadioGroup, Radio, Select, SelectItem } from '@nextui-org/react'
import Editor from '~/components/Editor'
import FileInput from '~/components/FileInput'
import useAppDispatch from '~/app/hooks/useAppDispatch'
import useAppSelector from '~/app/hooks/useAppSelector'
import { fetchPublishedCategories } from '~/app/features/category'
import { validateImage } from '~/utils/helper'
import { uploadAuctionImageAPI } from '~/app/features/auction/service'
import { AuctionPayload, auctionSchema } from '~/app/features/auction/type'
import { APIError } from '~/app/features/error/type'
import { createAuction } from '~/app/features/auction'

const AuctionAdd = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading: isCreating } = useAppSelector((state) => state.auction)
  const { categories, isLoading } = useAppSelector((state) => state.category)
  const [image, setImage] = useState<File | null>(null)
  const [extraImages, setExtraImages] = useState<File[]>([])
  const [minEndingTime, setMinEndingTime] = useState<string>('')

  const {
    control,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(auctionSchema),
    defaultValues: {
      name: '',
      type: 'ENGLISH',
      // startingTime: '2024-11-20T09:28:30[Asia/Ho_Chi_Minh]',
      startingTime: now(getLocalTimeZone()).toString(),
      // endingTime: getDateTime(1),
      endingTime: now(getLocalTimeZone()).add({ days: 1 }).toString()
    }
  })

  const type = watch('type')
  const startingTime = watch('startingTime')

  useEffect(() => {
    if (startingTime) {
      setValue('endingTime', parseZonedDateTime(startingTime).add({ days: 1 }).toString())
      setMinEndingTime(parseZonedDateTime(startingTime).add({ days: 1 }).toString())
    }
  }, [startingTime, setValue])

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => <SelectItem key={cat.id}>{cat.name}</SelectItem>)
  }, [categories])

  const previewImage = useMemo(() => {
    return image ? URL.createObjectURL(image) : '/default-image.png'
  }, [image])

  const previewExtraImages = useMemo(() => {
    return extraImages.map((img) => URL.createObjectURL(img))
  }, [extraImages])

  useEffect(() => {
    dispatch(fetchPublishedCategories())
  }, [dispatch])

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(previewImage)
      previewExtraImages.forEach((img) => URL.revokeObjectURL(img))
    }
  }, [image, previewExtraImages, previewImage])

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]

        validateImage(file).then((result) => {
          if (result.isValid) {
            setImage(file)
            setError('mainImageId', { type: 'manual', message: '' })
          } else {
            setError('mainImageId', { type: 'manual', message: result.errorMessage || 'Invalid Image' })
          }
        })
      }
    },
    [setError]
  )

  const handleExtraImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files)

        const validationResults = await Promise.all(filesArray.map((file) => validateImage(file)))

        const invalidFile = validationResults.find((result) => !result.isValid)
        if (invalidFile) {
          const invalidIndex = validationResults.indexOf(invalidFile)
          setError('imageIds', { type: 'manual', message: `File ${invalidIndex + 1}: ${invalidFile.errorMessage}` })
          return
        }

        setError('imageIds', { type: 'manual', message: '' })
        setExtraImages((prevImages) => [...prevImages, ...filesArray])
      }
    },
    [setError]
  )

  const handleRemoveImage = useCallback((index: number) => {
    setExtraImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }, [])

  const onSubmit = async (data: AuctionPayload) => {
    if (!image) {
      setError('mainImageId', { type: 'manual', message: 'Main image is required' })
      return
    }
    try {
      const media = await uploadAuctionImageAPI(image)
      data.mainImageId = media.id
    } catch (err) {
      setError('mainImageId', {
        type: 'manual',
        message: (err as APIError)?.message || 'Failed to upload main image'
      })
    }

    if (extraImages.length !== 0) {
      try {
        const extraMedias = await Promise.all(extraImages.map(uploadAuctionImageAPI))
        data.imageIds = extraMedias.map((media) => media.id)
      } catch (err) {
        setError('imageIds', {
          type: 'manual',
          message: (err as APIError)?.message || 'Failed to upload extra images'
        })
      }
    }
    console.log(data)

    dispatch(createAuction(data))
      .unwrap()
      .then(() => {
        toast.success('Auction created successfully')
        navigate('/auctions')
      })
      .catch((err) => {
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((key) => {
            setError(key as keyof AuctionPayload, {
              type: 'manual',
              message: err.fieldErrors[key]
            })
          })
        }
      })
  }

  return (
    <section className='xl:px-20 pb-20'>
      <h1 className='text-2xl text-center mb-8'>Create New Auction</h1>
      <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4'>
          <div>
            <div className='input-box'>
              <label htmlFor='name'>Name</label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input aria-label='name' variant='bordered' id='name' radius='sm' {...field} />}
              />
            </div>
            {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
          </div>
          <div>
            <div className='input-box'>
              <label htmlFor='description'>Description</label>
              <Controller
                name='description'
                control={control}
                render={({ field: { onChange, value } }) => <Editor value={value || ''} setValue={onChange} />}
              />
            </div>
            {errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
          </div>
          <div>
            <div className='input-box'>
              <label htmlFor='type'>Auction Type</label>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <RadioGroup aria-label='auction-type' orientation='horizontal' id='type' {...field}>
                    <Radio value='ENGLISH'>English</Radio>
                    <Radio value='SEALED_BID'>Sealed bid</Radio>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.type && <p className='text-red-500 text-sm'>{errors.type.message}</p>}
          </div>

          <div className='flex sm:flex-col md:flex-row md:w-full xl:w-1/2 gap-2'>
            <div>
              <div className='input-box w-full'>
                <label htmlFor='startingPrice'>Starting Price</label>
                <Controller
                  name='startingPrice'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      aria-label='starting-price'
                      id='startingPrice'
                      type='number'
                      variant='bordered'
                      placeholder='0.00'
                      className='max-w-xs'
                      startContent={
                        <div className='pointer-events-none flex items-center'>
                          <span className='text-default-400 text-small'>$</span>
                        </div>
                      }
                      min={0}
                      value={`${value}`}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              {errors.startingPrice && <p className='text-red-500 text-sm'>{errors.startingPrice.message}</p>}
            </div>
            {type === 'ENGLISH' && (
              <div>
                <div className='input-box w-full'>
                  <label htmlFor='stepPrice'>Step Price</label>
                  <Controller
                    name='stepPrice'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        aria-label='step-price'
                        id='stepPrice'
                        variant='bordered'
                        type='number'
                        placeholder='0.00'
                        className='max-w-xs'
                        startContent={
                          <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>$</span>
                          </div>
                        }
                        min={0}
                        value={`${value}`}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                {errors.stepPrice && <p className='text-red-500 text-sm'>{errors.stepPrice.message}</p>}
              </div>
            )}
          </div>

          <div className='flex sm:flex-col md:flex-row md:w-full xl:w-1/2 gap-2'>
            <div>
              <div className='input-box w-full'>
                <label htmlFor='startingTime'>Starting Time</label>
                <Controller
                  name='startingTime'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      aria-label='starting-time'
                      id='startingTime'
                      variant='bordered'
                      minValue={today(getLocalTimeZone())}
                      hideTimeZone
                      showMonthAndYearPickers
                      className='max-w-xs'
                      value={parseZonedDateTime(value)}
                      onChange={(val) => onChange(val.toString())}
                    />
                  )}
                />
              </div>
              {errors.startingTime && <p className='text-red-500 text-sm'>{errors.startingTime.message}</p>}
            </div>
            <div>
              <div className='input-box w-full'>
                <label htmlFor='endingTime'>Ending Time</label>
                <Controller
                  name='endingTime'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      aria-label='ending-time'
                      id='endingTime'
                      variant='bordered'
                      minValue={minEndingTime ? parseZonedDateTime(minEndingTime) : today(getLocalTimeZone())}
                      hideTimeZone
                      showMonthAndYearPickers
                      className='max-w-xs'
                      // value={parseDateTime(value)}
                      // onChange={(val) => onChange(val.toString())}
                      value={parseZonedDateTime(value)}
                      onChange={(val) => onChange(val.toString())}
                    />
                  )}
                />
              </div>
              {errors.endingTime && <p className='text-red-500 text-sm'>{errors.endingTime.message}</p>}
            </div>
          </div>
          <div>
            <div className='input-box'>
              <label htmlFor='category'>Category</label>
              <Controller
                name='categoryId'
                control={control}
                render={({ field }) => (
                  <Select
                    aria-label='category'
                    isDisabled={isLoading}
                    placeholder='Select Category'
                    variant='bordered'
                    className='max-w-xs'
                    {...field}
                  >
                    {categoryOptions}
                  </Select>
                )}
              />
            </div>
            {errors.categoryId && <p className='text-red-500 text-sm'>{errors.categoryId.message}</p>}
          </div>
          <div>
            <div className='input-box'>
              <label htmlFor='image'>Main Image</label>
              <FileInput previewImage={previewImage} handleImageChange={handleImageChange} />
            </div>
            {errors.mainImageId && <p className='text-red-500 text-sm'>{errors.mainImageId.message}</p>}
          </div>
          <div>
            <div className='input-box'>
              <label>Extra Images</label>
              <FileInput
                previewImages={previewExtraImages}
                handleRemoveImage={handleRemoveImage}
                handleImagesChange={handleExtraImageChange}
                multiple
              />
            </div>
            {errors.imageIds && <p className='text-red-500 text-sm'>{errors.imageIds.message}</p>}
          </div>
        </div>

        <div className='flex items-center justify-center gap-4'>
          <Button className='min-w-32' color='primary' type='submit' isLoading={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
          <Button className='min-w-32' onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}

export default memo(AuctionAdd)
