function isReservedWord(key) {

  const k = key.toLowerCase()
  const reservedWords = ['desc', 'from', 'to']

  return reservedWords.includes(k)

}

module.exports = isReservedWord