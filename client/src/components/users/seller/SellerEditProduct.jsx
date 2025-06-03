import { use, useEffect, useRef, useState } from "react"

function SellerEditProduct({ breakpoint, product, on, handler, setProducts }) {
   const [tab, setTab] = useState("product")

   const [name, setName] = useState("")
   const [description, setDescription] = useState("")
   const [variants, setVariants] = useState([])

   const [variantEditOn, setVariantEditOn] = useState(false)
   const [variantName, setVariantName] = useState("")
   const [variantImage, setVariantImage] = useState(null)
   const [variantPrice, setVariantPrice] = useState(0)
   const [variantStock, setVariantStock] = useState(0)
   const [variantID, setVariantID] = useState(0)

   const addVariantImageRef = useRef(null)
   const editVariantImageRef = useRef(null)

   const addVariant = async variantData => {
      try {
         const response = await fetch(`http://${location.hostname}:3000/variant/add`, {
            method: "POST",
            body: variantData
         })
         const data = await response.json()

         
         if (response.status != 201) {
            alert("Failed to add the variant. Please try again.")
            
            return null
         } else {
            alert("Variant added.")

            return data.variant
         }
         
      } catch (error) {
         console.error(error)
         alert(`An error occurred while adding ${variantData.get("name")} variant.`)
      }
   }
   
   const updateProduct = async (productData, productID) => {
      try {
         const response = await fetch(`http://${location.hostname}:3000/product/edit/` + productID, {
            method: "PATCH",
            body: productData
         })
         const data = await response.json()

         if (response.status != 200)
            alert("Failed to update the variant. Please try again.")
         else {
            alert("Product updated.")

            setProducts(products =>
               products.map(_product =>
                  _product.id === productID
                     ? { ...data.product, variants: _product.variants }
                     : _product
               )
            )
         }
      } catch (error) {
         console.error(error)
         alert(`An error occurred while updating product.`)
      }
   }

   const updateVariant = async (variantData, variantID) => {
      try {
         const response = await fetch(`http://${location.hostname}:3000/variant/edit/` + variantID, {
            method: "PATCH",
            body: variantData
         })
         const data = await response.json()

         if (response.status != 200)
            alert("Failed to update the variant. Please try again.")
         else {
            alert("Variant updated.")

            setVariants(variants => variants.map(variant => 
               variant.id === variantID
                  ? data.variant
                  : variant
            ))

            setProducts(_product =>
               _product.map(product => ({
                  ...product,
                  variants: product.variants.map(variant =>
                     variant.id === variantID
                        ? data.variant
                        : variant
                  )
               }))
            )
         }
      } catch (error) {
         console.error(error)
         alert(`An error occurred while updating variant.`)
      }
   }

   const deleteProduct = async productID => {
      try {
         const response = await fetch(`http://${location.hostname}:3000/product/delete/` + productID, { method: "DELETE" })
         const data = await response.json()

         if (response.status != 200) {
            alert("Failed to delete the product. Please try again.")
         } else {
            alert(data.message)

            setProducts(_products =>
               _products.filter(_product =>
                  _product.id !== productID
               )
            )
            clearProductEditor()
            handler(!on)
         }
      } catch (error) {
         console.error(error)
         alert("An error occurred while deleteing the product.")
      }
   }

   const deleteVariant = async variantID => {
      try {
         const response = await fetch(`http://${location.hostname}:3000/variant/delete/` + variantID, { method: "DELETE" })
         const data = await response.json()

         if (response.status != 200) {
            alert("Failed to delete the product. Please try again.")
         } else {
            alert(data.message)

            setVariants(_variants =>
               _variants.filter(_variant =>
                  _variant.id !== variantID
               )
            )
            setProducts(_products =>
               _products.map(product => ({
                  ...product,
                  variants: product.variants.filter(_variant => _variant.id != variantID)
               }))
            )
            clearProductEditor()
            clearVariantEditor(true)
         }
      } catch (error) {
         console.error(error)
         alert("An error occurred while deleteing the product.")
      }
   }

   const clearProductEditor = () => {
      setName("")
      setDescription("")
      setVariants([])
   }

   const clearVariantEditor = (closeEditor = true) => {
      setVariantName("")
      setVariantStock(0)
      setVariantPrice(0)
      setVariantImage(null)
      setVariantID(null)
      setVariantEditOn(!closeEditor)
   }
   
   useEffect(() => {
      if (product) {
         setName(product.name)
         setDescription(product.description ? product.description : "")
         setVariants(product.variants)
      }
   }, [product])

   if (!product)
      return <div></div>
   
   return (
      <div className={`${!on && "hidden"} absolute w-full h-full bg-gray-400/50 flex items-center justify-center z-50`}>
         <div className="max-w-9/10 md:min-w-4/10 h-11/12 bg-white shadow-md rounded-sm p-6 flex flex-col space-y-6">
            <div className="flex items-center space-x-4 md:justify-between">
               <div className="flex space-x-4 overflow-x-auto max-w-[6/10]">
                  <div
                  onClick={() => {
                     setTab("product")
                     clearVariantEditor()
                  }}
                  className={`min-w-1/2 md:min-w-auto text-center border border-gray-900 rounded-sm px-3 py-2 cursor-pointer ${tab == "product" ? "bg-gray-900 text-gray-300" : "bg-transparent text-gray-900"}`}>
                     <h1 className="text-sm">Edit Product</h1>
                  </div>
                  <div
                  onClick={() => {
                     setTab("variants")
                  }}
                  className={`min-w-1/2 md:min-w-auto text-center border border-gray-900 rounded-sm px-3 py-2 cursor-pointer ${tab == "variants" ? "bg-gray-900 text-gray-300" : "bg-transparent text-gray-900"}`}>
                     <h1 className="text-sm">Edit Variants</h1>
                  </div>
                  <div
                  onClick={() => {
                     setTab("add_variants")
                     clearVariantEditor()
                  }}
                  className={`min-w-1/2 md:min-w-auto text-center border border-gray-900 rounded-sm px-3 py-2 cursor-pointer ${tab == "add_variants" ? "bg-gray-900 text-gray-300" : "bg-transparent text-gray-900"}`}>
                     <h1 className="text-sm">Add Variants</h1>
                  </div>
               </div>
               <div
               onClick={() => {
                  clearProductEditor()
                  clearVariantEditor()
                  handler(!on)
               }}
               className="border min-w-10 h-10 rounded-sm flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined">close</span>
               </div>
            </div>

            {/* EDIT PRODUCT */}
            <div className={`${tab != "product" && "hidden"} flex-grow space-y-4 flex flex-col`}>
               <section className='flex flex-col space-y-2'>
                  <label htmlFor="name">Product Name</label>
                  <input
                  type="text"
                  id='name'
                  placeholder='Mini Fan'
                  value={name || ""}
                  onChange={e => { setName(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>
               <section className='flex flex-col space-y-2'>
                  <label htmlFor="description">Description</label>
                  <textarea
                  id="description"
                  onChange={e => { setDescription(e.target.value) }}
                  rows="4"
                  value={description ? description : "" }
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0 resize-none'
                  ></textarea>
               </section>
               <div className="flex-grow flex items-end justify-end">
                  <div className="flex items-center space-x-2">
                     <button className="border border-gray-900 text-gray-900 rounded-sm min-w-11 min-h-11 cursor-pointer">
                        <span className="pt-1 material-symbols-outlined">refresh</span>
                     </button>
                     <button
                     onClick={async () => {
                        const confirmed = window.confirm("Delete product?")

                        if (confirmed)
                           await deleteProduct(product.id)
                     }}
                     className={`md:min-w-auto text-center border bg-red-700 rounded-sm px-3 py-2 cursor-pointer text-red-100`}>
                        <h1>Delete</h1>
                     </button>
                     <button
                     onClick={() => {
                        ;(async () => {
                           const productData = new FormData()

                           productData.append("name", name)
                           productData.append("description", description)

                           await updateProduct(productData, product.id)
                        })()
                     }}
                     className="bg-gray-900 text-gray-300 rounded-sm px-4 py-2 cursor-pointer">Update</button>
                  </div>
               </div>
            </div>

            {/* EDIT VARIANT */}
            <div className={`${tab != "variants" && "hidden"} flex-grow flex flex-col`}>
               {!variantEditOn && <div className={`w-full max-h-[70dvh] md:max-h-[64dvh] space-y-4 md:grid md:grid-cols-2 md:gap-6 flex flex-col overflow-y-auto`}>
                  {variants?.map((variant, index) => (
                     <div key={index} className='mb-4 rounded-sm overflow-clip w-full flex md:flex-col shadow-md z-10 min-h-[42dvh]'>
                        <div className='flex-grow w-full flex flex-col items-stretch relative'>
                           <div
                           onClick={() => { location.href = `http://${location.hostname}:3000/file/variants/${variant.image}` }}
                           style={{backgroundImage: `url(http://${location.hostname}:3000/file/variants/${variant.image})`}}
                           className="w-full flex-grow bg-cover rounded-tl-sm rounded-tr-sm relative bg-center">
                              <div className="absolute left-2 bottom-2 text-sm bg-white rounded-sm shadow-md pl-2 pr-3 py-1 flex items-center gap-x-1">
                                 <span className="material-symbols-outlined">box</span>
                                 <span>Stock {variant.stock}</span>
                              </div>
                           </div>
                           <div className='flex items-center px-3 py-3 space-x-3 w-full bg-white'>
                              <div className='flex flex-col flex-grow relative'>
                                 <span>{variant.name}</span>
                                 <span className='text-sm font-bold'>{`₱ ${variant.price}`}</span>
                              </div>
                              <span
                              onClick={() => {
                                 setVariantEditOn(true)
                                 setVariantName(variant.name)
                                 setVariantStock(variant.stock)
                                 setVariantPrice(variant.price)
                                 setVariantImage(variant.image)
                                 setVariantID(variant.id)
                              }}
                              className="cursor-pointer material-symbols-outlined">edit</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>}
               <div className={`${!variantEditOn && "hidden"} w-full h-full flex flex-col space-y-4`}>
                  {/* variant name */}
                  <section className='flex flex-col space-y-2'>
                     <label htmlFor="edit-variant-name">Variant Name</label>
                     <input
                     type="text"
                     id='edit-variant-name'
                     required
                     placeholder='Blue'
                     value={variantName}
                     onChange={e => { setVariantName(e.target.value) }}
                     className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                     />
                  </section>

                  {/* variant stock */}
                  <section className='flex flex-col space-y-2'>
                     <label htmlFor="edit-variant-stock">Stock</label>
                     <input
                     type="number"
                     id='edit-variant-stock'
                     required
                     placeholder='50'
                     value={variantStock}
                     onChange={e => { setVariantStock(e.target.value) }}
                     className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                     />
                  </section>
                  
                  {/* variant price */}
                  <section className='flex flex-col space-y-2'>
                     <label htmlFor="edit-variant-price">Price</label>
                     <input
                     type="number"
                     id='edit-variant-price'
                     required
                     placeholder='130.00'
                     value={variantPrice}
                     onChange={e => { setVariantPrice(e.target.value) }}
                     className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                     />
                  </section>

                  {/* variant image */}
                  <section className='flex flex-grow flex-col space-y-2 my-4'>
                     {breakpoint == "xs" && variantImage && <div style={{ backgroundImage: `url(${(() => {
                        try {
                           return URL.createObjectURL(variantImage)
                        } catch {
                           return `http://${location.hostname}:3000/file/variants/${variantImage}`
                        }
                     })()})` }}  className="bg-red h-full rounded-sm border overflow-clip bg-center bg-no-repeat bg-contain relative">
                        <div
                        onClick={() => {
                           setVariantImage(null)
                         }}
                        className="absolute top-2 left-2 border w-10 h-10 rounded-sm flex items-center justify-center cursor-pointer">
                           <span className="material-symbols-outlined">close</span>
                        </div>
                     </div>}

                     {breakpoint != "xs" && variantImage && <div className="flex items-center w-full space-x-4">
                        <div className="border border-gray-900 text-gray-900 py-2 rounded-sm text-center flex-grow">{variantImage.name || variantImage}</div>
                        <label htmlFor="edit-variant-image">
                           <input
                           ref={editVariantImageRef}
                           type="file"
                           id='edit-variant-image'
                           name='image'
                           accept='image/*'
                           onChange={e => { setVariantImage(e.target.files[0]) }}
                           className="hidden"
                           />
                           <div
                           className='bg-gray-900 text-gray-300 px-4 py-2 rounded-sm text-center cursor-pointer'
                           >Change</div>
                        </label>
                     </div>}

                     {!variantImage && <label htmlFor="edit-variant-image">
                           {variantName} variant image
                           <input
                           ref={editVariantImageRef}
                           type="file"
                           id='edit-variant-image'
                           name='image'
                           onChange={e => { setVariantImage(e.target.files[0]) }}
                           className="hidden"
                           />
                           <div
                           className='bg-gray-900 text-gray-300 py-2 rounded-sm text-center cursor-pointer'
                           >
                           { !variantImage ? "Upload" : variantImage.name}
                           </div>
                     </label>}
                  </section>
               </div>
               <div className={`${!variantEditOn && "hidden"} flex items-center justify-end space-x-2 w-full`}>
                  <button className="border border-gray-900 text-gray-900 rounded-sm min-w-11 min-h-11 cursor-pointer">
                     <span className="pt-1 material-symbols-outlined">refresh</span>
                  </button>
                  <button
                     onClick={async () => {
                        if (variants.length <= 1) {
                           alert("There must be at least one variant per product. You may delete the product instead.")
                           
                           return
                        }
                        
                        const confirmed = window.confirm("Delete variant?")

                        if (confirmed)
                           await deleteVariant(variantID)
                     }}
                     className={`md:min-w-auto text-center bg-red-700 rounded-sm px-3 py-2 cursor-pointer text-red-100`}>
                        <h1>Delete</h1>
                     </button>
                  <button
                  onClick={() => {
                     (async () => {
                        const variantData = new FormData()

                        variantData.append("name", variantName)
                        variantData.append("stock", variantStock)
                        variantData.append("price", variantPrice)
                        variantData.append("image", variantImage)
                        
                        await updateVariant(variantData, variantID)
                     })()
                  }}
                  className="bg-gray-900 text-gray-300 rounded-sm px-4 py-2 cursor-pointer">Update</button>
               </div>
            </div>

            {/* ADD VARIANT */}
            <div className={`${tab != "add_variants" && "hidden"} w-full h-full flex flex-col space-y-4`}>
               {/* variant name */}
               <section className='flex flex-col space-y-2'>
                  <label htmlFor="add-variant-name">Variant Name</label>
                  <input
                  type="text"
                  id='add-variant-name'
                  required
                  placeholder='Blue'
                  value={variantName}
                  onChange={e => { setVariantName(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>

               {/* variant stock */}
               <section className='flex flex-col space-y-2'>
                  <label htmlFor="add-variant-stock">Stock</label>
                  <input
                  type="number"
                  id='add-variant-stock'
                  required
                  placeholder='50'
                  value={variantStock}
                  onChange={e => { setVariantStock(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>
               
               {/* variant price */}
               <section className='flex flex-col space-y-2'>
                  <label htmlFor="add-variant-price">Price</label>
                  <input
                  type="number"
                  id='add-variant-price'
                  required
                  placeholder='130.00'
                  value={variantPrice}
                  onChange={e => { setVariantPrice(e.target.value) }}
                  className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
                  />
               </section>

               {/* variant image */}
               <section className='flex flex-grow flex-col space-y-2 my-4'>
                  {breakpoint == "xs" && variantImage && <div style={{ backgroundImage: `url(${(() => {
                     try {
                        return URL.createObjectURL(variantImage)
                     } catch {
                        return `http://${location.hostname}:3000/file/variants/${variantImage}`
                     }
                  })()})` }}  className="bg-red h-full rounded-sm border overflow-clip bg-center bg-no-repeat bg-contain relative">
                     <div
                     onClick={() => {
                        setVariantImage(null)
                        if (addVariantImageRef.current) addVariantImageRef.current.value = ""
                      }}
                     className="absolute top-2 left-2 border w-10 h-10 rounded-sm flex items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined">close</span>
                     </div>
                  </div>}

                  {breakpoint != "xs" && variantImage && <div className="flex items-center w-full space-x-4">
                     <div className="border border-gray-900 text-gray-900 py-2 rounded-sm text-center flex-grow">{variantImage.name || variantImage}</div>
                     <label htmlFor="add-variant-image-change">
                        <input
                        type="file"
                        id='add-variant-image-change'
                        name='image'
                        accept='image/*'
                        onChange={e => {
                           setVariantImage(e.target.files[0])
                        }}
                        className="hidden"
                        />
                        <div
                        className='bg-gray-900 text-gray-300 px-4 py-2 rounded-sm text-center cursor-pointer'
                        >Change</div>
                     </label>
                  </div>}

                  {!variantImage && <label htmlFor="add-variant-image">
                        <span>{variantName || "Variant"} image</span>
                        <input
                        ref={addVariantImageRef}
                        type="file"
                        id='add-variant-image'
                        name='image'
                        accept='image/*'
                        onChange={e => {
                           setVariantImage(e.target.files[0])
                        }}
                        className="hidden"
                        />
                        <div
                        className='bg-gray-900 text-gray-300 py-2 rounded-sm text-center cursor-pointer'
                        >
                        Upload
                        </div>
                  </label>}
               </section>
               <div className="flex-grow flex items-end justify-end">
                  <div className="flex items-center space-x-2">
                     <button
                     onClick={() => {
                        clearVariantEditor()
                        if (addVariantImageRef.current) addVariantImageRef.current.value = ""
                     }}
                     className="border border-gray-900 text-gray-900 rounded-sm min-w-11 min-h-11 cursor-pointer">
                        <span className="pt-1 material-symbols-outlined">refresh</span>
                     </button>
                     <button
                     onClick={() => {
                        (async () => {
                           const newVariant = new FormData()
                           
                           newVariant.append("name", variantName)
                           newVariant.append("stock", variantStock)
                           newVariant.append("price", variantPrice)
                           newVariant.append("image", variantImage)
                           newVariant.append("product", product.id)

                           const addedVariant = await addVariant(newVariant)
                           
                           if (addedVariant) {
                              setVariants(_variants => [ ..._variants, addedVariant ])
                              setVariantName("")
                              setVariantStock(0)
                              setVariantPrice(0)
                              setVariantImage(null)
                              
                              if (addVariantImageRef.current) addVariantImageRef.current.value = ""
                              
                              setProducts(_products =>
                                 _products.map(product => ({
                                    ...product,
                                    variants: [ ...product.variants, addedVariant ]
                                 }))
                              )
                           }
                        })()
                     }}
                     className="bg-gray-900 text-gray-300 rounded-sm px-4 py-2 cursor-pointer">Add</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default SellerEditProduct