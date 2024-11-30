import { useRef, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import cn from '../../utils/cn'

interface DropDownProps {
  children: React.ReactNode
  renderDropDown: React.ReactNode
  className?: string
  endIconClassName?: string
}

function DropDown({
  children,
  renderDropDown,
  className,
  endIconClassName,
}: DropDownProps) {
  const [showDropDown, setShowDropDown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  return (
    <>
      {showDropDown && (
        <div
          className="absolute z-[10] w-full h-full"
          onClick={() => setShowDropDown(false)}
        ></div>
      )}
      <div className="relative ">
        <div
          onClick={() => setShowDropDown(!showDropDown)}
          className={cn(
            'flex items-center justify-center md:px-2 py-4 gap-3 cursor-pointer',
            className
          )}
        >
          {children}
          {showDropDown ? (
            <FaChevronUp className={endIconClassName} />
          ) : (
            <FaChevronDown className={endIconClassName} />
          )}
        </div>

        <div
          ref={dropdownRef}
          style={{
            height: showDropDown
              ? `${dropdownRef.current && dropdownRef.current.scrollHeight}px`
              : '0px',
          }}
          className={`absolute z-[10] top-full w-full md:w-auto left-0 overflow-hidden transition-all duration-500 shadow-md`}
        >
          {renderDropDown}
        </div>
      </div>
    </>
  )
}
export default DropDown
