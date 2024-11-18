import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'

interface FileInputProps {
  onChange?: (file?: File) => void
  fileTypes?: string[]
  minWidth?: number
  maxSize?: number
  setError?: (message: string) => void
}

interface ImageValidationResult {
  isValid: boolean
  errorMessage: string | null
}

function FileInput({
  onChange,
  fileTypes,
  minWidth,
  maxSize,
  setError,
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const validateFile = useCallback(
    (file: File): Promise<ImageValidationResult> => {
      return new Promise((resolve) => {
        if (fileTypes && !fileTypes.includes(file.type)) {
          return resolve({
            isValid: false,
            errorMessage: 'Invalid file type',
          })
        }

        if (minWidth) {
          const image = new Image()
          image.src = URL.createObjectURL(file)
          return new Promise((resolve) => {
            image.onload = () => {
              if (image.width < minWidth) {
                resolve({
                  isValid: false,
                  errorMessage: `Minimum width is ${minWidth}px`,
                })
              } else {
                resolve({
                  isValid: true,
                })
              }
            }
          }).finally(() => {
            // URL.revokeObjectURL(image.src)
          })
        }
      })
    },
    [fileTypes, minWidth]
  )

  const validateFileWithToast = (file: File): boolean => {
    if (fileTypes && !fileTypes.includes(file.type)) {
      toast.error('Only JPEG and PNG images are allowed')
      return false
    }

    if (maxSize && file.size > maxSize) {
      toast.error(`Maximum file size is ${maxSize / 1024 / 1024}MB`)
      return false
    }

    if (minWidth) {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      image.onload = () => {
        if (image.width < minWidth) {
          toast.error(`Minimum width is ${minWidth}px`)
          URL.revokeObjectURL(image.src)
          return false
        }
        URL.revokeObjectURL(image.src)
      }
    }
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      fileInputRef.current?.setAttribute('value', '')

      // validateFile(file).then((result) => {
      //   if (result.isValid && setError) {
      //     setError('')
      //   } else {
      //     if (setError) {
      //       setError(result.errorMessage || 'Invalid Image')
      //     }
      //   }
      // })

      if (!validateFileWithToast(file)) {
        return
      }

      if (onChange) {
        onChange(file)
      }
    }
  }

  return (
    <>
      <input
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        onChange={handleFileChange}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value = null
        }}
      />
      <button
        className="flex h-10 items-center justify-end rounded-md border bg-white px-6 text-sm text-gray-600 shadow-sm"
        type="button"
        onClick={handleFileClick}
      >
        Upload
      </button>
    </>
  )
}
export default FileInput
