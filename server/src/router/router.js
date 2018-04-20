const dispatch = require('./dispatch')
const express = require('express')

class Router {

  constructor(options = {}) {
    this.controller = options.controller
    this.name = options.name
    this.routes = express.Router()
  }

  delete(options = {}, dispatchOptions = {}) {
    return this.verb('delete', options, dispatchOptions)
  }

  generateMiddleware() {

  }

  get(options = {}, dispatchOptions = {}) {
    return this.verb('get', options, dispatchOptions)
  }

  patch(options = {}, dispatchOptions = {}) {
    return this.verb('patch', options, dispatchOptions)
  }

  post(options = {}, dispatchOptions = {}) {
    return this.verb('post', options, dispatchOptions)
  }

  verb(v, options = {}, dispatchOptions = {}) {
    const {action, middleware, route, schema} = options

    let _middleware = []

    if(schema) {

      if(typeof schema instanceof Array) {
        _middleware = _middleware.concat(schema)
      }
      else {
        _middleware.push(schema)
      }
      
    }

    if(middleware instanceof Array) {
      _middleware = _middleware.concat(middleware)
    }

    _middleware.push(dispatch(this.controller, action, dispatchOptions))

    this.routes[v](route, _middleware)
  }

}

module.exports = Router