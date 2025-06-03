import { useEffect, useRef, useState } from "react"

function SellerAddProduct({ breakpoint, on, handler, sellerID, setProducts }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [variants, setVariants] = useState([])
  const [variantName, setVariantName] = useState("")
  const [variantImage, setVariantImage] = useState(null)
  const [variantPrice, setVariantPrice] = useState(0)
  const [variantStock, setVariantStock] = useState(0)
  const imageRef = useRef(null)

  const getVariants = async productID => {
    try {
      const response = await fetch(`http://${location.hostname}:3000/product/product/` + productID)
      const data = await response.json()

      return data.variants
    } catch (error) {
      console.error(error)
      alert(`An error occurred while adding ${variantData.get("name")} variant.`)

      return []
    }
  }
  
  const addVariant = async variantData => {
    try {
      await fetch(`http://${location.hostname}:3000/variant/add`, {
        method: "POST",
        body: variantData
      })
    } catch (error) {
      console.error(error)
      alert(`An error occurred while adding ${variantData.get("name")} variant.`)
    }
  }

  const addProduct = async () => {
    try {
      const productData = new FormData()
      productData.append("name", name)
      productData.append("description", description)
      productData.append("seller", sellerID)
      
      const response = await fetch(`http://${location.hostname}:3000/product/add`, {
        method: "POST",
        body: productData
      })
      const data = await response.json()

      if (!response == 201) {
        alert(data.message)

        return
      }

      for (const variant of variants) {
        variant.append("product", data.product.id)
        await addVariant(variant)
      }

      setVariants([])
      setVariantImage(null)

      if (imageRef.current) imageRef.current.value = ""

      const fetchedVariants = await getVariants(data.product.id)

      setProducts(setProducts => [...setProducts, { ...data.product, variants: fetchedVariants }])
    } catch (error) {
      console.error(error)
      alert("An error occurred while adding product")
    }
  }

  useEffect(() => {
    setName(null)
    setDescription(null)
    setVariants([])
    setVariantName("")
    setVariantImage(null)
    setVariantPrice(0)
    setVariantStock(0)
  }, [])
  
  return (
    <div className={`${!on && "hidden"} absolute w-full h-full bg-gray-400/50 flex items-center justify-center z-50`}>
      <div
      className="sm:min-w-full md:min-w-4/10 h-11/12 bg-white shadow-md rounded-sm p-6 flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <div
          onClick={() => {
            setName("")
            setDescription("")
            setVariantName("")
            setVariantStock(0)
            setVariantPrice(0)
            setVariantImage(null)

            if (imageRef.current) imageRef.current.value = ""
            setVariants([])
            setStep(1)
            handler(!on)
          }}
          className="border w-10 h-10 rounded-sm flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </div>
          <h1 className="font-bold">{ step == 1 ? "Add Product" : "Add Variant" }</h1>
        </div>
        <form className="flex-grow flex items-stretch flex-col justify-between space-y-4 overflow-y-auto">
          {step == 1 && <div className="space-y-4">
            <section className='flex flex-col space-y-2'>
              <label htmlFor="name">Product Name</label>
              <input
              type="text"
              id='name'
              required
              placeholder='Mini Fan'
              onChange={e => { setName(e.target.value) }}
              className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
              />
            </section>
            <section className='flex flex-col space-y-2'>
              <label htmlFor="name">Description</label>
              <textarea
              onChange={e => { setDescription(e.target.value) }}
              rows="4"
              className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0 resize-none'
              ></textarea>
            </section>
          </div>}
          {step == 2 && <div className="space-y-4 flex-grow flex flex-col overflow-y-auto">
            {/* variant name */}
            <section className='flex flex-col space-y-2'>
              <label htmlFor="name">Variant Name</label>
              <input
              type="text"
              id='name'
              required
              placeholder='Blue'
              value={variantName}
              onChange={e => { setVariantName(e.target.value) }}
              className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
              />
            </section>

            {/* variant stock */}
            <section className='flex flex-col space-y-2'>
              <label htmlFor="name">Stock</label>
              <input
              type="number"
              id='name'
              required
              placeholder='50'
              value={variantStock}
              onChange={e => { setVariantStock(e.target.value) }}
              className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
              />
            </section>
            
            {/* variant price */}
            <section className='flex flex-col space-y-2'>
              <label htmlFor="name">Price</label>
              <input
              type="number"
              id='name'
              required
              placeholder='130.00'
              value={variantPrice}
              onChange={e => { setVariantPrice(e.target.value) }}
              className='border border-gray-500 py-2 md:py-1 px-4 md:px-2 rounded-sm m-0'
              />
            </section>

            {/* variant image */}
            <section className='flex flex-grow flex-col space-y-2 my-1'>
              {breakpoint == "xs" && variantImage && <div style={{ backgroundImage: `url(${URL.createObjectURL(variantImage)})` }}  className="bg-red h-full rounded-sm border overflow-clip bg-center bg-no-repeat bg-contain relative">
                <div
                onClick={() => {
                  setVariantImage(null)

                  if (imageRef.current) imageRef.current.value = ""
                }}
                className="absolute top-2 left-2 border w-10 h-10 rounded-sm flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined">close</span>
                </div>
              </div>}

              {breakpoint != "xs" && variantImage && <div className="flex items-center w-full space-x-4">
                <div className="border border-gray-900 text-gray-900 py-2 rounded-sm text-center flex-grow">{variantImage.name}</div>
                <label htmlFor="image">
                  <input
                  type="file"
                  id='image'
                  name='image'
                  accept='image/*'
                  ref={imageRef}
                  onChange={e => { setVariantImage(e.target.files[0]) }}
                  className="hidden"
                  />
                  <div
                  className='bg-gray-900 text-gray-300 px-4 py-2 rounded-sm text-center'
                  >Change</div>
                </label>
              </div>}

              {!variantImage && <label htmlFor="image">
                  {variantName} variant image
                  <input
                  type="file"
                  id='image'
                  name='image'
                  accept='image/*'
                  ref={imageRef}
                  onChange={e => { setVariantImage(e.target.files[0]) }}
                  className="hidden"
                  />
                  <div
                  className='bg-gray-900 text-gray-300 py-2 rounded-sm text-center'
                  >
                    { !variantImage ? "Upload" : variantImage.name}
                  </div>
              </label>}
            </section>

            {(variantName != "" && variantStock != 0 && variantPrice != 0 && variantImage) && <div className="mt-4 flex justify-end">
              <button
              onClick={() => {
                const variantData = new FormData()
                variantData.append("name", variantName)
                variantData.append("stock", variantStock)
                variantData.append("price", variantPrice)
                variantData.append("image", variantImage)
                
                setVariants(variants => [...variants, variantData])

                setVariantName("")
                setVariantStock(0)
                setVariantPrice(0)
                setVariantImage(null)

                if (imageRef.current) imageRef.current.value = ""
              }}
              className="bg-gray-900 py-1 px-4 text-gray-300 rounded-sm">Add</button>
            </div>}
          </div>}
          <div className="flex justify-end space-x-4">
            {step > 1 && <button
            onClick={() => {
              if (step > 1)
                setStep(step - 1)
            }}
            className="border px-2 rounded-sm cursor-pointer">
              <span className="pt-2 material-symbols-outlined">chevron_left</span>
            </button>}
            <button
            onClick={e => {
              e.preventDefault()

              
              if (step < 2) {
                setStep(step + 1)
              } else {
                if (variants.length <= 0) {
                  alert("Please add at least one variant first.")
  
                  return
                }
                
                ;(async () => {
                  await addProduct()
                  setName("")
                  setDescription("")
                  setStep(1)
                })()
                handler(!on)
              }
            }}
            className="bg-gray-900 text-gray-300 px-4 py-2 rounded-sm cursor-pointer">{step == 1 ? "Next" : "Done"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerAddProduct