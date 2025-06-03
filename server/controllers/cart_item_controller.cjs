const bcrypt = require("bcrypt")

const { storageFolders, remove } = require("../helpers/storage.cjs")

const cartItemModel = require("../models/cart_item_model.cjs")
const sellerModel = require("../models/seller_model.cjs")
const variantModel = require("../models/variant_model.cjs")
const productModel = require("../models/product_model.cjs")
const orderModel = require("../models/order_model.cjs")

class CartItemController {
   useDatabase(database) {
      cartItemModel.useDatabase(database)
      sellerModel.useDatabase(database)
      variantModel.useDatabase(database)
      productModel.useDatabase(database)
      orderModel.useDatabase(database)
   }

   getAll = async (req, res) => {
      try {
         const cartItems = await cartItemModel.getAll()

         res.status(200).json({ cartItems })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching cart items (${error})` })
      }
   }

   getBuyerCart = async (req, res) => {
      try {
         const cartItems = await cartItemModel.getByBuyerID(req.params.id)
         
         for (const item of cartItems) {
            item.variantInfo = await variantModel.getOne(item.variant)
            item.productInfo = await productModel.getOne(item.variantInfo.product)
            item.sellerInfo = await sellerModel.getOne(item.productInfo.seller)
            item.productInfo.variants = await variantModel.getByProductID(item.productInfo.id)
            item.status = await orderModel.get
         }

         res.status(200).json({ cartItems })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching cart buyer cart items (${error})` })
      }
   }

   add = async (req, res) => {
      try {
         const inputData = { ...req.body }

         const cartItems = await cartItemModel.getByBuyerID(inputData.buyer)
         const existingCartItem = cartItems.filter(item => item.variant === inputData.variant)
         
         if (existingCartItem.length > 0) {
            return res.status(400).json({ message: "Cart item already exists. You may edit it instead." })
         }

         const cartItem = await cartItemModel.add(inputData)

         res.status(201).json({ cartItem })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while adding cart item (${error})` })
      }
   }

   editByID = async (req, res) => {
      try {
         console.log({ ...req.body })
         const existingCartItem = await cartItemModel.getOne(req.params.id)

         if (!existingCartItem) {
            return res.status(400).json({ message: "Cart item does not exist." })
         }

         const cartItem = await cartItemModel.update(req.params.id, { ...req.body })

         res.status(200).json({
            message: "Cart item updated.",
            cartItem
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while editing cart item (${error})` })
      }
   }

   deleteByID = async (req, res) => {
      try {
         await cartItemModel.delete(req.params.id)

         res.status(200).json({ message: "Cart item deleted." })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while deleting cart item (${error})` })
      }
   }
}

module.exports = new CartItemController()
