const Worker = require('../../src/index')

describe('GC Function Worker', function() {

  it('should run a task with event data [stringified]', async function() {

    const worker = new Worker({callback: function callback() {}, event: {data: JSON.stringify({foo: 'bar'})}})

    const event = await worker.process((event) => event)

    expect(event.data.foo).to.equal('bar')

  })

  it('should run a task with event data [buffer]', async function() {

    const worker = new Worker({callback: function callback() {}, event: {data: Buffer.from(JSON.stringify({foo: 'bar'}))}})

    const event = await worker.process((event) => event)

    expect(event.data.foo).to.equal('bar')

  })

})
