import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useState } from 'react';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout } from '../../../helpers/auth';

import BuyerSidebar from '../../../components/users/buyer/BuyerSidebar';
import BuyerScan from '../../../components/users/buyer/BuyerScan'

export default function BuyerCart({ sidebarOn, setSidebarOn }) {
  const { width, height } = useViewport()
  const [breakpoint, setGetBreakpoint] = useState(null)

  const routeName = "my cart"

  const [cartItems, setCartItems] = useState([])
  const [userData, setUserData] = useState(null)
  const [qrCodeURL, setQrCodeURL] = useState(null)
  const [sellerQrCodeURL, setSellerQrCodeURL] = useState(null)
  const [orderAmount, setOrderAmount] = useState(0)
  
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
        await getCartItems()
      })()
    }
  }, [userData])
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [width])

  const updateItem = async item => {
    try {
      const updateData = new FormData()

      for (const key in item) {
        updateData.append(key, item[key])
      }
      
      const response = await fetch(`http://${location.hostname}:3000/cart/edit/` + item.id, {
        method: "PATCH",
        body: updateData
      })
      const data = await response.json()

      if (response.status != 200) {
        alert("Failed to perform action.")

        return
      }
    } catch (error) {
      console.error(error)
      alert("Failed to perform action.")
    }
  }

  const getCartItems = async () => {
    try {
      const response = await fetch(`http://${location.hostname}:3000/cart/buyer/` + userData.user.id)
      const data = await response.json()

      if (response.status != 200) {
        alert(data.message)

        return
      }

      setCartItems(data.cartItems.map(cartItem => {
        cartItem.checked = false
        return cartItem
      }))
    } catch (error) {
      console.error(error)
      alert("Failed to fetch your cart items.")
    }
  }

  const order = async item => {
    try {
      const addBody = new FormData()

      addBody.append("variant", item.variant)
      addBody.append("buyer", item.buyer)
      addBody.append("quantity", item.quantity)
      addBody.append("seller", item.productInfo.seller)
      
      const response = await fetch(`http://${location.hostname}:3000/order/add`, {
        method: "POST",
        body: addBody
      })
      const data = await response.json()

      if (response.status != 201) {
        alert(data.message)

        return [false, null]
      }

      setOrderAmount(item.variantInfo.price * item.quantity)
      setSellerQrCodeURL(`http://${location.hostname}:3000/file/qr_codes/${item.sellerInfo.qrCode}`)
      setQrCodeURL(`http://${location.hostname}:3000/file/receipt_qr_codes/${data.receiptImageName}`)

      return [true, data.order.id]
    } catch (error) {
      console.error(error)
      alert("Failed to place order. Please try again.")

      return [false, null]
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

  if (!cartItems)
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
            <BuyerScan
            amount={orderAmount}
            qrCodeURL={qrCodeURL}
            handler={setQrCodeURL}
            sellerQrCode={sellerQrCodeURL}
            sellerHandler={setSellerQrCodeURL}></BuyerScan>

            <div className='p-6 flex flex-col items-stretch space-y-4 flex-grow h-full w-full'>
               <div className='w-full h-full bg-white rounded-sm shadow-md flex flex-col relative'>
                  <section className='flex items-center justify-between space-x-2 p-6 pr-4 md:pr-6 md:space-x-12'>
                    <h1 className={`font-bold`}>My Cart</h1>
                  </section>
                  <div id='product-scroll' className={`relative max-h-[64dvh] overflow-y-scroll p-6 pt-0 grid gap-6 grid-cols-1`}>
                    {cartItems.map((item, index) => {
                      if (breakpoint != "xs") {
                        return (
                          <div
                          key={index}
                          className='p-6 rounded-sm shadow-md flex items-center space-x-4'>
                            <div className='flex-grow h-full flex space-x-4 items-center'>
                              <div
                              style={{ backgroundImage: `url(http://${location.hostname}:3000/file/variants/${item.variantInfo.image})` }}
                              className='min-w-[15vw] min-h-[15vw] max-h-[15vw] md:min-w-[10vw] md:min-h-[10vw] bg-center bg-cover bg-no-repeat rounded-sm'>
                              </div>
                              <div className='flex-grow space-y-4'>
                                <p className='font-bold text-wrap break-words'>{item.productInfo.name}</p>
  
                                <div className='flex flex-col space-y-1'>
                                  <span className='text-sm'>Variant</span>
                                  <select
                                  value={item.variant}
                                  onChange={e => {
                                    setCartItems(cartItems => cartItems.map(cartItem => {
                                      if (cartItem.variant == item.variant) {
                                        cartItem.variant = e.target.value
                                        cartItem.variantInfo.image = cartItem.productInfo.variants.filter(variant => variant.id == e.target.value)[0].image
                                        ;(async () => { await updateItem(item) })()
                                        return cartItem
                                      } else {
                                        return cartItem
                                      }
                                    }))
                                  }}
                                  className='bg-gray-900 px-2 text-gray-300 py-1 rounded-sm text-sm w-fit'>
                                    {item.productInfo.variants.map((variant, index) => (
                                      <option
                                      key={index}
                                      value={variant.id}
                                      className='bg-white text-gray-900'>{variant.name}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <section className="flex justify-between flex-col md:flex-row">
                                  <div className='flex-col space-y-1'>
                                    <h2 className="text-sm">Quantity</h2>
                                    <div className="flex items-center space-x-2">
                                      <span
                                      onClick={() => {
                                        if (item.quantity > 1) {
                                          setCartItems(cartItems.map(cartItem => {
                                            if (cartItem.id == item.id) {
                                              cartItem.quantity--
                                              ;(async () => { await updateItem(item) })()
                                              return cartItem
                                            } else {
                                              return cartItem
                                            }
                                          }))
                                        }
                                      }}
                                      className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">remove</span>
                                      <input
                                      type="number"
                                      value={item.quantity}
                                      onChange={e => {  }}
                                      className="border max-w-2/10 md:max-w-3/10 px-2 rounded-sm appearance-none mr-3 text-center"/>
                                      <span
                                      onClick={() => {
                                        if (item.quantity < item.variantInfo.stock) {
                                          setCartItems(cartItems.map(cartItem => {
                                            if (cartItem.id == item.id) {
                                              cartItem.quantity++
                                              ;(async () => { await updateItem(item) })()
                                              return cartItem
                                            } else {
                                              return cartItem
                                            }
                                          }))
                                        }
                                      }}
                                      className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">add</span>
                                    </div>
                                  </div>
                                  <div className='flex items-end space-x-4'>
                                      <p>Total: <b>₱ {item.variantInfo.price * item.quantity}</b></p>
                                      {!item.ordered && <button
                                      onClick={async () => {
                                        const [isOrdered, orderID] = await order(item)

                                        if (isOrdered) {
                                          await updateItem({ ...item, ordered: true, orderID })
                                          
                                          setCartItems(cartItems.map(cartItem => {
                                            if (cartItem.id == item.id) {
                                              cartItem.ordered = true;
                                              cartItem.orderID = orderID
                                              return cartItem
                                            }

                                            return cartItem
                                          }))
                                        }
                                      }}
                                      className='bg-gray-900 rounded-sm text-gray-300 h-fit text-sm px-4 py-2 cursor-pointer'>
                                        Place Order
                                      </button>}
                                      {(item.ordered) && <button
                                      onClick={async () => {
                                        const isCacelled = await cancelOrder(item.orderID)

                                        if (isCacelled) {
                                          await updateItem({ ...item, ordered: false, orderID: null })
                                          
                                          alert("Order was successfully cancelled.")
                                          setCartItems(cartItems.map(cartItem => {
                                            if (cartItem.id == item.id) {
                                              cartItem.ordered = false;
                                              return cartItem
                                            }

                                            return cartItem
                                          }))
                                        }
                                      }}
                                      className='bg-red-600 rounded-sm text-red-100 h-fit text-sm px-4 py-2 cursor-pointer'>
                                        Cancel
                                      </button>}
                                  </div>
                                </section>
                              </div>
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <div
                          key={index}
                          className='flex flex-col items-stretch shadow-md p-4 rounded-sm space-y-6'
                          >
                            <div
                            className='flex flex-col items-stretch'>
                              <div className='flex items-center space-x-4'>
                                <div
                                style={{ backgroundImage: `url(http://${location.hostname}:3000/file/variants/${item.variantInfo.image})` }}
                                className='min-w-[15vw] min-h-[15vw] max-h-[15vw] md:min-w-[10vw] md:min-h-[10vw] bg-center bg-cover bg-no-repeat rounded-sm'>
                                </div>
                                <div className='flex flex-col'>
                                  <p className='font-bold text-wrap m-0'>{item.productInfo.name}</p>
    
                                  <div className='flex flex-col space-y-1'>
                                    <span className='text-sm'>Variant</span>
                                    <select
                                    value={item.variant}
                                    onChange={e => {
                                      setCartItems(cartItems => cartItems.map(cartItem => {
                                        if (cartItem.variant == item.variant) {
                                          cartItem.variant = e.target.value
                                          cartItem.variantInfo.image = cartItem.productInfo.variants.filter(variant => variant.id == e.target.value)[0].image
                                          ;(async () => { await updateItem(item) })()
                                          return cartItem
                                        } else {
                                          return cartItem
                                        }
                                      }))
                                    }}
                                    className='bg-gray-900 px-2 text-gray-300 py-1 rounded-sm text-sm w-fit'>
                                      {item.productInfo.variants.map((variant, index) => (
                                        <option
                                        key={index}
                                        value={variant.id}
                                        className='bg-white text-gray-900'>{variant.name}</option>
                                      ))}
                                    </select>
                                    <div className='flex-col space-y-1'>
                                      <h2 className="text-sm">Quantity</h2>
                                      <div className="flex items-center space-x-2">
                                        <span
                                        onClick={() => {
                                          if (item.quantity > 1) {
                                            setCartItems(cartItems.map(cartItem => {
                                              if (cartItem.id == item.id) {
                                                cartItem.quantity--
                                                ;(async () => { await updateItem(item) })()
                                                return cartItem
                                              } else {
                                                return cartItem
                                              }
                                            }))
                                          }
                                        }}
                                        className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">remove</span>
                                        <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={e => {  }}
                                        className="border max-w-2/10 md:max-w-3/10 px-2 rounded-sm appearance-none mr-3 text-center"/>
                                        <span
                                        onClick={() => {
                                          if (item.quantity < item.variantInfo.stock) {
                                            setCartItems(cartItems.map(cartItem => {
                                              if (cartItem.id == item.id) {
                                                cartItem.quantity++
                                                ;(async () => { await updateItem(item) })()
                                                return cartItem
                                              } else {
                                                return cartItem
                                              }
                                            }))
                                          }
                                        }}
                                        className="cursor-pointer select-none bg-gray-900 p-1 rounded-sm text-gray-300 material-symbols-outlined">add</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='flex items-center justify-end'>
                              {!item.ordered && <button
                              onClick={async () => {
                                const isCacelled = await cancelOrder(item.orderID)

                                if (isCacelled) {
                                  await updateItem({ ...item, ordered: false, orderID: null })
                                  
                                  alert("Order was successfully cancelled.")
                                  setCartItems(cartItems.map(cartItem => {
                                    if (cartItem.id == item.id) {
                                      cartItem.ordered = false;
                                      return cartItem
                                    }

                                    return cartItem
                                  }))
                                }
                              }}
                              className='z-10 bg-gray-900 rounded-sm text-gray-300 h-fit text-sm p-2 cursor-pointer'>
                                ₱ {item.variantInfo.price * item.quantity} | Place Order
                              </button>}
                              {item.ordered && <button
                                onClick={async () => {
                                  const isCacelled = await cancelOrder(item.orderID)

                                  if (isCacelled) {
                                    await updateItem({ ...item, ordered: false, orderID: null })
                                    
                                    alert("Order was successfully cancelled.")
                                    setCartItems(cartItems.map(cartItem => {
                                      if (cartItem.id == item.id) {
                                        cartItem.ordered = false;
                                        return cartItem
                                      }

                                      return cartItem
                                    }))
                                  }
                                }}
                                className='bg-red-600 rounded-sm text-red-100 h-fit text-sm px-4 py-2 cursor-pointer'>
                                Cancel
                              </button>}
                            </div>
                          </div>
                        )
                      }
                    })}
                  </div>
               </div>
            </div>
         </div>
      </div>
  );
}