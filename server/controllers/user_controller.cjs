const bcrypt = require("bcrypt")

const { storageFolders, remove } = require("../helpers/storage.cjs")

const sellerModel = require("../models/seller_model.cjs")
const productModel = require("../models/product_model.cjs")
const variantModel = require("../models/variant_model.cjs")

const buyerModel = require("../models/buyer_model.cjs")

class SellerController {
   useDatabase(database) {
      sellerModel.useDatabase(database)
      buyerModel.useDatabase(database)
   }

   getAllSellers = async (req, res) => {
      try {
         const sellers = await sellerModel.getAll()

         res.status(200).json({ sellers })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching sellers (${error})` })
      }
   }

   getAllBuyers = async (req, res) => {
      try {
         const buyers = await buyerModel.getAll()

         res.status(200).json({ buyers })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching buyers (${error})` })
      }
   }

   registerSeller = async (req, res) => {
      try {
         const shopLogo = req.files?.shopLogo?.[0].filename
         const qrCode = req.files?.qrCode?.[0].filename
         const inputData = { ...req.body, shopLogo, qrCode }

         const existingSeller = await sellerModel.getByEmail(inputData.shopEmail)

         if (existingSeller) {
            await remove(storageFolders.logos, shopLogo)
            await remove(storageFolders.qrCodes, qrCode)
            
            return res.status(400).json({
               message: "You are already registered, please login instead."
            })
         }

         const hashedPassword = await bcrypt.hash(inputData.password, 10)

         const seller = await sellerModel.add({ ...inputData, password: hashedPassword })

         res.status(201).json({
            message: "You are now registered.",
            seller
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while registering seller (${error})` })
      }
   }

   registerBuyer = async (req, res) => {
      try {
         const inputData = req.body

         const existingSeller = await sellerModel.getByEmail(inputData.email)

         if (existingSeller) {
            return res.status(400).json({
               message: "You are already registered, please login instead."
            })
         }

         const hashedPassword = await bcrypt.hash(inputData.password, 10)

         const buyer = await buyerModel.add({ ...inputData, password: hashedPassword })

         res.status(201).json({
            message: "You are now registered.",
            buyer
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while registering buyer (${error})` })
      }
   }

   updateSeller = async (req, res) => {
      try {
         const shopLogo = req.files?.shopLogo?.[0].filename
         const qrCode = req.files?.qrCode?.[0].filename
         const inputData = { ...req.body, shopLogo, qrCode }

         const existingSeller = await sellerModel.getOne(req.params.id)

         if (!existingSeller) {
            return res.status(404).json({ message: "User not found." })
         }
         
         if (!inputData.shopLogo) {
            delete inputData.shopLogo
         } else {
            await remove(storageFolders.logos, existingSeller.shopLogo)
         }
         
         if (!inputData.qrCode) {
            delete inputData.qrCode
         } else {
            await remove(storageFolders.qrCodes, existingSeller.qrCode)
         }

         if (inputData.password) {
            inputData.password = await bcrypt.hash(inputData.password, 10)
         }

         const seller = await sellerModel.update(req.params.id, inputData)

         res.status(200).json({
            message: "Your information has been updated.",
            seller
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while updating seller (${error})` })
      }
   }

   updateBuyer = async (req, res) => {
      try {
         const inputData = { ...req.body }

         const existingBuyer = await buyerModel.getOne(req.params.id)

         if (!existingBuyer) {
            return res.status(404).json({ message: "User not found." })
         }

         const buyer = await buyerModel.update(req.params.id, inputData)

         res.status(200).json({
            message: "Your information has been updated.",
            buyer
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while updating buyer (${error})` })
      }
   }

   removeSeller = async (req, res) => {
      try {
         const existingSeller = await sellerModel.getOne(req.params.id)

         if (!existingSeller) {
            return res.status(404).json({ message: "User not found." })
         }

         const products = await productModel.getBySellerID(req.params.id)

         for (const product of products) {
            const variants = await variantModel.getByProductID(product.id)

            for (const variant of variants) {
               await variantModel.delete(variant.id)
               await remove(storageFolders.variants, variant.image)
            }

            await productModel.delete(product.id)
         }

         await sellerModel.delete(req.params.id)
         await remove(storageFolders.logos, existingSeller.shopLogo)
         await remove(storageFolders.qrCodes, existingSeller.qrCode)

         res.status(200).json({ message: "Account has been removed." })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while removing the account (${error})` })
      }
   }

   removeBuyer = async (req, res) => {
      try {
         const existingBuyer = await buyerModel.getOne(req.params.id)

         if (!existingBuyer) {
            return res.status(404).json({ message: "User not found." })
         }
         
         await buyerModel.delete(req.params.id)
         
         res.status(200).json({ message: "Account has been removed." })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while removing the account (${error})` })
      }
   }

   loginUser = async (req, res) => {
      try {
         let role = "buyer"
         let user = await buyerModel.getByEmail(req.body.email)

         if (!user) {
            role = "seller"
            user = await sellerModel.getByEmail(req.body.email)
         }

         if (!user) {
            return res.status(400).json({ message: "Login failed. Incorrect email or password." })
         }
         
         const isPasswordMatched = await bcrypt.compare(req.body.password, user.password)
         
         if (!isPasswordMatched) {
            return res.status(400).json({ message: "Login failed. Incorrect email or password." })
         }

         res.status(200).json({ message: "Welcome back", user, role })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while logging in (${error})` })
      }
   }
}

module.exports = new SellerController()
