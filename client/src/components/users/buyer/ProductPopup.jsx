import { useEffect, useState } from "react";
import { isUserVerified } from "../../../helpers/auth";
import { navigator, routes } from "../../../helpers/routing";

function ProductPopup({ popupProduct, handler, handlerSetOrderAmount = () => {}, handlerSetQrCodeURL = () => {}, handlerSetSellerQrCodeURL=() => {} }) {
   const [userData, setUserData] = useState(null)
   
   const [product, setProduct] = useState(null)

   const [toCartOpen, setToCartOpen] = useState(false)
   const [cartVariant, setCartVariant] = useState(null)
   const [cartQuantity, setCartQuantity] = useState(1)
   const [cartImage, setCartImage] = useState(null)

   const [toOrderOpen, setToOrderOpen] = useState(false)
   const [orderVariant, setOrderVariant] = useState(null)
   const [orderQuantity, setOrderQuantity] = useState(1)
   const [orderImage, setOrderImage] = useState(null)
   const [orderSeller, setOrderSeller] = useState(null)
   const [qrCodeURL, setQrCodeURL] = useState(null)
   const [sellerQrCodeURL, setSellerQrCodeURL] = useState(null)
   const [orderAmount, setOrderAmount] = useState(0)

   useEffect(() => {
      const [verified, userData] = isUserVerified()
      
      if (!verified)
         navigator(routes.global.unauthorized)

      setUserData(userData)

      setProduct(popupProduct)
      
      if (popupProduct) {
         setCartImage(popupProduct.variants[0].image)
         setOrderImage(popupProduct.variants[0].image)
         setOrderSeller(popupProduct.sellerInfo)
      }
   }, [popupProduct])

   const closePopup = () => {
      handler(null)
      setToCartOpen(false)
      setCartVariant(null)
      setCartQuantity(1)
      setCartImage(null)
   }

   const addToCart = async () => {
      try {
         const cartItem = new FormData()

         cartItem.append("buyer", userData.user.id)
         cartItem.append("variant", cartVariant.id)
         cartItem.append("quantity", cartQuantity)
         
         const response = await fetch(`http://${location.hostname}:3000/cart/add`, {
            method: "POST",
            body: cartItem
         })
         const data = await response.json()

         if (response.status != 201) {
            alert(data.message)

            return
         }

         alert("Added to cart.")
      } catch (error) {
         console.error(error)
         alert("Failed to add the product to cart. Please try again.")
      }
   }

   const order = async item => {
    try {
      const addBody = new FormData()

      addBody.append("variant", item.variant.id)
      addBody.append("buyer", userData.user.id)
      addBody.append("quantity", item.quantity)
      addBody.append("seller", orderSeller.id)
      
      const response = await fetch(`http://${location.hostname}:3000/order/add`, {
        method: "POST",
        body: addBody
      })
      const data = await response.json()

      if (response.status != 201) {
        alert(data.message)

        return [false, null]
      }

      handlerSetOrderAmount(item.variant.price * item.quantity)
      handlerSetSellerQrCodeURL(`http://${location.hostname}:3000/file/qr_codes/${orderSeller.qrCode}`)
      handlerSetQrCodeURL(`http://${location.hostname}:3000/file/receipt_qr_codes/${data.receiptImageName}`)

      return [true, data.order.id]
    } catch (error) {
      console.error(error)
      alert("Failed to place order. Please try again.")

      return [false, null]
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
   
   if (!product)
      return null

   return (
      <div className="absolute w-full h-full bg-gray-400/50 flex items-center justify-center z-20">
         <div className="relative min-w-9/10 max-w-9/10 md:min-w-4/10 md:max-w-4/10 h-11/12 bg-white shadow-md rounded-sm p-6 flex flex-col space-y-6">
            {/* product info view */}
            {!toCartOpen && !toOrderOpen && <div className="no-bar flex-grow flex flex-col items-stretch overflow-y-auto gap-y-6">
               {/* product image */}
               <div
               style={{ backgroundImage: `url(http://${location.hostname}:3000/file/variants/${cartImage})` }}
               className="rounded-tl-sm rounded-tr-sm min-h-2/3 bg-center bg-cover bg-no-repeat relative">
                  <div
                  onClick={closePopup}
                  className="absolute bg-white shadow-sm min-w-10 min-h-10 rounded-sm flex items-center justify-center cursor-pointer top-4 right-4">
                     <span className="material-symbols-outlined">close</span>
                  </div>
               </div>
               
               {/* variants */}
               <div className="flex items-stretch justify-between">
                  <div className="flex items-center space-x-2 gap-y-2 flex-wrap max-w-6/10">
                     {product.variants.map((variant, index) => (
                        <button
                        key={index}
                        className="cursor-pointer border text-sm rounded-sm text-gray-900 px-3 py-1">
                           {variant.name}
                        </button>
                     ))}
                  </div>
                  <div className="font-bold">{getPriceRange(product)}</div>
               </div>

               {/* product name */}
               <h1 className="font-bold text-wrap text-xl">{product.name}</h1>

               {/* product description */}
               <div className={`${product.description == "null" && "hidden"}`}>
                  <h2 className="font-bold text-sm">About Product</h2>
                  <p>{product.description}</p>
               </div>

               {/* product actions */}
               <div className="sticky bottom-0 pt-4 bg-white/70 flex justify-end space-x-2 text-sm">
                  <button
                  onClick={() => {
                     setToCartOpen(true)
                     setToOrderOpen(false)
                     setCartVariant(product.variants[0])
                  }}
                  className="cursor-pointer border rounded-sm text-gray-900 px-4 py-2">
                     Add to Cart
                  </button>
                  <button
                  onClick={() => {
                     setToCartOpen(false)
                     setToOrderOpen(true)
                     setOrderVariant(product.variants[0])
                  }}
                  className="cursor-pointer bg-gray-900 rounded-sm text-white px-4 py-2">
                     Order Now
                  </button>
               </div>
            </div>}

            {/* add to cart view */}
            {toCartOpen && <div className="no-bar flex-grow flex flex-col items-stretch overflow-y-auto gap-y-6">
               {/* product image */}
               <div
               style={{ backgroundImage: `url(http://${location.hostname}:3000/file/variants/${cartImage})` }}
               className="rounded-tl-sm rounded-tr-sm min-h-2/3 bg-center bg-cover bg-no-repeat relative">
                  <div
                  onClick={() => {
                     setToCartOpen(false)
                     setToOrderOpen(false)
                     setCartVariant(product.variants[0])
                     setCartQuantity(1)
                  }}
                  className="absolute bg-white shadow-sm min-w-10 min-h-10 rounded-sm flex items-center justify-center cursor-pointer top-4 right-4">
                     <span className="material-symbols-outlined">close</span>
                  </div>
                  <div className="absolute left-2 bottom-2 text-sm bg-white rounded-sm shadow-md pl-2 pr-3 py-1 flex items-center gap-x-1">
                     <span className="material-symbols-outlined">box</span>
                     <span>Stock {cartVariant.stock}</span>
                  </div>
               </div>
               
               {/* variant selection */}
               <div className="flex flex-col space-y-2">
                  <h2>Choose a variant</h2>
                  <div className="flex flex-wrap gap-2">
                     {product.variants.map((variant, index) => (
                        <label
                        key={index}
                        htmlFor={`variant-${index}`}
                        className={`${
                           cartVariant == variant
                              ? "border-gray-900"
                              : "border-gray-300 text-gray-300"
                        } border rounded-sm px-4 py-2 space-x-2 accent-gray-900`}>
                           <input
                           id={`variant-${index}`}
                           type="radio"
                           name="variant"
                           checked={cartVariant == variant}
                           onChange={e => {
                              setCartVariant(variant)
                              setCartImage(variant.image)
                           }} />
                           <span>{variant.name}</span>
                        </label>
                     ))}
                  </div>
               </div>

               {/* set quantity */}
               <section className="flex flex-col space-y-2">
                  <h2 className="">Set Quantity</h2>
                  <div className="flex items-center space-x-2">
                     <span
                     onClick={() => {
                        if (cartQuantity > 1)
                           setCartQuantity(cartQuantity - 1)
                     }}
                     className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">remove</span>
                     <input
                     type="number"
                     value={cartQuantity}
                     onChange={e => { setCartQuantity(e.target.value) }}
                     className="border max-w-3/10 md:max-w-2/10 px-4 rounded-sm appearance-none mr-3 text-center"/>
                     <span
                     onClick={() => {
                        if (cartQuantity < cartVariant.stock)
                           setCartQuantity(cartQuantity + 1)
                     }}
                     className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">add</span>
                  </div>
               </section>
               
               {/* add */}
               <button
               onClick={() => {
                  ;(async () => {
                     await addToCart()
                  })()
               }}
               className="cursor-pointer absolute right-6 bottom-6 px-4 py-2 rounded-sm text-sm bg-gray-900 text-gray-300">
                  Add
               </button>
            </div>}

            {/* place order view */}
            {toOrderOpen && <div className="no-bar flex-grow flex flex-col items-stretch overflow-y-auto gap-y-6">
               {/* product image */}
               <div
               style={{ backgroundImage: `url(http://${location.hostname}:3000/file/variants/${orderImage})` }}
               className="rounded-tl-sm rounded-tr-sm min-h-2/3 bg-center bg-cover bg-no-repeat relative">
                  <div
                  onClick={() => {
                     setToOrderOpen(false)
                     setOrderVariant(product.variants[0])
                     setOrderQuantity(1)
                  }}
                  className="absolute bg-white shadow-sm min-w-10 min-h-10 rounded-sm flex items-center justify-center cursor-pointer top-4 right-4">
                     <span className="material-symbols-outlined">close</span>
                  </div>
                  <div className="absolute left-2 bottom-2 text-sm bg-white rounded-sm shadow-md pl-2 pr-3 py-1 flex items-center gap-x-1">
                     <span className="material-symbols-outlined">box</span>
                     <span>Stock {orderVariant.stock}</span>
                  </div>
               </div>
               
               {/* variant selection */}
               <div className="flex flex-col space-y-2">
                  <h2>Choose a variant</h2>
                  <div className="flex flex-wrap gap-2">
                     {product.variants.map((variant, index) => (
                        <label
                        key={index}
                        htmlFor={`variant-${index}`}
                        className={`${
                           orderVariant == variant
                              ? "border-gray-900"
                              : "border-gray-300 text-gray-300"
                        } border rounded-sm px-4 py-2 space-x-2 accent-gray-900`}>
                           <input
                           id={`variant-${index}`}
                           type="radio"
                           name="variant"
                           checked={orderVariant == variant}
                           onChange={e => {
                              setOrderVariant(variant)
                              setOrderImage(variant.image)
                           }} />
                           <span>{variant.name}</span>
                        </label>
                     ))}
                  </div>
               </div>

               {/* set quantity */}
               <section className="flex flex-col space-y-2">
                  <h2 className="">Set Quantity</h2>
                  <div className="flex items-center space-x-2">
                     <span
                     onClick={() => {
                        if (orderQuantity > 1)
                           setOrderQuantity(orderQuantity - 1)
                     }}
                     className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">remove</span>
                     <input
                     type="number"
                     value={orderQuantity}
                     onChange={e => { setOrderQuantity(e.target.value) }}
                     className="border max-w-3/10 md:max-w-2/10 px-4 rounded-sm appearance-none mr-3 text-center"/>
                     <span
                     onClick={() => {
                        if (orderQuantity < orderVariant.stock)
                           setOrderQuantity(orderQuantity + 1)
                     }}
                     className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">add</span>
                  </div>
               </section>
               
               {/* add */}
               <button
               onClick={() => {
                  ;(async () => {
                     const [isOrdered, orderID] = await order({ variant: orderVariant, quantity: orderQuantity })
                  })()
               }}
               className="cursor-pointer absolute right-6 bottom-6 px-4 py-2 rounded-sm text-sm bg-gray-900 text-gray-300">
                  ₱ {orderVariant.price * orderQuantity} | Order
               </button>
            </div>}
         </div>
      </div>
   )
}

export default ProductPopup;