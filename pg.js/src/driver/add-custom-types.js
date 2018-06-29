function customTypes(customTypes) {

  function addCustomType(type) {
    customTypes.push(type)
  }

  return function addCustomTypes(types) {

    if(types instanceof Array) {
      for(let i = 0, l = types.length; i < l; i++) {
        const type = types[i]
        addCustomType(type)
      }
    }
    else {
      addCustomType(type)
    }

  }

}

module.exports = customTypes
