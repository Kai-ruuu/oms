import { useState } from "react";

function ProductScan({ amount, qrCodeURL, sellerQrCode, handler, sellerHandler }) {
   const [step, setStep] = useState(1)
   
   if (!qrCodeURL)
      return null
   
   return (
      <div className={`${!qrCodeURL && "hidden"} absolute w-full h-full bg-gray-400/50 flex items-center justify-center z-20`}>
         {step == 1 && <div className="relative min-w-9/10 max-w-9/10 md:min-w-4/10 md:max-w-4/10 h-11/12 bg-white shadow-md rounded-sm p-6 flex flex-col space-y-6 justify-between items-center">
            <span className="text-lg text-center">Please pay ₱ {amount} with Gcash by scanning the qr code bellow</span>
            <div
            style={{ backgroundImage: `url(${sellerQrCode})` }}
            className="w-full h-8/10 bg-center bg-no-repeat bg-contain">

            </div>
            <button
            onClick={() => {
               setStep(2)
            }}
            className="bg-gray-900 px-4 py-2 text-gray-300 rounded-sm shadow-md w-full">Next</button>
         </div>}
         {step == 2 && <div className="relative min-w-9/10 max-w-9/10 md:min-w-4/10 md:max-w-4/10 h-11/12 bg-white shadow-md rounded-sm p-6 flex flex-col space-y-6 justify-between">
            <span className="text-lg text-center">Please scan the qr code below to upload your payment receipt screenshot.</span>
            <div
            style={{ backgroundImage: `url(${qrCodeURL})` }}
            className="w-full h-8/10 bg-center bg-no-repeat bg-contain">
            </div>
            <button
            onClick={() => {
               setStep(1)
               sellerHandler(null)
               handler(null)
            }}
            className="bg-gray-900 px-4 py-2 text-gray-300 rounded-sm shadow-md w-full">Finish</button>
         </div>}
      </div>
   )
}

export default ProductScan;