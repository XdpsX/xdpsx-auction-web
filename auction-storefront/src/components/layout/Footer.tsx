import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container-lg mx-auto px-6 md:px-20">
        <div className="flex flex-wrap gap-6 justify-between border-b-[1px] py-6">
          <div>
            <h2 className="font-bold text-lg mb-2">Buy</h2>
            <ul className="flex flex-col gap-2 text-slate-600 text-sm font-semibold">
              <li>
                <Link to="#" className="hover:underline">
                  Registration
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Bidding & buying help
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Stores
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  eBay for Charity
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Charity Shop
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2">Sell</h2>
            <ul className="flex flex-col gap-2 text-slate-600 text-sm font-semibold">
              <li>
                <Link to="#" className="hover:underline">
                  How to sell
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Business sellers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2">About</h2>
            <ul className="flex flex-col gap-2 text-slate-600 text-sm font-semibold">
              <li>
                <Link to="#" className="hover:underline">
                  Company info
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  News
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Investors
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Diversity & Inclusion
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-start gap-4 w-[480px]">
            <div>
              <h2 className="font-bold text-lg">Update Information</h2>
              <p>Register email to get newest information</p>
            </div>
            <div className="h-[50px] w-full bg-white border relative">
              <input
                className="h-full bg-transparent w-full px-3 outline-0"
                type="text"
                placeholder="Enter your email"
              />
              <button className="h-full absolute right-0 bg-yellow-500 text-white uppercase px-6 font-bold text-sm">
                Send
              </button>
            </div>
            <ul className="flex justify-start items-center gap-3">
              <li>
                <a
                  className="w-[38px] h-[38px] shadow-md hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full"
                  href="#"
                >
                  <FaFacebookF />
                </a>
              </li>

              <li>
                <a
                  className="w-[38px] h-[38px] shadow-md hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full"
                  href="#"
                >
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a
                  className="w-[38px] h-[38px] shadow-md hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full"
                  href="#"
                >
                  <FaLinkedin />
                </a>
              </li>
              <li>
                <a
                  className="w-[38px] h-[38px] shadow-md hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full"
                  href="#"
                >
                  <FaGithub />{' '}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center items-center text-slate-600 mx-auto pt-4 text-center">
          <span>Copiright @{new Date().getFullYear()} All Rights Reserved</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
