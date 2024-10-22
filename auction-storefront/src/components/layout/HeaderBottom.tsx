import { Link } from 'react-router-dom'
import LOGO from '../../assets/logo.svg'
import { FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectCategory } from '../../features/category/category.slice'
import { useEffect } from 'react'
import { getListCategories } from '../../features/category/category.thunk'

function HeaderBottom() {
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector(selectCategory)

  useEffect(() => {
    dispatch(getListCategories())
  }, [dispatch])

  return (
    <div className="border-y-2 shadow-sm py-2">
      <div className="container-lg mx-auto px-6">
        <div className="flex items-center justify-center gap-8 md:gap-12 xl:gap-32">
          <Link to="/">
            <img
              src={LOGO}
              alt="Logo"
              className="hidden md:block md:w-204 lg:w-40"
            />
          </Link>
          <div className="flex border-2 py-2 items-center relative gap-6 text-black border-blue-700 rounded-md">
            <div className="hidden lg:block divider-next after:bg-gray-400">
              <select className=" text-slate-600 font-semibold  px-2 outline-0 border-none">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              className="w-full xl:min-w-[520px] relative bg-transparent text-slate-500 outline-0 pl-2 pr-28  h-full"
              type="text"
              placeholder="Search for anything"
            />
            <button className="text-sm md:text-base bg-blue-700 right-0 absolute px-4 h-full font-semibold uppercase text-white rounded-e-sm">
              Search
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl p-2 shadow-md">
            <div className="flex items-center gap-2 w-[100px]">
              <FaMoneyBillWave className="text-green-600" size={20} />
              <span className="text-black text-sm font-semibold truncate">
                10,000,000
              </span>
            </div>
            <Link to="#">
              <FaPlusCircle
                className="text-blue-600 bg-transparent overflow-hidden"
                size={20}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HeaderBottom
