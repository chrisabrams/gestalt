const Composer = require('../../index')
const {mixins} = require('../../index')
const {compose:events} = require('../../../event-emitter')
const {compose:logger} = require('../../../logger')

describe('Composer', function() {

  /*beforeEach(function() {
    sinon.spy(console, 'error')
    sinon.spy(console, 'log')
  })

  afterEach(function() {
    console.error.restore()
    console.log.restore()
  })*/

  it('should initialize', function() {

    const compose = new Composer()

    expect(compose.logger).to.be.an('object')
    expect(compose.use).to.be.a('function')

  })

  it('should accept mixins', function() {

    const compose = new Composer()
    compose.use(events())
    compose.use(logger())

    expect(compose.debug).to.be.a('function')
    expect(compose.emit).to.be.a('function')
    expect(compose._events).to.be.an('object')
    expect(compose.error).to.be.a('function')
    expect(compose.log).to.be.a('function')
    expect(compose.logger).to.be.an('object')
    expect(compose.off).to.be.a('function')
    expect(compose.on).to.be.a('function')
    expect(compose.once).to.be.a('function')

  })

  it('should add express mixin', function() {

    const compose = new Composer()
    compose.use(logger())
    compose.use(mixins.express())

    expect(compose._types.length).to.equal(1)
    expect(compose._types[0].type).to.equal('express')
    expect(typeof compose._types[0].parseType).to.equal('function')
    expect(typeof compose._types[0].processType).to.equal('undefined')

    compose.error({message: 'The foo ate the bar!', response: {foo: 'bar'}, stack: null})

  })

})
