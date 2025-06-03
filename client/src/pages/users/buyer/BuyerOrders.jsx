import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout } from '../../../helpers/auth';

import BuyerSidebar from '../../../components/users/buyer/BuyerSidebar';

export default function BuyerOrders({ sidebarOn, setSidebarOn }) {
  const { width, height } = useViewport()
  const [breakpoint, setGetBreakpoint] = useState(null)

  const routeName = "my orders"

  const [orders, setOrders] = useState([])
  const [userData, setUserData] = useState(null)
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
    
    const [verified, _userData] = isUserVerified();

    if (!verified) {
      navigator(routes.global.unauthorized);

      return;
    }

    setUserData(_userData)
  }, [])

  useEffect(() => {
    if (userData) {
      ;(async () => {
         await getOrders()
      })()
    }
  }, [userData])
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [width])

  const getOrders = async () => {
   try {
      const response = await fetch(`http://${location.hostname}:3000/order/buyer/` + userData.user.id)
      const data = await response.json()

      if (response.status != 200) {
         alert("Failed to fetch your orders.")

         return
      }

      setOrders(data.orders)
   } catch (error) {
      console.error(error)
      alert("Failed to fetch your orders.")
   }
  }

  const cancelOrder = async orderID => {
    try {
      const updateBody = new FormData()

      updateBody.append("status", "cancelled")
      
      const respose = await fetch(`http://${location.hostname}:3000/order/edit/` + orderID, {
        method: "PATCH",
        body: updateBody
      })
      const data = await respose.json()

      if (respose.status != 200) {
        alert("Failed to cancel the order. Please try again.")

        return false
      }

      return true
    } catch (error) {
      console.log(error)
      alert("Failed to cancel the order. Please try again.")

      return false
    }
  }

  if (!orders)
    return null

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
            <div className='p-6 flex flex-col items-stretch space-y-4 flex-grow h-full w-full'>
               <div className='w-full h-full bg-white rounded-sm shadow-md flex flex-col relative'>
                  <section className='flex items-center justify-between space-x-2 p-6 pr-4 md:pr-6 md:space-x-12'>
                    <h1 className={`font-bold`}>My Cart</h1>
                  </section>
                  <div id='product-scroll' className={`relative max-h-[64dvh] overflow-y-scroll p-6 pt-0 grid gap-6 grid-cols-1`}>
                    {orders.map((order, index) => (
                        <div key={index} className='p-6 rounded-sm shadow-md flex flex-col md:flex-row md:space-x-4'>
                           <div className='flex items-center justify-center'>
                              <div
                              style={{ backgroundImage: `url(http://${location.hostname}:3000/file/variants/${order.variantInfo.image})` }}
                              className='w-full min-h-[20dvh] md:min-w-[10vw] md:min-h-[10vw] bg-center bg-cover bg-no-repeat rounded-sm'></div>
                           </div>
                           <div className='py-2 flex flex-col flex-grow justify-between h-full'>
                              <div className='flex items-center justify-between'>
                                 <p className='font-bold'>{order.productInfo.name}</p>
                                 <p className={`rounded-sm border px-2 py-1 text-sm ` + (() => {
                                    switch (order.status) {
                                       case "unprepared":
                                          return "text-yellow-400 border-yellow-400"
                                       case "for_delivery":
                                          return "text-blue-500 border-blue-500"
                                       case "delivered":
                                          return "text-green-500 border-green-500"
                                       default:
                                          return "text-red-500 border-red-500"
                                    }
                                 })() }>{(() => {
                                    switch (order.status) {
                                       case "unprepared":
                                          return "Processing"
                                       case "for_delivery":
                                          return "Shipping"
                                       case "delivered":
                                          return "Delivered"
                                       default:
                                          return "Cancelled"
                                    }
                                 })()}</p>
                              </div>

                              <p className='text-sm'>Variant: {order.variantInfo.name}</p>

                              <p className='text-sm'>Quantity: {order.quantity}</p>
                              
                              <div className='flex items-end justify-end'>
                                 <div className='flex items-center space-x-4'>
                                    <p>Total: <b>₱ {(order.quantity * order.variantInfo.price).toFixed(2)}</b></p>
                                    {order.status != "cancelled" && order.status != "delivered" && <button
                                    onClick={async () => {
                                       const isCacelled = await cancelOrder(order.id)

                                       if (isCacelled) {
                                          alert("Order Cancelled")
                                          setOrders(orders.map((_order, index) => {
                                             if (_order.id == order.id) {
                                                _order.status = "cancelled"
                                                return order
                                             }

                                             return _order
                                          }))
                                       }
                                    }}
                                    className='bg-red-600 rounded-sm text-red-100 px-4 py-2 text-sm cursor-pointer'>
                                       Cancel
                                    </button>}
                                 </div>
                              </div>
                           </div>
                        </div>
                    ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
  );
}