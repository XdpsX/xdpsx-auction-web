import { useRef, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface DropDownProps {
  children: React.ReactNode
  renderDropDown: React.ReactNode
  className?: string
}

function DropDown({ children, renderDropDown, className }: DropDownProps) {
  const [showDropDown, setShowDropDown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="relative">
      <div
        onClick={() => setShowDropDown(!showDropDown)}
        className={`flex items-center justify-center md:px-2 py-4 gap-3 cursor-pointer ${className}`}
      >
        {children}
        {showDropDown ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      <div
        ref={dropdownRef}
        style={{
          height: showDropDown
            ? `${dropdownRef.current && dropdownRef.current.scrollHeight}px`
            : '0px',
        }}
        className={`absolute z-[9999] top-full w-full md:w-auto left-0 overflow-hidden transition-all duration-500 shadow-md`}
      >
        {renderDropDown}
      </div>
    </div>
  )
}
export default DropDown
