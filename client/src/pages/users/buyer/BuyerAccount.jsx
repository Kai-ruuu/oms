import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout } from '../../../helpers/auth';

import BuyerSidebar from '../../../components/users/buyer/BuyerSidebar';

export default function BuyerHome({ sidebarOn, setSidebarOn }) {
  const { width, height } = useViewport()
  const [breakpoint, setGetBreakpoint] = useState(null)

  const routeName = "account"
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
    if (!isUserVerified())
      navigator(routes.global.unauthorized)
  }, [])
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [width])
  
  return (
    <div className="w-screen h-[100dvh] bg-gray-100 text-md md:text-lg text-gray-600 flex flex-col">
      <nav className='p-4 bg-gray-900 text-gray-300 flex items-center justify-between z-50 shadow-md'>
        <div className='flex items-center space-x-4'>
            <span
            onClick={() => { setSidebarOn(!sidebarOn) }}
            className="material-symbols-outlined cursor-pointer">{sidebarOn ? "menu_open" : "menu"}</span>
            <h1 className='font-bold text-xl'>KZC</h1>
        </div>
        <section className='flex items-center space-x-6'>
          <button
          onClick={logout}
          className='hover:underline cursor-pointer'>Logout</button>
        </section>
      </nav>
      <div className='relative flex-grow flex'>
        <BuyerSidebar on={sidebarOn} active={routeName} handler={setSidebarOn}></BuyerSidebar>

        <div className='p-6 flex flex-col items-stretch space-y-4 flex-grow max-h-1/1'>
          <div className='w-full flex-grow bg-white rounded-sm shadow-md'>
            
          </div>
        </div>
      </div>
    </div>
  );
}

