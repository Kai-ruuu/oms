import { Link } from "react-router-dom"
import { routes } from "../../../helpers/routing"
import { getBreakpoint, useViewport } from "../../../helpers/screen"
import { useEffect, useState } from "react"

function SellerSidebar({ on, active, handler }) {
   const { width, height } = useViewport()
   const [breakpoint, setGetBreakpoint] = useState(null)
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))
   }, [])
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))
   }, [width])
   
   const sidebarRoutes = [
      {
         to: routes.users.buyer.home,
         icon: <span className="material-symbols-outlined">home</span>,
         name: "Home"
      },
      {
         to: routes.users.buyer.cart,
         icon: <span className="material-symbols-outlined">bookmark</span>,
         name: "My Cart"
      },
      {
         to: routes.users.buyer.myOrders,
         icon: <span className="material-symbols-outlined">shopping_cart</span>,
         name: "My Orders"
      },
      {
         to: routes.users.buyer.account,
         icon: <span className="material-symbols-outlined">person</span>,
         name: "Account"
      },
   ]
   
   if (breakpoint == "xs")
      return (
         <div className={`${!on && "hidden"} absolute flex flex-row items-stretch w-full h-full bg-transparent z-30`}>
            <section className='bg-white w-7/10 md:w-2/9 h-full flex flex-col items-stretch shadow-md'>
               {sidebarRoutes.map(({ to, icon, name }, index) => (
                  <Link key={index} to={to} className={`${name.toLowerCase() == active.toLowerCase() && "bg-gray-900 text-white"} p-4 flex items-center space-x-4`}>
                     {icon}
                     <span>{name}</span>
                  </Link>
               ))}       
            </section>
            <div
            onClick={() => { handler(!on) }}
            className='h-full flex-grow bg-gray-400/50'></div>
         </div>
      )
   else
      return (
         <div className={`${!on && "hidden"} z-30 bg-white min-w-3/12 md:w-2/9 m-6 mr-0 flex flex-col items-stretch shadow-md rounded-sm overflow-clip`}>
            {sidebarRoutes.map(({ to, icon, name }, index) => (
               <Link key={index} to={to} className={`${name.toLowerCase() == active.toLowerCase() && "bg-gray-900 text-white"} p-4 flex items-center space-x-4`}>
                  {icon}
                  <span>{name}</span>
               </Link>
            ))}        
         </div>
      )
}

export default SellerSidebar