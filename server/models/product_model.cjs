class Product {
   constructor() {
      this.collectionName = "product"
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

   getAll() {
      return this.safeCall(this.collection().getFullList())
   }

   getOne(id) {
      return this.safeCall(this.collection().getOne(id))
   }

   getByFilter(filter) {
      return this.safeCall(this.collection().getFullList({ filter }))
   }
   
   getBySorting(sort) {
      return this.safeCall(this.collection().getFullList({ sort }))
   }

   getBySellerID(sellerID) {
      return this.safeCall(this.collection().getFullList({ filter: `seller='${sellerID}'` }))
   }

   getByName(name) {
      return this.safeCall(this.collection().getFirstListItem(`name='${name}'`))
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

module.exports = new Product()
