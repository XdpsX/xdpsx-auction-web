import HeaderBottom from './HeaderBottom'
import HeaderTop from './HeaderTop'
import { useState } from 'react'
import MainSideBar from './MainSideBar'

function MainHeader() {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <header>
      <HeaderTop setShowSidebar={setShowSidebar} />
      <HeaderBottom />
      <MainSideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    </header>
  )
}
export default MainHeader
