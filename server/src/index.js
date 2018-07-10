const bodyParser = require('body-parser')
const Composer = require('../../compose')
const express = require('express')
const http = require('http')
//const io = require('socket.io')
const Logger = require('../../logger')
const {dispatch, removeHook, registerHook, respond, Router, triggerHook} = require('./router')
const request = require('superagent')

const host = process.env.GESTALT_SERVER_HOST || 'localhost'
const port = process.env.GESTALT_SERVER_PORT || 3000
const protocol = process.env.GESTALT_SERVER_PROTOCOL || 'http'
const version = process.env.GESTALT_SERVER_VERSION || 0.1

class Server {
  constructor(options = {}) {
    this.io = null
    this.logger = new Logger()
    this._readyResolve = null
    this._readyReject = null
    this.ready = new Promise((resolve, reject) => {
      this._readyResolve = resolve
      this._readyReject = reject
    })
    this.router = options.router || null
    this.routes = options.routes || []
    this.routesList = {}
    this.version = version

    this._basePath = `${protocol}://${host}:${port}`
    this._server = express()
    this._server.use(bodyParser.json())
    this._server.use(bodyParser.urlencoded({extended: true}))

    this.generateRoutes()

  }

  generateRoutes() {

    /*const foo = (req, res) => {res.json({pkg: req.body})}
    const myrouter = express.Router()
    myrouter.post('/', foo)
    this._server.use('/foo', myrouter)*/

    for(let i = 0, l = this.routes.length; i < l; i++) {

      const {name, parent, routes} = this.routes[i]
      let routesList = {}
      let route = `/api/${this.version}/${name}`

      if(parent) {
        route = `/api/${this.version}/${parent.name}/:${parent.name}Id/${name}`
      }

      //console.log('route', route)
      //console.log('routes', routes)
      this._server.use(route, routes)
      //console.log('this._server', this._server)
      routes.stack.forEach(function(middleware) {
        //const path = `/${name}${middleware.route.path}`
        //console.log('middleware', middleware)
        //console.log('stack', middleware.route.stack)
        const path = middleware.route.path
        const method = Object.keys(middleware.route.methods)[0].toUpperCase()

        if(routesList[path]) {
          routesList[path].push(method)
        } else {
          routesList[path] = new Array(method)
        }
      })

      this.routesList[name] = routesList
    }
    //console.log('routesList', this.routesList)

  }

  /*get(uri) {
    return this.requestUri('get', uri)
  }*/

  hook(options = {}, cb) {
    return registerHook(options, cb)
  }

  /*post(uri) {
    return this.requestUri('post', uri)
  }*/

  registerPeer(host) {
    if(!this.peers.contains(host)) {
      this.peers.append(host)
    }
  }

  requestUri(verb, uri) {

    const apiVersionCheck = uri.split('/api/')

    if(apiVersionCheck.length == 2) {

      if(apiVersionCheck[1].charAt(0) == '0') {

      }
      else {
        uri = `/api/${this.version}/${apiVersionCheck[1]}`
      }

    }

    const url = `${this._basePath}${uri}`

    if(verb == 'post') {

      return {
        send: (data) => {
          return new Promise(async (resolve, reject) => {

            try {
              const result = await request[verb](url).send(data)
    
              resolve(result.body)
            }
            catch(e) {
              //new Composer(e).message(`Could  not fetch as ${verb}`)
              console.error(`Could  not fetch as ${verb}`)
              console.error(e)

              reject()
            }
      
          })
        }
      }

    }
    else {

      return new Promise(async (resolve, reject) => {

        try {
          const result = await request[verb](url)

          resolve(result.body)
        }
        catch(e) {
          new Composer(e).message(`Could  not fetch as ${verb}`)
  
          reject()
        }
  
      })

    }

  }

  start() {

    this.server = http.Server(this._server)
    //this.io = io(this.server)

    this.server.listen(port, () => {
      this._readyResolve(true)
      this.logger.debug(`Node listening on ${this._basePath}`, {})
    })

    // Helpful when terminal process is killed quickly
    process.on('SIGTERM', () => {
      try {
        this.server.close()
      }
      catch(e) {

      }
    })

  }

  stop() {
    this.server.close()
  }

  get() {
    return this._server.get.apply(this._server, arguments)
  }

  set() {
    return this._server.set.apply(this._server, arguments)
  }

  use() {
    return this._server.use.apply(this._server, arguments)
  }
}

module.exports = Server
module.exports.dispatch = dispatch
module.exports.removeHook = removeHook
module.exports.registerHook = registerHook
module.exports.respond = respond
module.exports.Router = Router
module.exports.triggerHook = triggerHook
