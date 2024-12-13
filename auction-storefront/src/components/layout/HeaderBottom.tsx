import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LOGO from '../../assets/logo.svg'
import { FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  getListCategoriesAsync,
  selectCategory,
} from '../../features/category/slice'

import { formatPrice } from '../../utils/format'
import { selectWallet, setWallet } from '../../features/wallet/slice'
import { Client } from '@stomp/stompjs'
import { Wallet } from '../../models/wallet.type'
import SockJS from 'sockjs-client'
import socketUrl from '../../utils/socket'

function HeaderBottom() {
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector(selectCategory)
  const { wallet } = useAppSelector(selectWallet)
  const navigate = useNavigate()
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [keyword, setKeyword] = useState<string>('')

  useEffect(() => {
    dispatch(getListCategoriesAsync())
  }, [dispatch])

  useEffect(() => {
    if (!wallet) return

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        stompClient.subscribe(`/topic/wallet/${wallet.id}`, (message) => {
          const newWallet: Wallet = JSON.parse(message.body)
          dispatch(setWallet(newWallet))
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error: ', frame)
      },
    })

    stompClient.activate()
    return () => {
      stompClient.deactivate()
      console.log('Disconnected')
    }
  }, [wallet, dispatch])

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!keyword) return
    console.log(categoryId)
    if (!categoryId) {
      navigate(`/search?keyword=${keyword}&categoryId=all`)
    }
    navigate(`/search?keyword=${keyword}&categoryId=${categoryId}`)
    setKeyword('')
  }

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
          <form
            onSubmit={onSearch}
            className="flex border-2 py-2 items-center relative gap-6 text-black border-blue-700 rounded-md"
          >
            <div className="hidden lg:block divider-next after:bg-gray-400">
              <select
                onChange={(e) => setCategoryId(+e.target.value)}
                className=" text-slate-600 font-semibold  px-2 outline-0 border-none"
              >
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              // onClick={onSearch}
              className="text-sm md:text-base bg-blue-700 right-0 absolute px-4 h-full font-semibold uppercase text-white rounded-e-sm"
            >
              Search
            </button>
          </form>
          {wallet ? (
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl p-2 shadow-md">
              <div className="flex items-center gap-2 w-[100px]">
                <FaMoneyBillWave className="text-green-600" size={20} />
                <span className="text-black text-sm font-semibold truncate">
                  {formatPrice(wallet.balance)}
                </span>
              </div>
              <Link to="/wallet/deposit">
                <FaPlusCircle
                  className="text-blue-600 bg-transparent overflow-hidden"
                  size={20}
                />
              </Link>
            </div>
          ) : (
            <div className="w-[100px]"></div>
          )}
        </div>
      </div>
    </div>
  )
}
export default HeaderBottom
