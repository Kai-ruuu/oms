const express = require("express")

const { storageFolders, newUploadHandler } = require("../helpers/storage.cjs")

const cartItemController = require("../controllers/cart_item_controller.cjs")

class CartItemRouter {
   constructor() {
      this.instance = express.Router()
   }

   useDatabase(database) {
      cartItemController.useDatabase(database)

      this.instance.get("/", cartItemController.getAll)

      this.instance.get("/buyer/:id", cartItemController.getBuyerCart)
      
      this.instance.post("/add", newUploadHandler(), cartItemController.add)

      this.instance.patch("/edit/:id", newUploadHandler(), cartItemController.editByID)

      this.instance.delete("/delete/:id", newUploadHandler(), cartItemController.deleteByID)
   }
}

module.exports = new CartItemRouter()