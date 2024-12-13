import { useAppSelector } from '../store/hooks'
import { selectCategory } from '../features/category/slice'
import DropDown from '../components/ui/DropDown'
import { Link } from 'react-router-dom'
import Banner from '../components/ui/Banner'
import AuctionList from '../components/auction/AuctionList'
import { useEffect, useMemo, useState, useRef } from 'react'
import { Auction } from '../models/auction.type'
import { Page } from '../models/page.type'
import { fetchCategoryAuctionsAPI } from '../features/auction/service'

const NUMBER_CATEGORIES = 3

interface CategoryAuction {
  categoryId: number
  page: Page<Auction>
}

function Home() {
  const { categories } = useAppSelector(selectCategory)
  const [categoryAuction, setCategoryAuction] = useState<CategoryAuction[]>([])

  const renderedCategoryIds = useRef<Set<number>>(new Set())

  const categoryIds = useMemo(() => {
    return [...new Set(categories?.map((cat) => cat.id))]
  }, [categories])

  useEffect(() => {
    const fetchData = async () => {
      for (const categoryId of categoryIds) {
        if (!renderedCategoryIds.current.has(categoryId)) {
          try {
            const auctionPage = await fetchCategoryAuctionsAPI(categoryId, 1, 8)
            setCategoryAuction((prev) => [
              ...prev,
              { categoryId, page: auctionPage },
            ])

            renderedCategoryIds.current.add(categoryId)
          } catch (error) {
            console.log('Failed to fetch auctions: ', error)
          }
        }
      }
    }

    if (categoryIds.length > 0 && categoryAuction.length === 0) {
      fetchData()
    }
  }, [categoryIds, categoryAuction])

  useEffect(() => {
    return () => {
      setCategoryAuction([])
      renderedCategoryIds.current.clear()
    }
  }, [])

  return (
    <div>
      <div className="mx-auto bg-gray-50 pb-2">
        <div className="flex items-center justify-center md:gap-12 lg:gap-20 border-b-2 border-gray-200">
          <div className="w-full md:w-auto px-12 md:px-0">
            <DropDown
              renderDropDown={
                <ul className="bg-white text-slate-600 font-medium">
                  {categories?.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`categories/${cat.slug}`}
                        className="pl-4 pr-2 w-full md:min-w-[180px] py-2.5 text-sm block text-gray-700 font-semibold hover:bg-yellow-500 hover:text-white"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              }
            >
              <div className="text-sm font-semibold hover:text-gray-700/85 transition-colors">
                All Categories
              </div>
            </DropDown>
          </div>
          <div className="text-sm font-semibold hidden md:flex items-center md:gap-8 lg:gap-16">
            <Link to="/" className="hover:text-gray-700/85 transition-colors">
              Newest Auctions
            </Link>
            <Link to="/" className="hover:text-gray-700/85 transition-colors">
              Hot Auctions
            </Link>
            <Link to="/" className="hover:text-gray-700/85 transition-colors">
              English Auctions
            </Link>
            <Link to="/" className="hover:text-gray-700/85 transition-colors">
              Sealed-bid Auctions
            </Link>
          </div>
        </div>
        <Banner />
      </div>

      <div className="container mx-auto py-20 px-8 lg:px-20 space-y-10">
        <section>
          {categoryAuction.map((catAuction, index) => {
            const category = categories?.find(
              (cat) => cat.id === catAuction.categoryId
            )
            const page = catAuction.page
            if (page.items.length === 0 || !category) return null
            return (
              <div key={index} className="mb-10">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-2xl font-semibold">{category.name}</h2>
                  <Link
                    to={`/categories/${category.slug}`}
                    className="text-blue-700 hover:text-blue-500 underline text-sm"
                  >
                    View more
                  </Link>
                </div>
                <AuctionList auctions={page.items} />
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}

export default Home
