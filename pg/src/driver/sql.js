const pool = require('./pool')
const {key:safeKey, value:safeValue} = require('./safe')

function intersect(a, b) {
  return Object.assign(...a.map((v, i) => b.includes(v) && {[i]: v}))
}

const customTypes = new Map()
customTypes.set('bigint', {fn: (v) => parseInt(v)})
customTypes.set('decimal', {fn: (v) => parseFloat(v)})

class SQL {

  constructor(options = {}) {
    this.customTypes = options.customTypes || []
    this.options = options.options || {}
    this.query = options.query
    this.types = this.options.types || {}
    this.values = options.values || []

    this.setCustomTypes()

    return this.run()
  }

  setCustomTypes() {

    for(let i = 0, l = this.customTypes.length; i < l; i++) {
      const {name, fn} = this.customTypes[i]

      if(typeof name == 'string' && typeof fn == 'function') {
        customTypes.set(name, {fn})
      }
    }

  }

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

          for(let i = 0, l = res.length; i < l; i++) {
            const row = res[i]
            const keys = Object.keys(row)
            const intersection = (keys, typesKeys)

            for(let j = 0, k = intersection.length; j < k; j++) {
              const key = intersection[j]

              try {
                const type = customTypes.get(key)

                if(typeof type == 'object' && typeof type.fn == 'function') {
                  row[key] = type.fn(row[key])
                }

              }
              catch(e) {
                console.error('Could not apply custom type\n', e)
              }

              /*
              switch(this.types[key]) {
                case 'bigint':
                  row[key] = parseInt(row[key])
                  break

                case 'decimal':
                  row[key] = parseFloat(row[key])
                  break

                case 'ishani:integer':
                  row[key] = amountFromIshani(row[key])
                  break
              }
              */
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

export default SQL
