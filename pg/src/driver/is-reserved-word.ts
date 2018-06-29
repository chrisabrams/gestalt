export default function isReservedWord(key: string): boolean {

  const k = key.toLowerCase()
  const reservedWords = ['desc', 'from', 'to']

  return reservedWords.includes(k)

}
