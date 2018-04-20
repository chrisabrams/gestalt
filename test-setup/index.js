const chai  = require('chai')
const Compose = require('gestalt-compose')
const path = require('path')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

function setup(envPath) {

  process.on('uncaughtException', function(e) {
    console.error(e)
    new Compose(e, {uncaught: true})
  })
  
  process.on('unhandledRejection', function(e) {
    console.error(e)
    new Compose(e, {unhandled: true})
  })
  
  if(typeof envPath == 'string') {
    require('dotenv').config({path: envPath})
  }

  chai.use(sinonChai)
  
  global.expect = chai.expect
  global.sinon  = sinon
  

}

module.exports = setup
