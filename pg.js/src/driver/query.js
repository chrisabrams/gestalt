const hasUpperCase = require('./has-uppercase')
const isReservedWord = require('./is-reserved-word')
const now = require('./now')
const objectAssignDeep = require('object-assign-deep')
const pool = require('./pool')
const {key:safeKey, value:safeValue} = require('./safe')
const schema = require('./schema')
const time = require('../../../lib/time')
const uuid = require('../../../lib/uuid')

const insertOptions = {conflict: 'error', keys: {createdAt: true, id: true}, returnChanges: true}
const updateOptions = {conflict: 'update', keys: {createdAt: false, id: false}, returnChanges: true}

class Query {

  constructor(options = {}) {
    this._query = ''
    this._stepsData = []
    this._stepsTotal = -1
    this.table = options.table
    this._values = []
  }

  _addQueryStep(step) {
    this._stepsTotal++

    if(step instanceof Promise) {
      this._stepsData[this._stepsTotal] = step
    }
    else {
      this._stepsData[this._stepsTotal] = new Promise(async (resolve, reject) => {

        try {
          const data = await this._stepsData[this._stepsTotal - 1]
          const result = await step(data)

          resolve(result)
        }
        catch(e) {
          reject(e)
        }

      })

    }

    return this

  }

  between(start, end, options = {column: 'id'}) {
    const column = options.column

    this._query = `SELECT * ${schema}.${this.table} WHERE ${column} BETWEEN $${this._nextPreparedNum} AND $${this._nextPreparedNum + 1}`
    this._values = this._values.concat([start, end])

    return this

  }

  get(id, options = {column: 'id'}) {
    const column = options.column

    this._query = `SELECT * FROM ${schema}.${this.table} WHERE ${column} = $1`
    this._values = this._values.concat([id])

    return this

  }

  getAll(values = [], options = {column: 'id'}) {
    const column = options.column

    this._query = `SELECT * FROM ${schema}.${this.table}`

    if(values.length > 0) {
      this._query += ` WHERE ${column} IN ($${this._nextPreparedNum})`
      this._values = _this.values.concat([values.join(', ')])
    }

    return this

  }

  insert(kv, options = {}) {
    options = objectAssignDeep({}, insertOptions, options)
    //console.log('kv', kv)
    //console.log('options', options)

    if(kv instanceof Array) {
      const inserts = []

      for(let i = 0 , l = kv.length; i < l; i++) {
        inserts.push(this.insert(kv[i], options))
      }

      return Promise.all(inserts)
    }

    /*
    let keys = Object.keys(kv).map(this._safeKey)
    const values = Object.values(kv).map(this._safeValue)
  
    if(options.keys.createdAt && !kv.createdAt) {
      keys.unshift('"createdAt"')
      values.unshift(time.now())
    }

    if(typeof options.id != 'undefined') {
      kv.id = options.id
      keys.unshift('id')
      values.unshift(options.id)
    }

    if(kv.hasOwnProperty('id') && typeof kv.id == 'undefined') {
      kv.id = uuid()
    }
    else if(typeof kv.id == 'undefined') {
      keys.unshift('id')
      values.unshift(uuid())
    }

    keys = keys.join(', ')
  
    const placeholder = []
  
    for(let i = 1, l = values.length + 1; i < l; i++) {
      placeholder.push(`$${i}`)
    }
    const placeholderText = placeholder.join(', ')
    */
    const {keys, keysText, values, valuesText} = this._keysAndValues(kv, options)
    const returnChanges = this._returnChanges(options)
    /*const conflictKeys = keys.slice()
    if(conflictKeys.includes('id')) {
      conflictKeys.unshift('id')
    }
    if(conflictKeys.includes('createdAt')) {
      conflictKeys.unshift('createdAt')
    }*/
    const upsert = (options.conflict == 'replace' || options.conflict == 'update') ? ' ON CONFLICT(id) DO UPDATE SET "createdAt"=EXCLUDED."createdAt"' : ''
    let sql = `INSERT INTO ${schema}.${this.table}(${keysText}) VALUES(${valuesText})${upsert}${returnChanges}`

    //console.log('keys', keys)
    //console.log('values', values)
    //console.log('sql', sql, values, options)
    return new Promise(async (resolve, reject) => {
  
      try {
        const result = await pool.query(sql, values)
        const res = (options.returnChanges) ? result.rows[0] : result
        //console.error('res', res)
        resolve(res)
      }
      catch(e) {
        reject(e)
      }
  
    })
  }

  _keysAndValues(kv, options = {}) {

    let keys = Object.keys(kv).map(safeKey)
    let values = Object.values(kv).map(safeValue)
  
    if(options.keys.createdAt && !kv.createdAt) {
      keys.unshift('"createdAt"')
      values.unshift(time.now())
    }

    if(options.keys.id) {

      if(kv.hasOwnProperty('id') && typeof kv.id == 'undefined') {
        kv.id = uuid()
      }
      else if(typeof kv.id == 'undefined') {
        keys.unshift('id')
        values.unshift(uuid())
      }

    }
    //console.error('options', options)
    //console.error('kv', kv)
    const keysText = keys.join(', ')
  
    const placeholder = []
    for(let i = 1, l = values.length + 1; i < l; i++) {
      placeholder.push(`$${i}`)
    }
    const valuesText = placeholder.join(', ')

    return {keys, keysText, values, valuesText}

  }

  limit(num) {
    this._query += ` LIMIT ${num}`

    return this
  }

  _nextPreparedNum() {
    return this._values.length + 1
  }

  _returnChanges(options = {}) {

    return (typeof options.returnChanges == 'boolean' && options.returnChanges) ? ' RETURNING *' : ''

  }
  
  run(options = {returnChanges: true}) {

    return new Promise(async (resolve, reject) => {

      try {
        //console.error('this._query', this._query)
        const result = await pool.query(this._query, this._values)
        //const res = result
        const res = (options.returnChanges) ? result.rows[0] : result
        //console.log('run', res)
        resolve(res)
      }
      catch(e) {
        reject(e)
      }

    })

  }

  update(kv = {}, options = {}) {
    options = objectAssignDeep({}, updateOptions, options)
    const id = kv.id || options.id

    const {keys, keysText, values, valuesText} = this._keysAndValues(kv, options)
    const returnChanges = this._returnChanges(options)

    const update = []
    for(let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      const value = values[i]

      update.push(`${safeKey(key)} = '${safeValue(value)}'`)
    }
    const updateText = update.join(', ')

    let sql = `UPDATE ${schema}.${this.table} SET ${updateText} WHERE id='${id}' ${returnChanges}`

    console.log('keys', keys)
    console.log('values', values)
    console.log('sql', sql, values, options)
    return new Promise(async (resolve, reject) => {
  
      try {
        const result = await pool.query(sql)
        const res = (options.returnChanges) ? result.rows[0] : result
        console.error('res', res)
        resolve(res)
      }
      catch(e) {
        console.error('SQL: Could not update\n', e)
        reject(e)
      }
  
    })
  }

  upsert(kv = {}, options = {}) {
    options = objectAssignDeep({}, insertOptions, options)

    return this.insert(kv, options)
  }

}

module.exports = Query
