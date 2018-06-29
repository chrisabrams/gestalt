const EE = require('../../event-emitter')

class Composer {

  constructor(options = {}) {

    this.logger = console
    this.options = options
    this._output = null
    this._process = null
    this._types = []

  }

  use(o) {

    try {
      const ignoreKeys = ['_parseType', '_processType', '_type']
      const keys = Object.keys(o).filter((s) => !(ignoreKeys.includes(s)))

      if(o._type) {
        const {_parseType, _processType, _type} = o

        this._types.push({
          parseType: _parseType,
          processType: _processType,
          type: _type
        })
      }

      for(let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]

        if(typeof o[key] == 'function') {
          this[key] = o[key].bind(this)
        }
        else {
          this[key] = o[key]
        }
      }

    }
    catch(e) {
      this.logger.error('Could not register mixin\n', e)
    }

  }

}

module.exports = Composer
module.exports.mixins = require('./mixins')
