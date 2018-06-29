const methodChainMixin = require('../../method-chain')
const request = require('superagent')

class JSONFetcher {

  constructor(options = {}) {
    this.topic = null
    this.url = options.url
  }

  fetch(options = {responseTimeout: 5000}) {

    return this._addToChain(new Promise(async(resolve, reject) => {

      try {
        const result = await request.get(this.url).timeout({
          response: options.responseTimeout
        }).then((res) => res.body)

        resolve(result)
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  parse(fn) {

    return this._addToChain( (data) => {
      return new Promise( (resolve, reject) => {

        try {
          let result

          if(typeof fn == 'function') {
            result = fn(data)
          }
          else {
            result = data
          }

          resolve(result)
        }
        catch(e) {
          reject(e)
        }

      })
    })
    .run()

  }

}

Object.assign(JSONFetcher.prototype, methodChainMixin)
module.exports = JSONFetcher
