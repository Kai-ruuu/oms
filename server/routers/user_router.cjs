const express = require("express")

const { storageFolders, newUploadHandler } = require("../helpers/storage.cjs")

const userController = require("../controllers/user_controller.cjs")

class UserRouter {
   constructor() {
      this.instance = express.Router()
   }

   useDatabase(database) {
      userController.useDatabase(database)

      this.instance.get("/seller", userController.getAllSellers)

      this.instance.get("/buyer", userController.getAllBuyers)

      this.instance.post("/seller-registration", newUploadHandler({
         shopLogo: storageFolders.logos,
         qrCode: storageFolders.qrCodes
      }), userController.registerSeller)

      this.instance.post("/buyer-registration", newUploadHandler(), userController.registerBuyer)
      
      this.instance.patch("/seller-update/:id", newUploadHandler({
         shopLogo: storageFolders.logos,
         qrCode: storageFolders.qrCodes
      }), userController.updateSeller)

      this.instance.patch("/buyer-update/:id", newUploadHandler(), userController.updateBuyer)

      this.instance.delete("/seller-removal/:id", newUploadHandler(), userController.removeSeller)

      this.instance.delete("/buyer-removal/:id", newUploadHandler(), userController.removeBuyer)

      this.instance.post("/login", newUploadHandler(), userController.loginUser)
   }
}

module.exports = new UserRouter()