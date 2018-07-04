const pool = require('./pool')
const {key:safeKey, value:safeValue} = require('./safe')

function intersect(a, b) {
  return Object.assign(...a.map((v, i) => b.includes(v) && {[i]: v}))
}

const {castType, customTypes} = require('./types')

class SQL {

  constructor(options = {}) {
    this.options = options.options || {}
    this.query = options.query
    this.types = this.options.types || {}
    this.values = options.values || []

    //this.setCustomTypes()

    return this.run()
  }

  /*setCustomTypes() {

    for(let i = 0, l = this.customTypes.length; i < l; i++) {
      const {name, fn} = this.customTypes[i]

      if(typeof name == 'string' && typeof fn == 'function') {
        customTypes.set(name, {fn})
      }
    }

  }*/

  run() {
    const returnRaw = (typeof this.options.returnRaw == 'boolean') ? this.options.returnRaw : false
    const typesKeys = Object.keys(this.types)

    return new Promise(async (resolve, reject) => {

      try {

        const result = await pool.query(this.query, this.values)
        let res = result

        if(!returnRaw) {
          res = result.rows
        }

        /*
        NOTE:
        This looping structure is ineffecient, there should be better Map() involved
        */
        if(typesKeys.length > 0) {
          //console.error('customTypesMap', customTypes)
          for(let i = 0, l = res.length; i < l; i++) {
            const row = res[i]
            //console.error('row', row)
            const keys = Object.keys(row)
            const intersection = (keys, typesKeys)
            //console.error('intersection', intersection)
            for(let j = 0, k = intersection.length; j < k; j++) {
              const key = intersection[j]
              //console.error('key', key)
              try {
                
                row[key] = castType(this.types[key], row[key])

              }
              catch(e) {
                console.error('Could not apply custom type\n', e)
              }

            }
          }
        }

        resolve(res)
      }
      catch(e) {
        reject(e)
      }

    })

  }

}

module.exports = SQL
