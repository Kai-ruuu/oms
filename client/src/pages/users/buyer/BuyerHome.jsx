import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout } from '../../../helpers/auth';

import BuyerSidebar from '../../../components/users/buyer/BuyerSidebar';
import ProductPopup from "../../../components/users/buyer/ProductPopup"
import BuyerScan from "../../../components/users/buyer/BuyerScan"

export default function BuyerHome({ sidebarOn, setSidebarOn }) {
   const { width, height } = useViewport()
   const [breakpoint, setGetBreakpoint] = useState(null)

   const routeName = "home"

   const [products, setProducts] = useState([])
   const [search, setSearch] = useState("")
   const [viewedProduct, setViewedProduct] = useState(null)

   const [cartItems, setCartItems] = useState([])
   const [userData, setUserData] = useState(null)
   const [qrCodeURL, setQrCodeURL] = useState(null)
   const [sellerQrCodeURL, setSellerQrCodeURL] = useState(null)
   const [orderAmount, setOrderAmount] = useState(0)
  
  const getLatestProducts = async () => {
    try {
      const response = await fetch(`http://${location.hostname}:3000/product/latest`)
      const data = await response.json()

      if (response.status != 200) {
        alert("An error occurred while loading latest products.")

        return
      }

      const fetchedProducts = data.products

      setProducts(fetchedProducts)
    } catch (error) {
      console.error(error)
      alert("An error occurred while loading latest products.")
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
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
    
    if (!isUserVerified())
      navigator(routes.global.unauthorized)

    ;(async () => {
      await getLatestProducts()
    })()
  }, [])
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [width])

  const setScan = data => {
   setOrderAmount(data.amount)
   setQrCodeURL(data.qrCodeURL)
   setSellerQrCodeURL(data.sellerQrCodeURL)
  }

  if (!products)
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
            <BuyerSidebar on={sidebarOn} active={routeName} handler={setSidebarOn}></BuyerSidebar>
            <ProductPopup
            popupProduct={viewedProduct}
            handler={setViewedProduct}
            handlerSetOrderAmount={setOrderAmount}
            handlerSetQrCodeURL={setQrCodeURL}
            handlerSetSellerQrCodeURL={setSellerQrCodeURL}></ProductPopup>
            <BuyerScan
            amount={orderAmount}
            qrCodeURL={qrCodeURL}
            handler={setQrCodeURL}
            sellerQrCode={sellerQrCodeURL}
            sellerHandler={setSellerQrCodeURL}></BuyerScan>

            <div className='p-6 flex flex-col items-stretch space-y-4 flex-grow h-full w-full'>
               <div className='w-full h-full bg-white rounded-sm shadow-md flex flex-col'>
                  <section className='flex items-center justify-between space-x-2 p-6 pr-4 md:pr-6 md:space-x-12'>
                     <h1 className={`${breakpoint == "xs" && "hidden"} font-bold`}>Our Latest</h1>
                     <section className='md:max-w-4/10 flex pr-2 flex-grow'>
                        <input
                        type="text"
                        placeholder='Search latest products'
                        onChange={e => { setSearch(e.target.value) }}
                        className='border border-gray-400 p-1 rounded-sm indent-2 flex-grow'/>
                     </section>
                  </section>
                  <div id='product-scroll' className={`max-h-[64dvh] overflow-y-scroll p-6 pt-0 md:grid md:gap-6 ${sidebarOn ? "md:grid-cols-4" : "md:grid-cols-5"}`}>
                     {products.filter(product => product.name.toLowerCase().includes(search.toLowerCase())).map((value, index) => (
                        <div key={index} className='mb-4 rounded-sm overflow-clip md:w-full flex md:flex-col shadow-md z-10'>
                           <div
                           className='flex-gow w-full flex flex-col min-h-[36dvh] md:min-h-[42dvh] items-stretch relative'>
                              <div
                              onClick={() => { location.href = `http://${location.hostname}:3000/file/variants/${value.variants[0]?.image}` }}
                              style={{backgroundImage: `url(http://${location.hostname}:3000/file/variants/${value.variants[0]?.image})`}}
                              className="w-full h-full bg-cover rounded-tl-sm rounded-tr-sm relative bg-center">
                                <div className="absolute left-2 bottom-2 text-sm bg-white rounded-sm shadow-md pl-2 pr-3 py-1 flex items-center gap-x-1">
                                  <span className="material-symbols-outlined">shopping_cart</span>
                                  <span>{value.sellerInfo.shopName}</span>
                                </div>
                              </div>
                              <div className='flex items-center justify-between px-3 py-3 space-x-3 w-full bg-white'>
                                 <div className='flex flex-col flex-grow overflow-x-hidden max-w-6/10'>
                                    <span className='text-lg text-nowrap' title={value.name}>{value.name}</span>
                                    <span className='text-sm font-bold'>{getPriceRange(value)}</span>
                                 </div>
                                 <div className='flex flex-col justify-end'>
                                    <button
                                    onClick={() => {
                                       setViewedProduct(value)
                                    }}
                                    className='cursor-pointer bg-gray-900 px-2 py-1 rounded-sm text-gray-300 text-sm'>View</button>
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

