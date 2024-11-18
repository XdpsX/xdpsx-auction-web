import { useRef } from 'react'

interface FileInputProps {
  previewImage?: string
  handleImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  multiple?: boolean
  previewImages?: string[]
  handleRemoveImage?: (index: number) => void
  handleImagesChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  numberImages?: number
}

function FileInput({
  previewImage,
  handleImageChange,
  multiple = false,
  previewImages,
  handleRemoveImage,
  handleImagesChange,
  numberImages = 5
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  if (!multiple) {
    return (
      <>
        <div onClick={handleFileClick} className='w-32 h-32 cursor-pointer'>
          <img src={previewImage} alt='Preview' className='w-32 h-32 object-cover' />
        </div>
        <input
          type='file'
          id='image'
          accept='.jpg,.jpeg,.png'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </>
    )
  }

  if (!previewImages || !handleRemoveImage || !handleImagesChange) {
    console.error('previewImages, handleRemoveImage, and handleImagesChange are required when multiple is true')
    return null
  }

  return (
    <>
      <div className='flex flex-wrap gap-2'>
        {previewImages.map((img, index) => (
          <div key={index} className='relative'>
            <img src={img} alt={`Extra ${index}`} className='w-32 h-32 object-cover' />
            <button
              type='button'
              onClick={() => handleRemoveImage(index)}
              className='absolute top-0 right-0 bg-red-500 text-white w-8 h-8 rounded-full p-1'
            >
              X
            </button>
          </div>
        ))}
        {previewImages.length < numberImages && (
          <div
            onClick={handleFileClick}
            className='w-32 h-32 flex items-center justify-center border border-dashed border-black cursor-pointer'
          >
            <span>+</span>
          </div>
        )}
      </div>
      <input
        type='file'
        ref={fileInputRef}
        accept='.jpg,.jpeg,.png'
        style={{ display: 'none' }}
        onChange={handleImagesChange}
        multiple
      />
    </>
  )
}
export default FileInput
