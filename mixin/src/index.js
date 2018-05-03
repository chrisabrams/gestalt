function mixin(dest, source) {

  dest   = (dest.prototype) ? dest.prototype : dest
  source = source.prototype

  Object.getOwnPropertyNames(source).forEach(function propertyName(name) {

    if(name !== 'constructor') {
      Object.defineProperty(dest, name, Object.getOwnPropertyDescriptor(source, name))
    }

  })

}

module.exports = mixin
