import { yupResolver } from '@hookform/resolvers/yup'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { selectUser } from '../../features/user/user.slice'
import { ProfilePayload, profileSchema } from '../../models/user.type'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import DEFAULT_AVATAR from '../../assets/default-user-icon.png'
import FileInput from '../../components/ui/FileInput'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_AVATAR_SIZE,
  MIN_AVATAR_WIDTH,
} from '../../constants/files'
import { uploadUserAvatarAPI } from '../../features/user/user.service'
import { toast } from 'react-toastify'
import { APIError } from '../../models/error.type'
import { updateUserProfile } from '../../features/user/user.thunk'

function Profile() {
  const dispatch = useAppDispatch()
  const { userProfile, isLoading } = useAppSelector(selectUser)
  const [image, setImage] = useState<File | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: userProfile?.name || '',
      mobileNumber: userProfile?.mobileNumber || '',
      address: userProfile?.address || '',
    },
  })

  const previewImage = useMemo(() => {
    if (!image) {
      return userProfile?.avatarUrl ? userProfile.avatarUrl : DEFAULT_AVATAR
    }
    return image && URL.createObjectURL(image)
  }, [image, userProfile?.avatarUrl])

  const onImageChange = (file?: File) => {
    if (file) setImage(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  const onSubmit = async (data: ProfilePayload) => {
    if (image) {
      try {
        const avatar = await uploadUserAvatarAPI(image)
        data.imageId = avatar.id
      } catch (err) {
        toast.error((err as APIError)?.message || 'Failed to upload avatar')
        return
      }
    }

    dispatch(updateUserProfile(data))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully')
        setImage(null)
      })
  }

  return (
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          My Profile
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Manage your profile information
        </div>
      </div>

      <form
        className="mt-8 flex flex-col-reverse md:flex-row md:items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className="flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Email
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <div className="pt-3 text-gray-700">{userProfile?.email}</div>
            </div>
          </div>
          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Name
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                name="name"
                error={errors.name}
                control={control}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Mobile Number
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                name="mobileNumber"
                error={errors.mobileNumber}
                control={control}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Address
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                name="address"
                error={errors.address}
                control={control}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button
                disabled={isLoading}
                className="bg-blue-500 min-w-20"
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:w-72 md:border-l md:border-l-gray-200">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-2 relative">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full rounded-full object-cover"
              />
              {image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute bg-red-400 w-6 h-6 rounded-full top-0 right-0 text-sm text-white"
                >
                  X
                </button>
              )}
            </div>
            <FileInput
              onChange={onImageChange}
              maxSize={MAX_AVATAR_SIZE}
              fileTypes={ALLOWED_IMAGE_TYPES}
              minWidth={MIN_AVATAR_WIDTH}
            />
            <div className="mt-3 text-gray-400 text-sm">
              <div>Max image size is 1MB</div>
              <div>JPG or PNG format</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
export default Profile
