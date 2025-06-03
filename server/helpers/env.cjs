const path = require("path")

const env = {}

env.instance = require("dotenv")

env.config = function(config = {}) {
   config.path = path.resolve(process.cwd(), config.path || ".env")
   
   this.instance.config(config)
}

module.exports = env