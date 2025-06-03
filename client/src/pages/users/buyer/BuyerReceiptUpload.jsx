import { useParams } from 'react-router-dom';
import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { useEffect, useRef, useState } from 'react';

export default function BuyerReceiptUpload() {
  const { width, height } = useViewport()
  const [breakpoint, setGetBreakpoint] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [success, setSuccess] = useState(false)
  const { id, order_id, qr_code } = useParams()

  const uploadReceipt = async () => {
    try {
      const bodyData = new FormData()

      bodyData.append("receipt", receipt)
      bodyData.append("qrCode", qr_code)
      
      const response = await fetch(`http://${location.hostname}:3000/order/edit/`+order_id, {
        method: "PATCH",
        body: bodyData
      })
      const data = await response.json()

      if (response.status != 200) {
        alert(data.message)
        setReceipt(null)

        return
      }

      setSuccess(true)
    } catch (error) {
      console.log(error)
      alert("Order failed. Something went wrong while uploading your receipt.")
    }
  }

  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [])
  
  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width))
  }, [width])

  return (
    <div className="w-screen h-[100dvh] bg-gray-100 text-md md:text-lg text-gray-600 flex items-center justify-center">
      {!success && <section className='w-7/10 max-h-9/10 bg-white rounded-sm shadow-2xl flex flex-col p-6 space-y-4'>
        <span className='text-center'>Upload your payment receipt's screenshot here.</span>

        {receipt && <div className='bg-center bg-cover bg-no-repeat p-6 min-h-[50dvh] rounded-sm' style={{ backgroundImage: `url(${URL.createObjectURL(receipt)})` }}>
        </div>}

        {receipt && <button
        onClick={async () => {
          await uploadReceipt()
        }}
        className='bg-gray-900 px-4 py-2 text-gray-300 flex items-center justify-center rounded-sm'>
          Upload
        </button>}

        {!receipt && <label
        htmlFor="receipt"
        className='bg-gray-900 px-4 py-2 text-gray-300 flex items-center justify-center rounded-sm'
        >
          <span>Select Screenshot</span>
          <input
          id='receipt'
          type="file"
          accept='image/*'
          onChange={e => { setReceipt(e.target.files[0]) }}
          className='hidden'
          />
        </label>}
      </section>}
      {success && <section className='w-7/10 max-h-9/10 bg-white rounded-sm shadow-2xl flex items-center justify-center p-6 space-y-4'>
        <span className='text-center'>Order Success. Thank you for purchasing!</span>
      </section>}
    </div>
  );
}

