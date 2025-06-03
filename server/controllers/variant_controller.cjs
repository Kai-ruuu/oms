const bcrypt = require("bcrypt")

const { storageFolders, remove } = require("../helpers/storage.cjs")

const variantModel = require("../models/variant_model.cjs")

class VariantController {
   useDatabase(database) {
      variantModel.useDatabase(database)
   }

   getAll = async (req, res) => {
      try {
         const variants = await variantModel.getAll()

         res.status(200).json({ variants })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while fetching variants (${error})` })
      }
   }

   add = async (req, res) => {
      try {
         const image = req.files?.image?.[0].filename
         const inputData = { ...req.body, image }

         const existingVariant = await variantModel.getByNameAndProductID(inputData.name, inputData.product)

         if (existingVariant) {
            await remove(storageFolders.variants, image)
            
            return res.status(400).json({ message: "Variant already exists. You may edit it instead." })
         }

         const variant = await variantModel.add(inputData)

         res.status(201).json({ variant })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while adding variant (${error})` })
      }
   }

   editByID = async (req, res) => {
      try {
         const image = req.files?.image?.[0].filename
         const inputData = { ...req.body, image }

         const existingVariant = await variantModel.getOne(req.params.id)

         if (!existingVariant) {
            return res.status(400).json({ message: "Variant does not exist." })
         }

         if (!inputData.image) {
            delete inputData.image
         } else {
            await remove(storageFolders.variants, existingVariant.image)
         }
         
         const variant = await variantModel.update(req.params.id, inputData)

         res.status(200).json({
            message: "Variant updated.",
            variant
         })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while editing variant (${error})` })
      }
   }

   deleteByID = async (req, res) => {
      try {
         await variantModel.delete(req.params.id)

         res.status(200).json({ message: "Variant deleted." })
      } catch (error) {
         console.error(error)
         res.status(500).json({ message: `An error occurred while deleting variant (${error})` })
      }
   }
}

module.exports = new VariantController()
