class CartItem {
   constructor() {
      this.collectionName = "cart_item"
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

   getByBuyerID(buyerID) {
      return this.safeCall(this.collection().getFullList({ filter: `buyer='${buyerID}'` }))
   }

   getByVariantIDAndBuyerID(variantID, buyerID) {
      const cartItem = this.safeCall(this.collection().getFullList({ filter: `variant='${variantID}' && buyer='${buyerID}'` }))
      
      return cartItem.length > 0 ? cartItem[0] : null
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

module.exports = new CartItem()
