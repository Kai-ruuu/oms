/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2497037247")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1339482456",
    "hidden": false,
    "id": "relation2224054195",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "buyer",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2497037247")

  // remove field
  collection.fields.removeById("relation2224054195")

  return app.save(collection)
})
