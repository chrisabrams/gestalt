process.env.NODE_ENV = 'test'

const chai  = require('chai')
const path = require('path')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

function setup(envPath, options = {}) {

  const onReact = options.react

  process.on('uncaughtException', function(e) {
    try {
      const Compose = require('gestalt-compose')
      new Compose(e, {uncaught: true})
    }
    catch(err) {
      console.error(e)
    }
  })
  
  process.on('unhandledRejection', function(e) {
    try {
      const Compose = require('gestalt-compose')
      new Compose(e, {uncaught: true})
    }
    catch(err) {
      console.error(e)
    }
  })
  
  if(typeof envPath == 'string') {
    require('dotenv').config({path: envPath})
  }

  if(typeof onReact == 'boolean' && onReact) {

    require('babel-core/register')
    require('raf/polyfill')

    require.extensions['.css'] = function () {return null}

    // Configure JSDOM and set global variables
    // to simulate a browser environment for tests.
    const { JSDOM } = require('jsdom')
    const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
    const { window } = jsdom

    function copyProps(src, target) {
      const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .reduce((result, prop) => ({
          ...result,
          [prop]: Object.getOwnPropertyDescriptor(src, prop),
        }), {})
      Object.defineProperties(target, props)
    }

    global.window = window
    global.document = window.document
    global.navigator = {
      userAgent: 'node.js',
    }
    copyProps(window, global)

    const Enzyme = require('enzyme')
    const Adapter = require('enzyme-adapter-react-16')
    Enzyme.configure({ adapter: new Adapter() })

    const chaiEnzyme = require('chai-enzyme')
    chai.use(chaiEnzyme())

  }

  chai.use(sinonChai)
  
  global.expect = chai.expect
  global.sinon  = sinon
  

}

module.exports = setup
