// helpers/database.cjs
const Pocketbase = require("pocketbase/cjs")
const env = require("./env.cjs")

env.config()

const DB_URL = process.env.DB_URL
const DB_ADMIN_EMAIL = process.env.DB_ADMIN_EMAIL
const DB_ADMIN_PASS = process.env.DB_ADMIN_PASS

class Database {
   constructor() {
      this.client = null
   }

   async connect() {
      try {
         this.client = new Pocketbase(DB_URL)

         await this.client.admins.authWithPassword(DB_ADMIN_EMAIL, DB_ADMIN_PASS)
         console.log("[DATABASE] Now connected to the database.")

         return this.client
      } catch (error) {
         console.error(`[DATABASE] Unable to connect to the database (${error})`)
         return null
      }
   }

   async safeCall(promise) {
      try {
         return await promise
      } catch (error) {
         console.error(`[DATABASE] Error while querying from a model. (${error})`)
         return null
      }
   }
}

module.exports = new Database()