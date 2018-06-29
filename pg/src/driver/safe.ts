import hasUpperCase from './has-uppercase'
import isReservedWord from './is-reserved-word'

function safeKey(key: string): string {

  if(hasUpperCase(key) || isReservedWord(key)) {
    return `"${key}"`
  }

  return key

}

function safeValue(val: string | Array<any>): any {

  if(val instanceof Array) {
    return JSON.stringify(val)
  }

  return val

}

export const key = safeKey
export const value = safeValue
