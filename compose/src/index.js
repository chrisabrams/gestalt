const errorCodes = require('./lib/codes')
const Logger = require('../../logger')

class Composer {

  constructor(data, options = {}) {
    this._action = 'error'
    this._data = data
    this.logger = new Logger()
    this.options = options
    this._output = data
    this._stack = true
    this._type = 'unknown'
    this._uncaught = (typeof options.uncaught) ? options.uncaught : false
    this._unhandled = (typeof options.unhandled) ? options.unhandled : false

    this.determineType()
    this.processType()
    this.output()
  }

  debug(m) {
    this.logger.debug(m)

    return this
  }

  determineType() {
    const data = this._data

    if(typeof data == 'object') {

      if(data.response) {
        this._type = 'express'
      }

      if(errorCodes.superagent.includes(data.code)) {
        this._type = 'superagent'
      }

    }

  }

  error(m, e = {}) {
    this.logger.error(m, e)
  
    if(this._stack) {
      console.error(e.stack)
    }

    return this
  }

  log(m) {
    this.logger.log(m)

    return this
  }

  output() {

    if(this._uncaught) {
      this.logger.debug('The following error was uncaught')
    }

    if(this._unhandled) {
      this.logger.debug('The following error was unhandled')
    }

    this[this._action](this._type, this._output)

  }

  processType() {

    switch(this._type) {

      case 'express':
        this._output = this._data.error
        break

      case 'superagent':
        this._stack = false
        break

    }

  }

}

module.exports = Composer
