const customTypes = require('./add-custom-types')
const now = require('./now')
const pool = require('./pool')
const Query = require('./query')
const safe = require('./safe')
const schema = require('./schema')
const SQL = require('./sql')

const _customTypes = []

class Driver {

  constructor(options = {}) {
    this.options = options
  }

  table(tableName) {
    return new Query({table: tableName})
  }

}

module.exports.addCustomTypes = customTypes(_customTypes)
module.exports.db = new Driver()
module.exports.now = now
module.exports.pool = pool
module.exports.safe = safe
module.exports.schema = schema
module.exports.sql = function sql(query, values = [], options = {}) {
  return new SQL({customTypes: _customTypes, query, values, options})
}
