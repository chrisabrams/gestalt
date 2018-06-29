const errorCodes = require('./codes')

function superagentMixin() {

  return {
    _type: 'superagent',
    _parseType(o) {

      if(typeof o == 'object') {
  
        if(errorCodes.includes(o.code)) {
          return true
        }

      }

      return false

    }
  }

}

module.exports = superagentMixin
