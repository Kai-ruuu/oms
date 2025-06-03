import { routes } from "./helpers/routing"

// auth
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

// global
import HomePage from "./pages/global/HomePage"
import Unauthorized from "./pages/global/Unauthorized"
import NotFound from "./pages/global/NotFound"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

// buyer
import BuyerHome from "./pages/users/buyer/BuyerHome"
import BuyerCart from "./pages/users/buyer/BuyerCart"
import BuyerOrders from "./pages/users/buyer/BuyerOrders"
import BuyerAccount from "./pages/users/buyer/BuyerAccount"
import BuyerReceiptUpload from "./pages/users/buyer/BuyerReceiptUpload"

// seller
import SellerHome from "./pages/users/seller/SellerHome"
import SellerOrders from "./pages/users/seller/SellerOrders"
import SellerProducts from "./pages/users/seller/SellerProducts"
import SellerAccount from "./pages/users/seller/SellerAccount"

function App() {
  const [sellerSidebarOn, setSellerSidebarOn] = useState(true)
  const [buyerSidebarOn, setBuyerSidebarOn] = useState(true)
  const routeList = [
    { path: routes.global.home, element: <HomePage/> },
    { path: routes.auth.login, element: <Login/> },
    { path: routes.auth.register, element: <Register/> },

    { path: routes.users.buyer.home, element: <BuyerHome sidebarOn={buyerSidebarOn} setSidebarOn={setBuyerSidebarOn}/> },
    { path: routes.users.buyer.cart, element: <BuyerCart sidebarOn={buyerSidebarOn} setSidebarOn={setBuyerSidebarOn}/> },
    { path: routes.users.buyer.myOrders, element: <BuyerOrders sidebarOn={buyerSidebarOn} setSidebarOn={setBuyerSidebarOn}/> },
    { path: routes.users.buyer.account, element: <BuyerAccount sidebarOn={buyerSidebarOn} setSidebarOn={setBuyerSidebarOn}/> },
    { path: routes.users.buyer.receiptUpload, element: <BuyerReceiptUpload/> },
    
    { path: routes.users.seller.home, element: <SellerHome sidebarOn={sellerSidebarOn} setSidebarOn={setSellerSidebarOn}/> },
    { path: routes.users.seller.orders, element: <SellerOrders sidebarOn={sellerSidebarOn} setSidebarOn={setSellerSidebarOn}/> },
    { path: routes.users.seller.products, element: <SellerProducts sidebarOn={sellerSidebarOn} setSidebarOn={setSellerSidebarOn}/> },
    { path: routes.users.seller.account, element: <SellerAccount sidebarOn={sellerSidebarOn} setSidebarOn={setSellerSidebarOn}/> },

    { path: routes.global.unauthorized, element: <Unauthorized/> },
    { path: routes.global.notFound, element: <NotFound/> },
  ]

  return (
    <BrowserRouter>
      <Routes>
        {routeList.map((route, i) => (
          <Route key={i} path={route.path} element={route.element}></Route>
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App