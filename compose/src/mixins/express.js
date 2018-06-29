function expressMixin() {

  return {
    _type: 'express',
    _parseType(o) {

      if(typeof o == 'object') {
  
        if(o.response) {
          return true
        }

      }

      return false

    }
  }

}

module.exports = expressMixin
