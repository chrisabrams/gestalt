import customTypes from './add-custom-types'
import now from './now'
import pool from './pool'
import Query from './query'
const safe = require('./safe')
const schema = require('./schema')
const SQL = require('./sql')

const _customTypes: Array<any> = []

class Driver {
  protected options: object

  constructor(options?: object) {
    this.options = options
  }

  table(tableName: string) {
    return new Query({table: tableName})
  }

}

export const addCustomTypes = customTypes(_customTypes)
export const db = new Driver()
export {now}
export {pool}
export {safe}
export {schema}
export const sql = function sql(query: string, values: Array<any> = [], options?: object) {
  return new SQL({customTypes: _customTypes, query, values, options})
}
