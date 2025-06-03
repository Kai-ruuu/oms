// helpers/app.cjs
const express = require("express")
const env = require("./env.cjs")

env.config()

let SERVER_HOST = process.env.SERVER_HOST
const SERVER_PORT = process.env.SERVER_PORT

class App {
   constructor() {
      this.instance = express()
      this.database = null
   }

   useDatabase(database) {
      this.database = database
   }

   config(callback) {
      if (typeof callback === "function") {
         callback(this.instance)
      }
   }

   listen(httpOnly = true, listenFromLAN = true) {
      SERVER_HOST = listenFromLAN ? "0.0.0.0" : "localhost"
      
      this.instance.listen(SERVER_PORT, SERVER_HOST, () => {
         console.log(`[SERVER] Now running at ${httpOnly ? "http" : "https"}://${SERVER_HOST}:${SERVER_PORT}`)
      })
   }
}

module.exports = new App()