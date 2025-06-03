const path = require("path")
const qrcode = require("qrcode")

const { storageFolders, remove } = require("../helpers/storage.cjs")

const orderModel = require("../models/order_model.cjs")
const buyerModel = require("../models/buyer_model.cjs")
const productModel = require("../models/product_model.cjs")
const variantModel = require("../models/variant_model.cjs")

class OrderController {
   useDatabase(database) {
      orderModel.useDatabase(database)
      buyerModel.useDatabase(database)
      productModel.useDatabase(database)
      variantModel.useDatabase(database)
   }

   getAll = async (req, res) => {
      try {
         const orders = await orderModel.getAll()

         res.status(200).json({ orders })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching orders (${error})` })
      }
   }

   getSellerOrders = async (req, res) => {
      try {
         const orders = await orderModel.getBySellerID(req.params.id)
         
         for (const order of orders) {
            order.buyerInfo = await buyerModel.getOne(order.buyer)
            order.variantInfo = await variantModel.getOne(order.variant)
            order.productInfo = await productModel.getOne(order.variantInfo.product)
         }

         res.status(200).json({ orders })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching seller orders (${error})` })
      }
   }

   getBuyerOrders = async (req, res) => {
      try {
         const orders = await orderModel.getByBuyerID(req.params.id)
         
         for (const order of orders) {
            order.variantInfo = await variantModel.getOne(order.variant)
            order.productInfo = await productModel.getOne(order.variantInfo.product)
         }

         res.status(200).json({ orders })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching buyer orders (${error})` })
      }
   }

   add = async (req, res) => {
      try {
         const inputData = { ...req.body }

         console.log(inputData)

         const existingOrder = await orderModel.getByVariantIDAndBuyerID(inputData.variant, inputData.buyer)

         if (existingOrder) {
            return res.status(400).json({ message: "Cart item already exists. You may edit it instead." })
         }

         const order = await orderModel.add({ ...inputData, status: "unprepared" })

         const receiptImageName = Date.now() + "-receipt.png"
         const receiptImagePath = path.join(storageFolders.receiptQrCodes, receiptImageName)
         
         qrcode.toFile(
            receiptImagePath,
            `http://${req.hostname}:5173/receipt_upload/${inputData.buyer}/${order.id}/${receiptImageName}`,
            {
               dark: "#000",
               light: "#FFF"
            },
            async function(error) {
               if (error) {
                  await orderModel.delete(order.id)
                  await remove(storageFolders.receiptQrCodes, receiptImageName)

                  return res.status(500).json({ message: "Failed to order. Unable to create receipt upload URL." })
               } else {
                  return res.status(201).json({ order, receiptImageName })
               }
            }
         )
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while adding order (${error})` })
      }
   }

   editByID = async (req, res) => {
      try {
         const receipt = req.files?.receipt?.[0].filename
         const inputData = { ...req.body, receipt }
         
         const existingOrder = await orderModel.getOne(req.params.id)

         if (!existingOrder) {
            return res.status(400).json({ message: "Order does not exist." })
         }

         if (receipt) {
            await remove(storageFolders.receipts, existingOrder.receipt)
            await remove(storageFolders.receiptQrCodes, req.body.qrCode)
         }

         const order = await orderModel.update(req.params.id, inputData)

         res.status(200).json({
            message: "Order updated.",
            order
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while editing order (${error})` })
      }
   }

   deleteByID = async (req, res) => {
      try {
         await orderModel.delete(req.params.id)

         res.status(200).json({ message: "Cart item deleted." })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while deleting order (${error})` })
      }
   }
}

module.exports = new OrderController()
