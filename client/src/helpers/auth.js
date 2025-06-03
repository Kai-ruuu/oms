import { routes, navigator } from "./routing"

const startSession = (userData, remember) => {
   const storage = remember ? localStorage : sessionStorage
   
   storage.setItem("userData", JSON.stringify(userData))
   localStorage.setItem("dataStorage", remember ? "localStorage" : "sessionStrorage")
}

const isUserVerified = () => {
   const storageString = localStorage.getItem("dataStorage")

   if (!storageString) {
      navigator(routes.global.unauthorized)

      return false
   }

   const storage = storageString === "localStorage"
      ? localStorage
      : sessionStorage

   const userData = JSON.parse(storage.getItem("userData"))

   if (!userData) {
      navigator(routes.global.unauthorized)
      return [false, null, null]
   }

   return [true, userData, storageString === "localStorage"]
}

const logout = () => {
   if (!window.confirm("Logout now?"))
      return
   
   localStorage.removeItem("dataStorage")
   localStorage.removeItem("userData")
   sessionStorage.removeItem("dataStorage")
   sessionStorage.removeItem("userData")

   navigator(routes.auth.login)
}

export {
   startSession,
   isUserVerified,
   logout
}