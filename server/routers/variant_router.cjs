const express = require("express")

const { storageFolders, newUploadHandler } = require("../helpers/storage.cjs")

const variantController = require("../controllers/variant_controller.cjs")

class VariantRouter {
   constructor() {
      this.instance = express.Router()
   }

   useDatabase(database) {
      variantController.useDatabase(database)

      this.instance.get("/", variantController.getAll)

      this.instance.post("/add", newUploadHandler({
         image: storageFolders.variants
      }), variantController.add)

      this.instance.patch("/edit/:id", newUploadHandler({
         image: storageFolders.variants
      }), variantController.editByID)

      this.instance.delete("/delete/:id", newUploadHandler(), variantController.deleteByID)
   }
}

module.exports = new VariantRouter()