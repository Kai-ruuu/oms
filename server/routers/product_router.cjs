const express = require("express")

const { storageFolders, newUploadHandler } = require("../helpers/storage.cjs")

const productController = require("../controllers/product_controller.cjs")

class ProductRouter {
   constructor() {
      this.instance = express.Router()
   }

   useDatabase(database) {
      productController.useDatabase(database)

      this.instance.get("/", productController.getAll)

      this.instance.get("/latest", productController.getLatest)

      this.instance.get("/product/:id", newUploadHandler(), productController.getVariants)
      
      this.instance.get("/seller/:id", newUploadHandler(), productController.getSellerProducts)
      
      this.instance.post("/add", newUploadHandler(), productController.add)

      this.instance.patch("/edit/:id", newUploadHandler(), productController.editByID)

      this.instance.delete("/delete/:id", newUploadHandler(), productController.deleteByID)
   }
}

module.exports = new ProductRouter()