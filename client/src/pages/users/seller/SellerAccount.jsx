import { Link } from 'react-router-dom';
import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout, startSession } from '../../../helpers/auth';

import SellerSidebar from '../../../components/users/seller/SellerSidebar';

export default function SellerAccount({ sidebarOn, setSidebarOn }) {
   const { width, height } = useViewport()
   const [breakpoint, setGetBreakpoint] = useState(null)

   const routeName = "account"

   const [userData, setUserData] = useState(null);
   const [shopName, setShopName] = useState("")
   const [shopEmail, setShopEmail] = useState("")
   const [shopLogo, setShopLogo] = useState("")
   const [shopQrCode, setShopQrCode] = useState("")
   const [shopPassword, setShopPassword] = useState("")
   const [conPassword, setConPassword] = useState("")

   const [editOn, setEditOn] = useState(false)
   const [uploadedLogo, setUploadedLogo] = useState(null)
   const [uploadedQrCode, setUploadedQrCode] = useState(null)
   
   useEffect(() => {
    setGetBreakpoint(getBreakpoint(width));
  }, [width]);

  useEffect(() => {
    const [verified, userData] = isUserVerified();

    if (!verified) {
      navigator(routes.global.unauthorized);
      return;
    }

    setUserData(userData);
    setShopName(userData.user.shopName)
    setShopEmail(userData.user.shopEmail)
    setShopLogo(userData.user.shopLogo)
    setShopQrCode(userData.user.qrCode)
  }, []);

  const updateAccount = async () => {
   try {
      const updateBody = new FormData()

      if (uploadedLogo)
         updateBody.append("shopLogo", uploadedLogo)
      
      if (uploadedQrCode)
         updateBody.append("qrCode", uploadedQrCode)

      if (shopName.length > 1)
         updateBody.append("shopName", shopName)

      if (shopEmail && shopEmail.includes("@"))
         updateBody.append("shopEmail", shopEmail)

      if (shopPassword.trim().length >= 8) {
         const newPassword = shopPassword.trim()
         const confirmPassword = conPassword.trim()

         if (newPassword !== confirmPassword) {
            alert("Passwords don't match.")

            return
         }

         updateBody.append("password", newPassword)
      }
      
      const response = await fetch(`http://${location.hostname}:3000/user/seller-update/` + userData.user.id, {
         method: "PATCH",
         body: updateBody
      })
      const data = await response.json()

      if (response.status != 200) {
         alert("Failed to update account. Please try again.")

         return
      }

      const [_, _userData, remember] = isUserVerified()
      const newUserData = { role: "seller", user: data.seller, message: "Welcome back" }

      alert(data.message)
      startSession(newUserData, remember)
      setUserData(newUserData)
   } catch (error) {
      console.error(error)
      alert("Failed to update account. Please try again.")
   }
  }
   
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
            <SellerSidebar on={sidebarOn} active={routeName} handler={setSidebarOn}></SellerSidebar>

            <div className='p-6 flex flex-col items-stretch space-y-4 flex-grow h-full w-full'>
               <div className='w-full h-full bg-white rounded-sm shadow-md flex flex-col'>
                  <section className='flex items-center justify-between space-x-2 p-6 pr-4 md:pr-6 md:space-x-12'>
                     <h1 className={`font-bold`}>My Account</h1>
                     <button
                     onClick={async () => { await updateAccount() }}
                     className='bg-gray-900 text-gray-300 rounded-md px-2 py-1 text-sm shadow-md cursor-pointer'>Update Account</button>
                  </section>
                  <div id='product-scroll' className={`h-full gap-6 overflow-y-scroll p-6 pt-0 grid grid-cols-1 md:grid-cols-3`}>
                     <div className='flex flex-col md:h-full space-y-4'>
                        <span className='text-sm font-bold'>Shop Information</span>
                        <section className='flex flex-col space-y-2'>
                           <label htmlFor="name">Shop Name</label>
                           <input
                           type="text"
                           required
                           value={shopName}
                           placeholder={shopName}
                           onChange={e => { setShopName(e.target.value) }}
                           className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                           />
                        </section>
                        <section className='flex flex-col space-y-2'>
                           <label htmlFor="name">Shop Email</label>
                           <input
                           type="text"
                           required
                           value={shopEmail}
                           placeholder={shopEmail}
                           onChange={e => { setShopEmail(e.target.value) }}
                           className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                           />
                        </section>

                        <span className='text-sm font-bold'>Change Password</span>
                        <section className='flex flex-col space-y-2'>
                           <label htmlFor="name">New Password</label>
                           <input
                           type="password"
                           required

                           placeholder='********'
                           onChange={e => { setShopPassword(e.target.value) }}
                           className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                           />
                        </section>
                        <section className='flex flex-col space-y-2'>
                           <label htmlFor="name">Confirm New Password</label>
                           <input
                           type="password"
                           required
                           value={conPassword}
                           placeholder='********'
                           onChange={e => { setConPassword(e.target.value) }}
                           className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                           />
                        </section>
                     </div>

                     <div className='flex flex-col md:h-full space-y-4'>
                        <div className='flex justify-between'>
                           <span className='text-sm font-bold'>Logo</span>
                           <label
                           htmlFor="logo"
                           className='bg-gray-900 rounded-sm px-2 py-1 flex items-center justify-center cursor-pointer'>
                              <span className='text-gray-300 text-sm'>Change</span>
                              <input
                              id="logo"
                              type="file"
                              accept='image/*'
                              onChange={e => { setUploadedLogo(e.target.files[0]) }}
                              className='hidden'/>
                           </label>
                        </div>
                        <div
                        style={{
                           backgroundImage: uploadedLogo !== null
                              ? `url(${URL.createObjectURL(uploadedLogo)})`
                              : `url(http://${location.hostname}:3000/file/logos/${shopLogo})`
                        }}
                        onClick={() => {
                           location.href = (() => {
                              try {
                                 return URL.createObjectURL(shopLogo)
                              } catch {
                                 return `http://${location.hostname}:3000/file/logos/${shopLogo}`
                              }
                           })()
                        }}
                        className='flex-grow bg-center bg-cover rounded-sm shadow-md min-h-[30dvh] md:min-h-0'></div>
                     </div>

                     <div className='flex flex-col md:h-full space-y-4'>
                        <div className='flex justify-between'>
                           <span className='text-sm font-bold'>Payment QR Code</span>
                           <label
                           htmlFor="qrCode"
                           className='bg-gray-900 rounded-sm px-2 py-1 flex items-center justify-center cursor-pointer'>
                              <span className='text-gray-300 text-sm'>Change</span>
                              <input
                              id="qrCode"
                              type="file"
                              accept='image/*'
                              onChange={e => { setUploadedQrCode(e.target.files[0]) }}
                              className='hidden'/>
                           </label>
                        </div>
                        <div
                        style={{
                           backgroundImage: uploadedQrCode !== null
                              ? `url(${URL.createObjectURL(uploadedQrCode)})`
                              : `url(http://${location.hostname}:3000/file/qr_codes/${shopQrCode})`
                        }}
                        onClick={() => {
                           location.href = (() => {
                              if (typeof shopQrCode != "string") {
                                 return URL.createObjectURL(shopQrCode)
                              } else {
                                 return `http://${location.hostname}:3000/file/qr_codes/${shopQrCode}`
                              }
                           })()
                        }}
                        className='flex-grow bg-center bg-cover rounded-sm shadow-md min-h-[30dvh] md:min-h-0'></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

