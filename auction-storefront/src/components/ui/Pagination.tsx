import { useEffect, useState } from 'react'
import cn from '../../utils/cn'

interface PaginationProps {
  pageNum: number
  totalPages: number
  onPageChange: (pageNum: number) => void
  className?: string
}

const Pagination = ({
  pageNum,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleFirstPage = () => {
    onPageChange(1)
  }

  const handleLastPage = () => {
    onPageChange(totalPages)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    let startPage = Math.max(pageNum - 1, 1)
    let endPage = Math.min(pageNum + 1, totalPages)

    if (isSmallScreen) {
      // Small Screen: 3 buttons
      startPage = Math.max(
        pageNum === totalPages ? pageNum - 2 : pageNum - 1,
        1
      )
      endPage = Math.min(pageNum === 1 ? pageNum + 2 : pageNum + 1, totalPages)
    } else {
      // 5 buttons
      startPage = Math.max(
        pageNum === totalPages ? pageNum - 3 : pageNum - 2,
        1
      )
      endPage = Math.min(pageNum === 1 ? pageNum + 3 : pageNum + 2, totalPages)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={pageNum === i}
          className={`px-4 py-1 border border-gray-500 rounded ${
            pageNum === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          }`}
        >
          {i}
        </button>
      )
    }
    return pageNumbers
  }

  return (
    <div
      className={cn(
        'font-semibold flex justify-center items-center gap-1',
        className
      )}
    >
      <button
        onClick={handleFirstPage}
        disabled={pageNum === 1}
        className="px-2 py-1 border border-gray-500 rounded bg-white  text-blue-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        First
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleLastPage}
        disabled={pageNum === totalPages}
        className="px-2 py-1 border border-gray-500 rounded bg-white text-blue-500 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        Last
      </button>
    </div>
  )
}

export default Pagination
