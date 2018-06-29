const map = [
  ['ACTION_MISSING', 'Action is missing'],
  ['ACTION_NOT_FOUND', 'Action not found'],
]

function Err(code) {

  let messagePrefix = 'Error:'
  let messageBody = ''
  
  for(let i = 0, l = map.length; i < l; i++) {
    const item = map[i]
  
    if(code == item[0]) {
      messageBody = item[1]
      break
    }
  }

  console.error(`${messagePrefix} ${messageBody}`)
  process.exit(1)
}

module.exports = Err

// Export each code
for(let i = 0, l = map.length; i < l; i++) {
  const item = map[i]
  const code = item[0]

  module.exports[code] = code
}
