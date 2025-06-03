/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2497037247")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool3272744857",
    "name": "ordered",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2497037247")

  // remove field
  collection.fields.removeById("bool3272744857")

  return app.save(collection)
})
