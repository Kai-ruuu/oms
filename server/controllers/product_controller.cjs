const bcrypt = require("bcrypt")

const { storageFolders, remove } = require("../helpers/storage.cjs")

const sellerModel = require("../models/seller_model.cjs")
const productModel = require("../models/product_model.cjs")
const variantModel = require("../models/variant_model.cjs")

class ProductController {
   useDatabase(database) {
      sellerModel.useDatabase(database)
      productModel.useDatabase(database)
      variantModel.useDatabase(database)
   }

   getAll = async (req, res) => {
      try {
         const products = await productModel.getAll()

         res.status(200).json({ products })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching products (${error})` })
      }
   }

   getLatest = async (req, res) => {
      try {
         const products = await productModel.getBySorting("-created")

         for (const product of products) {
            product.sellerInfo = await sellerModel.getOne(product.seller)
            product.variants = await variantModel.getByProductID(product.id)
         }

         res.status(200).json({ products })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occured while fetching latest products. (${error})` })
      }
   }

   getVariants = async (req, res) => {
      try {
         const variants = await variantModel.getByProductID(req.params.id)

         res.status(200).json({ variants })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching product variants (${error})` })
      }
   }

   getSellerProducts = async (req, res) => {
      try {
         const products = await productModel.getBySellerID(req.params.id)
         const fetchedProducts = []

         for (const product of products) {
            const expanedProduct = { ...product }

            expanedProduct.variants = await variantModel.getByProductID(product.id)

            fetchedProducts.push(expanedProduct)
         }

         res.status(200).json({ products: fetchedProducts })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching seller products (${error})` })
      }
   }

   add = async (req, res) => {
      try {
         const inputData = { ...req.body }

         const existingProduct = await productModel.getByName(inputData.name)

         if (existingProduct) {
            return res.status(400).json({ message: "Product already exists. You may edit it instead." })
         }

         const product = await productModel.add(inputData)

         res.status(201).json({ product })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while adding product (${error})` })
      }
   }

   editByID = async (req, res) => {
      try {
         const existingProduct = await productModel.getOne(req.params.id)

         if (!existingProduct) {
            return res.status(400).json({ message: "Product does not exist." })
         }

         const product = await productModel.update(req.params.id, { ...req.body })

         res.status(200).json({
            message: "Product updated.",
            product
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while editing product (${error})` })
      }
   }

   deleteByID = async (req, res) => {
      try {
         const variants = await variantModel.getByProductID(req.params.id)
         
         await Promise.all(variants.map(async variant => {
            await variantModel.delete(variant.id)
            await remove(storageFolders.variants, variant.image)
         }))
         await productModel.delete(req.params.id)

         res.status(200).json({ message: "Product deleted." })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while deleting product (${error})` })
      }
   }
}

module.exports = new ProductController()
