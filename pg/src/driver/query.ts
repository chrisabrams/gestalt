import hasUpperCase from './has-uppercase'
import isReservedWord from './is-reserved-word'
import now from './now'
const objectAssignDeep = require('object-assign-deep')
import pool from './pool'
import {key as safeKey, value as safeValue} from './safe'
const schema = require('./schema')
const time = require('../../../lib/time')
const uuid = require('../../../lib/uuid')

const insertOptions = {conflict: 'error', keys: {createdAt: true, id: true}, returnChanges: true}
const updateOptions = {conflict: 'update', keys: {createdAt: false, id: false}, returnChanges: true}

interface Options {
  table: string
}

interface _optionsKeys {
  createdAt?: string
  id?: string
}

interface CRUDOptions {
  column?: string
  conflict?: string
  id?: string
  keys?: _optionsKeys
  returnChanges?: boolean
}

interface OptionsBetween extends CRUDOptions {
  
}

interface OptionsGetAll extends CRUDOptions {
  
}

interface OptionsInsert extends CRUDOptions {
  
}

interface OptionsKeysAndValues {
  keys?: _optionsKeys
  id?: string
}

interface OptionsUpdate extends CRUDOptions {
  
}

export default class Query {
  private _query: string = ''
  private _stepsData: Array<object> = []
  private _stepsTotal: number = -1
  private table: string
  private _values: Array<any>

  constructor(options: Options) {
    // this._query = ''
    // this._stepsData = []
    // this._stepsTotal = -1
    this.table = options.table
    // this._values = []
  }

  _addQueryStep(step: Promise<object> | Function): this {
    this._stepsTotal++

    if(step instanceof Promise) {
      this._stepsData[this._stepsTotal] = step
    }
    else {
      this._stepsData[this._stepsTotal] = new Promise<object>(async (resolve, reject) => {

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

  between(start: string, end: string, options: OptionsBetween = {column: 'id'}): this {
    const column = options.column

    this._query = `SELECT * ${schema}.${this.table} WHERE ${column} BETWEEN $${this._nextPreparedNum} AND $${this._nextPreparedNum() + 1}`
    this._values = this._values.concat([start, end])

    return this

  }

  get(id: string, options = {column: 'id'}): this {
    const column = options.column

    this._query = `SELECT * FROM ${schema}.${this.table} WHERE ${column} = $1`
    this._values = this._values.concat([id])

    return this

  }

  getAll(values: Array<any> = [], options: OptionsGetAll = {column: 'id'}): this {
    const column = options.column

    this._query = `SELECT * FROM ${schema}.${this.table}`

    if(values.length > 0) {
      this._query += ` WHERE ${column} IN ($${this._nextPreparedNum})`
      this._values = this._values.concat([values.join(', ')])
    }

    return this

  }

  insert(kv: object | Array<object>, options: OptionsInsert): Promise<object> {
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
    const returnChanges = this._returnChanges(options.returnChanges)
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
    return new Promise<object>(async (resolve, reject) => {
  
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

  _keysAndValues(kv: {createdAt?: string, id?: string}, options: OptionsKeysAndValues = {}) {

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

  limit(num: number): this {
    this._query += ` LIMIT ${num}`

    return this
  }

  _nextPreparedNum(): number {
    return this._values.length + 1
  }

  _returnChanges(returnChanges: boolean): string {

    return (returnChanges) ? ' RETURNING *' : ''

  }
  
  run(options = {returnChanges: true}): Promise<object> {

    return new Promise(async (resolve, reject) => {

      try {
        console.error('this._query', this._query)
        const result = await pool.query(this._query, this._values)
        //const res = result
        const res = (options.returnChanges) ? result.rows[0] : result
        console.log('run', res)
        resolve(res)
      }
      catch(e) {
        reject(e)
      }

    })

  }

  update(kv: {id?: string} = {}, options: OptionsUpdate = {}): Promise<object> {
    options = objectAssignDeep({}, updateOptions, options)
    const id = kv.id || options.id

    const {keys, keysText, values, valuesText} = this._keysAndValues(kv, options)
    const returnChanges = this._returnChanges(options.returnChanges)

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

  upsert(kv = {}, options = {}): Promise<object> {
    options = objectAssignDeep({}, insertOptions, options)

    return this.insert(kv, options)
  }

}
