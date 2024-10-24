import { useAppSelector } from '../store/hooks'
import { selectCategory } from '../features/category/category.slice'
import DropDown from '../components/ui/DropDown'
import { Link } from 'react-router-dom'
import Banner from '../components/home/Banner'
import { auctions } from '../utils/data'
import AuctionList from '../components/auction/AuctionList'

function Home() {
  const { categories } = useAppSelector(selectCategory)
  return (
    <div>
      <div className="container-lg mx-auto">
        <div className="flex items-center justify-center md:gap-12 lg:gap-20">
          <div className="w-full md:w-auto px-12 md:px-0">
            <DropDown
              renderDropDown={
                <ul className="bg-white text-slate-600 font-medium">
                  {categories?.map((cat) => {
                    return (
                      <li key={cat.id} className="">
                        <Link
                          to={`categories/${cat.slug}`}
                          className="pl-4 pr-2 w-full md:min-w-[180px] py-2.5 text-sm block text-gray-700 font-semibold hover:bg-yellow-500 hover:text-white"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    )
                  })}
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
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-semibold">Jewelry & Watches</h2>
            <div>
              <Link
                to="/"
                className="text-blue-700 hover:text-blue-500 underline"
              >
                View more
              </Link>
            </div>
          </div>
          <AuctionList auctions={auctions} />
        </section>

        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-semibold">Jewelry & Watches</h2>
            <div>
              <Link
                to="/"
                className="text-blue-700 hover:text-blue-500 underline"
              >
                View more
              </Link>
            </div>
          </div>
          <AuctionList auctions={auctions} />
        </section>
      </div>
    </div>
  )
}
export default Home
