const bodyParser = require('body-parser')
const Composer = require('../../compose')
const express = require('express')
const http = require('http')
//const io = require('socket.io')
const Logger = require('../../logger')
const {dispatch, removeHook, registerHook, respond, Router, triggerHook} = require('./router')
const request = require('superagent')

const PORT = process.env.GESTALT_SERVER_PORT
const version = process.env.GESTALT_SERVER_VERSION || 0.1

class Server {
  constructor(options = {}) {
    this.io = null
    this.logger = new Logger()
    this.router = options.router || null
    this.routes = options.routes || []
    this.routesList = {}
    this.version = version

    this._basePath = `http://localhost:${PORT}`
    this._server = express()
    this._server.use(bodyParser.json())
    this._server.use(bodyParser.urlencoded({ extended: true }))

    this.generateRoutes()

  }

  generateRoutes() {

    const foo = (req, res) => {res.json({pkg: req.body})}
    const myrouter = express.Router()
    myrouter.post('/', foo)
    this._server.use('/foo', myrouter)

    for(let i = 0, l = this.routes.length; i < l; i++) {
      const {name, routes} = this.routes[i]
      let routesList = {}
      const route = `/api/${this.version}/${name}`
      console.log('route', route)
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
    console.log('routesList', this.routesList)

  }

  get(uri) {
    return this.requestUri('get', uri)
  }

  hook(options = {}, cb) {
    return registerHook(options, cb)
  }

  post(uri) {
    return this.requestUri('post', uri)
  }

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
              new Composer(e).message(`Could  not fetch as ${verb}`)
              console.error('HITTTTTTTTTTT')
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

    this.server.listen(PORT, () => {
      this.logger.debug(`Node listening on ${this._basePath}`, {})
    })
  }

  stop() {
    this.server.close()
  }
}

module.exports = Server
module.exports.dispatch = dispatch
module.exports.removeHook = removeHook
module.exports.registerHook = registerHook
module.exports.respond = respond
module.exports.Router = Router
module.exports.triggerHook = triggerHook
