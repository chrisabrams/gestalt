export default function customTypes(customTypes: Array<object>) {

  function addCustomType(type: object): void {
    customTypes.push(type)
  }

  return function addCustomTypes(types: object | Array<object>): void {

    if(types instanceof Array) {
      for(let i = 0, l = types.length; i < l; i++) {
        const type = types[i]
        addCustomType(type)
      }
    }
    else {
      addCustomType(types)
    }

  }

}
