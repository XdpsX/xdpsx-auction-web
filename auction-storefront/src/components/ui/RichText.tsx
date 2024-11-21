import { useState } from 'react'
import DOMPurify from 'dompurify'

interface RichTextProps {
  label?: string
  description: string
  maxHeight?: number
}
const RichText = ({ label, description, maxHeight = 80 }: RichTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  // Kiểm tra chiều dài của mô tả
  const isLongDescription = description.length > maxHeight

  return (
    <div>
      {label && (
        <h3 className="text-3xl font-bold text-gray-800 mb-4">{label}</h3>
      )}
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isExpanded ? 'h-auto' : 'h-20'
        }`}
      >
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
        />
        {!isExpanded && isLongDescription && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 to-transparent" />
        )}
      </div>
      {isLongDescription && (
        <div className="text-center">
          <button onClick={toggleDescription} className="text-blue-500 mt-2">
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  )
}

export default RichText
