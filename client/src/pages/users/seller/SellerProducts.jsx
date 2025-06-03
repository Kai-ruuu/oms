import { Link } from 'react-router-dom';
import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout } from '../../../helpers/auth';

import SellerSidebar from '../../../components/users/seller/SellerSidebar';
import SellerAddProduct from '../../../components/users/seller/SellerAddProduct';
import SellerEditProduct from '../../../components/users/seller/SellerEditProduct';

export default function SellerProducts({ sidebarOn, setSidebarOn }) {
   const { width, height } = useViewport()
   const [breakpoint, setGetBreakpoint] = useState(null)
   const [editProduct, setEditProduct] = useState(null)

   const routeName = "products"
   const [userData, setUserData] = useState(null)
   const [addOn, setAddOn] = useState(false)
   const [products, setProducts] = useState([])
   const [search, setSearch] = useState("")
   const [filterBy, setFilterBy] = useState("price_h")

   const getProducts = async sellerID => {
      try {
         const response = await fetch(`http://${location.hostname}:3000/product/seller/` + sellerID)
         const data = await response.json()

         if (response.status !== 200) {
            alert(data.message)

            return
         }

         setProducts(data.products)
      } catch (error) {
         console.error(error)
         alert("An error occurred while fetching your products.")
      }
   }

   const getPriceRange = product => {
      const priceList = product.variants.map(variant => variant.price)

      let min = null
      let max = null

      priceList.forEach(value => {
         min = !min
            ? value
            : value < min
               ? value
               : min

         max = !max
            ? value
            : value > max
               ? value
               : max
      })
      
      if (min == max)
         return `₱ ${priceList[0]}`
      
      return priceList.length > 1
         ? `₱ ${min} ~ ₱ ${max}`
         : `₱ ${priceList[0]}`
   }

   useEffect(() => {}, [products])
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))

      const [verified, userData] = isUserVerified()
      
      if (!verified)
         navigator(routes.global.unauthorized)

      setUserData(userData)

      ;(async () => {
         await getProducts(userData.user.id)
      })()
   }, [])
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))
   }, [width])
   
   if (!userData)
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
            <SellerAddProduct
            breakpoint={breakpoint}
            on={addOn}
            handler={setAddOn}
            sellerID={userData.user.id}
            setProducts={setProducts}>
            </SellerAddProduct>
            
            <SellerEditProduct
            breakpoint={breakpoint}
            on={editProduct != null}
            handler={setEditProduct}
            product={editProduct}
            setProducts={setProducts}>
            </SellerEditProduct>
            
            <SellerSidebar
            on={sidebarOn}
            active={routeName}
            handler={setSidebarOn}>
            </SellerSidebar>

            <div className='p-6 flex flex-col items-stretch space-y-4 flex-grow h-full w-full'>
               <div className='w-full h-full bg-white rounded-sm shadow-md flex flex-col'>
                  <section className='flex items-center justify-between space-x-2 p-6 pr-4 md:pr-6 md:space-x-12'>
                     <h1 className={`${breakpoint == "xs" && "hidden"} font-bold`}>My Products</h1>
                     <section className='md:max-w-4/10 flex pr-2 flex-grow'>
                        <input
                        type="text"
                        placeholder='Search product'
                        onChange={e => { setSearch(e.target.value) }}
                        className='border border-gray-400 p-1 rounded-sm indent-2 flex-grow'/>
                     </section>
                     <div
                     onClick={() => { setAddOn(true) }}
                     className={`${breakpoint != "xs" && "hidden"} px-2 rounded-sm text-gray-300 bg-gray-900`}>
                        <span className={`material-symbols-outlined pt-1`}>add</span>
                     </div>
                     <button
                     onClick={() => { setAddOn(true) }}
                     className={`${breakpoint == "xs" && "hidden"} bg-gray-900 pl-2 pr-4 py-2 text-white rounded-sm flex items-center space-x-1 cursor-pointer ml-2`}>
                        <span className={`material-symbols-outlined`}>add</span>
                        <span className='text-sm'>Add</span>
                     </button>
                  </section>
                  <div id='product-scroll' className='max-h-[64dvh] overflow-y-scroll p-6 pt-0 md:grid md:grid-cols-4 md:gap-6'>
                     {products.filter(product => (
                        product.name.toLowerCase().includes(search.toLowerCase())
                     )).map((value, index) => (
                        <div key={index} className='mb-4 rounded-sm overflow-clip md:w-full flex md:flex-col shadow-md z-10'>
                           <div
                           className='flex-gow w-full flex flex-col min-h-[36dvh] md:min-h-[42dvh] items-stretch relative'>
                              <div
                              onClick={() => { location.href = `http://${location.hostname}:3000/file/variants/${value.variants[0]?.image}` }}
                              style={{backgroundImage: `url(http://${location.hostname}:3000/file/variants/${value.variants[0]?.image})`}}
                              className="w-full h-full bg-cover rounded-tl-sm rounded-tr-sm relative bg-center">
                              </div>
                              <div className='flex items-center px-3 py-3 space-x-3 w-full bg-white'>
                                 <div className='flex flex-col flex-grow relative'>
                                    <span className='text-lg'>{value.name}</span>
                                    <span className='text-sm font-bold'>{getPriceRange(value)}</span>
                                 </div>
                                 <span
                                 onClick={() => {
                                    setEditProduct(value)
                                 }}
                                 className="cursor-pointer material-symbols-outlined">edit</span>
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

