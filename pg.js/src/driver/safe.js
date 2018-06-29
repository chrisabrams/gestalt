const hasUpperCase = require('./has-uppercase')
const isReservedWord = require('./is-reserved-word')

function safeKey(key) {

  if(hasUpperCase(key) || isReservedWord(key)) {
    return `"${key}"`
  }

  return key

}

function safeValue(val) {

  if(val instanceof Array) {
    return JSON.stringify(val)
  }

  return val

}

module.exports.key = safeKey
module.exports.value = safeValue
