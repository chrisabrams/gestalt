const {castType, customTypes, setCustomType, setCustomTypeAlias} = require('./types')
const now = require('./now')
const pool = require('./pool')
const Query = require('./query')
const safe = require('./safe')
const schema = require('./schema')
const SQL = require('./sql')

class Driver {

  constructor(options = {}) {
    this.options = options
  }

  table(tableName) {
    return new Query({table: tableName})
  }

}

module.exports.castType = castType
module.exports.customTypes = customTypes
module.exports.db = new Driver()
module.exports.now = now
module.exports.pool = pool
module.exports.safe = safe
module.exports.schema = schema
module.exports.setCustomType = setCustomType
module.exports.setCustomTypeAlias = setCustomTypeAlias
module.exports.sql = function sql(query, values = [], options = {}) {
  return new SQL({query, values, options})
}
