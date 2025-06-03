import { Link } from 'react-router-dom';
import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useRef, useState } from 'react';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout } from '../../../helpers/auth';

import SellerSidebar from '../../../components/users/seller/SellerSidebar';

export default function SellerOrders({ sidebarOn, setSidebarOn }) {
   const { width, height } = useViewport()
   const [breakpoint, setGetBreakpoint] = useState(null)

   const routeName = "orders"
   const [userData, setUserData] = useState(null)
   const [orders, setOrders] = useState([])
   const [updatingOrders, setUpdatingOrders] = useState(new Set())

   const getCustomerOrders = async sellerID => {
      try {
         const response = await fetch(`http://${location.hostname}:3000/order/seller/` + sellerID)
         const data = await response.json()

         if (response.status != 200) {
            alert("An error occurred while fetching your customer orders.")
            return
         }
         
         setOrders(data.orders)
      } catch (error) {
         console.log(error)
         alert("An error occurred while fetching your customer orders.")
      }
   }
   
   const updateOrderStatus = async (status, orderID) => {
      try {
         setUpdatingOrders(prev => new Set(prev).add(orderID))
         
         const orderStatusData = new FormData()
         orderStatusData.append("status", status)
         
         const response = await fetch(`http://${location.hostname}:3000/order/edit/` + orderID, {
            method: "PATCH",
            body: orderStatusData
         })
         const data = await response.json()
   
         if (response.status != 200) {
            alert("An error occurred while updating order.")
            return false
         }
         
         alert(data.message)
         return true
      } catch (error) {
         console.log(error)
         alert("An error occurred while updating order.")

         return false
      } finally {
         setUpdatingOrders(prev => {
            const newSet = new Set(prev)

            newSet.delete(orderID)
            
            return newSet
         })
      }
   }
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))

      const [verified, userData] = isUserVerified()
      
      if (!verified)
         navigator(routes.global.unauthorized)

      setUserData(userData)

      ;(async () => {
         await getCustomerOrders(userData.user.id)
      })()
   }, [])
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))
   }, [width])

   if (!orders)
      return <div></div>
   
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
            <SellerSidebar on={sidebarOn} active={routeName} handler={setSidebarOn}></SellerSidebar>

            <div className='p-6 flex flex-col items-stretch space-y-4 flex-grow h-full w-full'>
               <div className='w-full h-full bg-white rounded-sm shadow-md flex flex-col'>
                  <section className='flex items-center justify-between space-x-2 p-6 pr-4 md:pr-6 md:space-x-12'>
                     <h1 className={`${breakpoint == "xs" && "hidden"} font-bold`}>Customer Orders</h1>
                     <section className='md:max-w-4/10 flex flex-grow'>
                        <input
                        type="text"
                        placeholder='Search orders'
                        // onChange={e => { setSearch(e.target.value) }}
                        className='border border-gray-400 p-1 rounded-sm indent-2 flex-grow'/>
                     </section>
                  </section>
                  <div id='product-scroll' className={`max-h-[64dvh] overflow-x-auto overflow-y-auto p-6 pt-0`}>
                     <table className="table-auto w-full relative text-sm rounded-sm overflow-clip">
                        <thead className='sticky top-0 z-10'>
                           <tr className='*:text-left *:bg-gray-900 *:text-gray-300 *:py-4 *:px-2'>
                              <th>Product</th>
                              <th>Variant</th>
                              <th>Quantity</th>
                              <th>Customer</th>
                              <th>Address</th>
                              <th>Total</th>
                              <th>Receipt</th>
                              <th>Manage Status</th>
                           </tr>
                        </thead>
                        <tbody>
                           {orders.map(order => (
                              <tr key={order.id} className='*:py-3 *:px-2 hover:bg-gray-100'>
                                 <td title={order.productInfo.name}>{order.productInfo.name}</td>
                                 <td title={order.variantInfo.name}>{order.variantInfo.name}</td>
                                 <td title={order.quantity}>{order.quantity}</td>
                                 <td title={order.buyerInfo.name}>{order.buyerInfo.name}</td>
                                 <td title={order.buyerInfo.address}>{order.buyerInfo.address}</td>
                                 <td title={`₱ ${order.variantInfo.price * order.quantity}`}>₱ {order.variantInfo.price * order.quantity}</td>
                                 <td title={order.receipt}
                                 onClick={() => { location.href = `http://${location.hostname}:3000/file/receipts/${order.receipt}` }}
                                 className={order.receipt && `hover:underline font-bold cursor-pointer`}
                                 >{order.receipt || "No receipt uploaded yet."}</td>
                                 <td>
                                    <select
                                    value={order.status}
                                    disabled={updatingOrders.has(order.id)}
                                    onChange={async e => {
                                       const newStatus = e.target.value
                                       const originalStatus = order.status
                                       
                                       setOrders(orders =>
                                          orders.map(_order =>
                                          _order.id === order.id
                                             ? { ..._order, status: newStatus }
                                             : _order
                                          )
                                       )
                                       
                                       const success = await updateOrderStatus(newStatus, order.id)
                                       
                                       if (!success) {
                                          setOrders(orders =>
                                             orders.map(_order =>
                                             _order.id === order.id
                                                ? { ..._order, status: originalStatus }
                                                : _order
                                             )
                                          )
                                       }
                                    }}
                                    className={updatingOrders.has(order.id) ? 'opacity-50 cursor-not-allowed' : `${(() => {
                                       switch (order.status) {
                                          case "unprepared":
                                             return "bg-yellow-400"
                                          case "for_delivery":
                                             return "bg-blue-500"
                                          case "delivered":
                                             return "bg-green-500"
                                          default:
                                             return "bg-red-400"
                                       }
                                    })()} px-2 rounded-sm py-1 text-white`}
                                    >
                                    {order.status !== "cancelled" && <>
                                    <option value="unprepared" className='bg-white text-gray-900'>Processing</option>
                                    <option value="for_delivery" className='bg-white text-gray-900'>Shipping</option>
                                    <option value="delivered" className='bg-white text-gray-900'>Delivered</option>
                                    </>}
                                    <option value="cancelled" className='bg-white text-gray-900'>Cancelled</option>
                                    </select>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}