class Seller {
   constructor() {
      this.collectionName = "seller"
      this.database = null
   }

   useDatabase(database) {
      this.database = database
   }

   collection() {
      return this.database.collection(this.collectionName)
   }

   async safeCall(promise) {
      try {
         return await promise
      } catch (error) {
         if (error.status === 404) {
            return null
         }

         console.error(error)
         console.error(`[SAFE_CALL] Error while calling a model function (${error})`)
         
         return null
      }
   }

   getOne(id) {
      return this.safeCall(this.collection().getOne(id))
   }

   getAll() {
      return this.safeCall(this.collection().getFullList())
   }

   getByEmail(email) {
      return this.safeCall(this.collection().getFirstListItem(`shopEmail='${email}'`))
   }

   add(data) {
      return this.safeCall(this.collection().create(data))
   }

   update(id, data) {
      return this.safeCall(this.collection().update(id, data))
   }
   
   delete(id) {
      return this.safeCall(this.collection().delete(id))
   }
}

module.exports = new Seller()
