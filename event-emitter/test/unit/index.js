const EventEmitter = require('../../src')

describe('Event Emitter', () => {

  it('should emit an event', (done) => {

    const eventer = new EventEmitter()

    eventer.on('change', function(foo) {
      expect(foo).to.equal('bar')

      done()
    })

    eventer.emit('change', 'bar')

  })

  it('should remove an event', (done) => {

    const eventer = new EventEmitter()
    const spy     = sinon.spy(eventer, 'on')

    eventer.on('change', function() {
      eventer.off('change')
      eventer.emit('change')

      expect(spy.calledOnce).to.be.true

      done()
    })

    eventer.emit('change')

  })

  it('should emit an event once', (done) => {

    const eventer = new EventEmitter()

    eventer.once('change', function(foo) {
      expect(foo).to.equal('bar')

      done()
    })

    eventer.emit('change', 'bar')

  })

})
