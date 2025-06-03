const routes = {
   global: {
      home: "/",
      unauthorized: "/unauthorized",
      notFound: "*",
   },
   auth: {
      login: "/login",
      register: "/signup",
   },
   users: {
      buyer: {
         home: "/buyer",
         cart: "/cart",
         myOrders: "/my_orders",
         find: "/find",
         account: "/my_account",
         receiptUpload: "/receipt_upload/:id/:order_id/:qr_code"
      },
      seller: {
         home: "/seller",
         orders: "/orders",
         products: "/products",
         account: "/account",
      },
   },
}

const navigator = route => {
   location.href = route
}

export {
   routes,
   navigator
}