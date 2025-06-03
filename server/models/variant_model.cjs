class Variant {
   constructor() {
      this.collectionName = "variant"
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

   getByProductID(productID) {
      return this.safeCall(this.collection().getFullList({ filter: `product='${productID}'` }))
   }

   getByNameAndProductID(name, productID) {
      const variant = this.safeCall(this.collection().getFullList({ filter: `name='${name}' && id='${productID}'` }))

      return variant.length > 0 ? variant[0] : null
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

module.exports = new Variant()
