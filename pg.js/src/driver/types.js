const customTypes = new Map()

customTypes.set('bigint', {fn: (v) => parseInt(v)})
customTypes.set('float', {fn: (v) => parseFloat(v)})
customTypes.set('int', {fn: (v) => parseInt(v)})
customTypes.set('string', {fn: (v) => v.toString()})

customTypes.set('decimal', customTypes.get('float'))
customTypes.set('integer', customTypes.get('int'))

function castType(_type, val) {

  const type = customTypes.get(_type)

  if(typeof type == 'object' && typeof type.fn == 'function') {

    return type.fn(val)

  }

  return val

}

function setCustomType(name, fn) {

  customTypes.set(name, {fn})

}

function setCustomTypeAlias(name, alias) {
  customTypes.set(name, customTypes.get(alias))
}

module.exports.castType = castType
module.exports.customTypes = customTypes
module.exports.setCustomType = setCustomType
module.exports.setCustomTypeAlias = setCustomTypeAlias
