const express = require("express")

const { storageFolders, newUploadHandler } = require("../helpers/storage.cjs")

const orderController = require("../controllers/order_controller.cjs")

class CartItemRouter {
   constructor() {
      this.instance = express.Router()
   }

   useDatabase(database) {
      orderController.useDatabase(database)

      this.instance.get("/", orderController.getAll)

      this.instance.get("/seller/:id", orderController.getSellerOrders)

      this.instance.get("/buyer/:id", orderController.getBuyerOrders)

      this.instance.post("/add", newUploadHandler(), orderController.add)

      this.instance.patch(
         "/edit/:id",
         newUploadHandler({
            receipt: storageFolders.receipts
         }),
         orderController.editByID
      )

      this.instance.delete("/delete/:id", newUploadHandler(), orderController.deleteByID)
   }
}

module.exports = new CartItemRouter()