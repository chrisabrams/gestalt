const Composer = require('../../compose/src')

process.on('uncaughtException', function(e) {
  new Composer(e, {uncaught: true})
})

process.on('unhandledRejection', function(e) {
  new Composer(e, {unhandled: true})
})

const path = require('path')
require('dotenv').config({path: path.join(__dirname, '../../', '.env')})

const chai  = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

global.expect = chai.expect
global.sinon  = sinon
