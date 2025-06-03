const path = require("path")
const cors = require("cors")

const app = require("./helpers/app.cjs")
const database = require("./helpers/database.cjs")
const { init: initStorage } = require("./helpers/storage.cjs")

const userRouter = require("./routers/user_router.cjs")
const productRouter = require("./routers/product_router.cjs")
const variantRouter = require("./routers/variant_router.cjs")
const cartItemRouter = require("./routers/cart_item_router.cjs")
const orderRouter = require("./routers/order_router.cjs")

;(async () => {
   initStorage()
   
   // connect to the database
   const db = await database.connect()

   if (!db) {
      console.error("[SERVER] Failed to initialize due to database connection error.")
      process.exit(1)
   }

   // use the connected db in the app
   app.useDatabase(db)

   // configure app routes and middlewares
   app.config(instance => {
      userRouter.useDatabase(app.database)
      productRouter.useDatabase(app.database)
      variantRouter.useDatabase(app.database)
      cartItemRouter.useDatabase(app.database)
      orderRouter.useDatabase(app.database)

      instance.use(cors())

      instance.use("/file", require("express").static(path.join(__dirname, "storage")))
      instance.use("/public", require("express").static(path.join(__dirname, "public")))
      
      instance.use("/user", userRouter.instance)
      instance.use("/product", productRouter.instance)
      instance.use("/variant", variantRouter.instance)
      instance.use("/cart", cartItemRouter.instance)
      instance.use("/order", orderRouter.instance)
   })

   // listen for requests
   app.listen()
})()