import { Link } from 'react-router-dom';
import image from "../../assets/kzc.jpg"
import { getBreakpoint, useViewport } from '../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../helpers/routing';

export default function Login() {
   const { width, _ } = useViewport()
   const [breakpoint, setGetBreakpoint] = useState(null)

   const [step, setStep] = useState(1)
   const [role, setRole] = useState("buyer")

   const [buyerName, setBuyerName] = useState(null)
   const [buyerEmail, setBuyerEmail] = useState(null)
   const [buyerAddress, setBuyerAddress] = useState(null)
   const [buyerPass, setBuyerPass] = useState(null)
   const [buyerConPass, setBuyerConPass] = useState(null)

   const [shopName, setShopName] = useState(null)
   const [shopEmail, setShopEmail] = useState(null)
   const [shopLogo, setShopLogo] = useState(null)
   const [shopPaymentQrCode, setShopPaymentQrCode] = useState(null)
   const [shopPass, setShopPass] = useState(null)
   const [shopConPass, setShopConPass] = useState(null)

   const stepNames = {
      buyer: {
         "1": "Continue",
         "2": "Next",
         "3": "Register",
      },
      seller: {
         "1": "Continue",
         "2": "Next",
         "3": "Next",
         "4": "Register"
      }
   }
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))
   }, [])
   
   useEffect(() => {
      setGetBreakpoint(getBreakpoint(width))
   }, [width])

   const buyerSignup = async () => {
      try {
         const reqBody = new FormData()
         reqBody.append("name", buyerName)
         reqBody.append("email", buyerEmail)
         reqBody.append("address", buyerAddress)
         reqBody.append("password", buyerConPass)
         
         const response = await fetch(`http://${location.hostname}:3000/user/buyer-registration`, {
            method: "POST",
            body: reqBody
         })
         const data = await response.json()

         console.log(data)

         if (response.status !== 200 || response.status !== 201) {
            alert(data.message)
         } else {
            console.log(data)
            alert("You are now registered.")
            navigator(routes.auth.login)
         }
      } catch (error) {
         alert("An error occured. Please try again.")
      }
   }

   const sellerSignup = async () => {
      try {
         const reqBody = new FormData()
         reqBody.append("shopName", shopName)
         reqBody.append("shopEmail", shopEmail)
         reqBody.append("shopLogo", shopLogo)
         reqBody.append("qrCode", shopPaymentQrCode)
         reqBody.append("password", shopConPass)
         
         const response = await fetch(`http://${location.hostname}:3000/user/seller-registration`, {
            method: "POST",
            body: reqBody
         })
         const data = await response.json()

         if (response.status !== 201)
            alert(data.message || data.error)
         else {
            console.log(data)
            alert("You are now registered.")
         }
      } catch (error) {
         alert("An error occured. Please try again.")
      }
   }
  
   return (
      <div className="h-[100dvh] flex items-center justify-center bg-gray-100 text-md md:text-lg text-gray-600">
         <div className="flex flex-col md:flex-row items-stretch shadow-2xl min-w-8/10 max-w-8/10 min-h-2/3 rounded-tl-3xl rounded-br-3xl overflow-clip md:min-h-9/10 md:min-w-7/10">
         <form className='bg-white px-10 md:px-14 py-8  flex flex-col flex-grow md:flex-grow-0 md:w-2/5 items-stretch justify-center'>
            <h1 className='text-3xl mb-6 font-bold'>KZC Registration</h1>
         
            {step == 1 && <div>
               {/* role */}
               <section className='flex flex-col space-y-2 my-1'>
                  <span>Register as a</span>
                  <div className='space-y-2'>
                     <label
                     htmlFor="buyer"
                     className={`accent-gray-900 flex items-center space-x-2 border p-2 rounded-sm ${role == 'buyer' ? 'border-gray-900' : 'border-gray-400'}`}
                     >
                        <input
                           type="radio"
                           name='role'
                           id="buyer"
                           checked={role == "buyer"}
                           onChange={e => { setRole("buyer") }}
                        />
                        <span>Buyer</span>
                     </label>
                     <label
                     htmlFor="seller"
                     className={`accent-gray-900 flex items-center space-x-2 border p-2 rounded-sm ${role == 'seller' ? 'border-gray-900' : 'border-gray-400'}`}
                     >
                        <input
                           type="radio"
                           name='role'
                           id="seller"
                           checked={role == "seller"}
                           onChange={e => { setRole("seller") }}
                        />
                        <span>Seller</span>
                     </label>
                  </div>
               </section>
            </div>}
         
            {(step == 2 && role == "buyer") && <div>
               <h1 className='mb-4 text-xl'>Personal Information</h1>
               
               {/* username */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="name">Name</label>
                  <input
                  type="text"
                  id='name'
                  required
                  placeholder='Juan dela Cruz'
                  onChange={e => { setBuyerName(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>

               {/* email */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="email">Email</label>
                  <input
                  type="email"
                  id='email'
                  required
                  placeholder='juandelacruz@email.com'
                  onChange={e => { setBuyerEmail(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>

               {/* address */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="address">Address</label>
                  <input
                  type="text"
                  id='address'
                  required
                  placeholder='Akle St. - Kaybagal South, Tagaytay, Cavite'
                  onChange={e => { setBuyerAddress(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>
            </div>}

            {(step == 2 && role == "seller") && <div>
               <h1 className='mb-4 text-xl'>Shop Information</h1>
               
               {/* shop name */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="name">Shop Name</label>
                  <input
                  type="text"
                  id='name'
                  required
                  placeholder="Juan Shop PH"
                  onChange={e => { setShopName(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>

               {/* shop email */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="email">Shop Email</label>
                  <input
                  type="email"
                  id='email'
                  required
                  placeholder='juanshopph@email.com'
                  onChange={e => { setShopEmail(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>
            </div>}
         
            {(step == 3 && role == "buyer") && <div>
               <h1 className='mb-4 text-xl'>Account Security</h1>
               
               {/* password */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="password">Password</label>
                  <input
                  type="password"
                  id='password'
                  required
                  placeholder='********'
                  onChange={e => { setBuyerPass(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>

               {/* confirm password */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                  type="password"
                  id='confirmPassword'
                  required
                  placeholder='********'
                  onChange={e => { setBuyerConPass(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>
            </div>}
            
            {(step == 3 && role == "seller") && <div>
               <h1 className='mb-4 text-xl'>Shop Information</h1>
               
               {/* shop logo */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="logo">
                     Shop Logo
                     <input
                     type="file"
                     id='logo'
                     name='logo'
                     accept='image/*'
                     onChange={e => { setShopLogo(e.target.files[0]) }}
                     className="hidden"
                     />
                     <div
                     className='bg-gray-900 text-gray-300 py-2 rounded-sm text-center'
                     >
                        { !shopLogo ? "Upload" : shopLogo.name}
                     </div>
                  </label>
               </section>
               
               {/* shop payment qr code */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="qrCode">
                     Payment QR Code
                     <input
                     type="file"
                     id='qrCode'
                     name='qrCode'
                     accept='image/*'
                     onChange={e => { setShopPaymentQrCode(e.target.files[0]) }}
                     className="hidden"
                     />
                     <div
                     className='bg-gray-900 text-gray-300 py-2 rounded-sm text-center'
                     >
                        { !shopPaymentQrCode ? "Upload" : shopPaymentQrCode.name}
                     </div>
                  </label>
               </section>
            </div>}

            {(step == 4 && role == "seller") && <div>
               <h1 className='mb-4 text-xl'>Account Security</h1>
               
               {/* password */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="password">Password</label>
                  <input
                  type="password"
                  id='password'
                  required
                  placeholder='********'
                  onChange={e => { setShopPass(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>

               {/* confirm password */}
               <section className='flex flex-col space-y-2 my-1'>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                  type="password"
                  id='confirmPassword'
                  required
                  placeholder='********'
                  onChange={e => { setShopConPass(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>
            </div>}

            <div className='flex space-x-2'>
               {step != 1 && <div
               onClick={() => {
                  if (step != 1) setStep(v => v - 1)
               }}
               className='cursor-pointer border text-center border-gray-900 py-2 px-4 rounded-sm my-4 text-gray-900'
               >
                  &lt;
               </div>}
               <button
               onClick={e => {
                  e.preventDefault()
                  
                  if (role == "buyer") {
                     if (step != 3) {
                        setStep(v => v + 1)
                     } else {
                        if (buyerPass !== buyerConPass) {
                           alert("Passwords did not match.")
                           return
                        }

                        ;(async () => { await buyerSignup() })()
                     }

                  } else {
                     if (step != 4) {
                        setStep(v => v + 1)
                     } else {
                        if (shopPass !== shopConPass) {
                           alert("Passwords did not match.")
                           return
                        }

                        ;(async () => { await sellerSignup() })()
                     }
                  }
               }}
               className='cursor-pointer bg-gray-900 text-center text-gray-300 py-2 rounded-sm my-4 flex-grow'
               >{stepNames[role][step]}</button>
            </div>

            <p className='text-sm'>Already have an account? <Link to={routes.auth.login} className='hover:underline font-bold'>Login</Link> instead.</p>
         </form>
         {breakpoint != "xs" && <div style={{ backgroundImage: `url(${image})` }} className="bg-cover bg-no-repeat bg-center   flex-grow"></div>}
         </div>
      </div>
   );
}

