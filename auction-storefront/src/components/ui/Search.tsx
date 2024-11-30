import { FormEvent, useState } from 'react'
import { FaEraser, FaSearch } from 'react-icons/fa'

interface SearchProps {
  keyword: string
  onSubmit: (keyword: string) => void
  onClear: () => void
  placeholder?: string
}

function Search({ keyword, onSubmit, onClear, placeholder }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState(keyword || '')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(searchTerm)
    // setSearchTerm('')
  }

  const handleClear = () => {
    setSearchTerm('')
    onClear()
  }

  return (
    <form
      onSubmit={handleSearch}
      className="border border-gray-400 inline-flex justify-between items-center bg-white rounded-md"
    >
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        className="px-2 focus:border-blue-500 outline-none rounded-s-md text-black"
        type="text"
        placeholder={placeholder || 'Search...'}
      />
      <button
        type="submit"
        className="text-center text-white bg-blue-500 p-2 transition-colors hover:bg-blue-600"
      >
        <FaSearch title="Search" />
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="text-center text-white bg-gray-400 p-2 rounded-e-md transition-colors hover:bg-gray-500"
      >
        <FaEraser title="Clear" />
      </button>
    </form>
  )
}
export default Search
