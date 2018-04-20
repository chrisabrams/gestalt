const PubSub = require('../../src')

describe('PubSub', function() {

  it('should publish a message', async function() {

    const pubsub = new PubSub({topic: 'test'})

    const id = await pubsub.publish({foo: 'bar'})

    expect(id).to.be.a('string')

  })

  it.only('should subscribe to a topic', function() {

    const pubsub = new PubSub({topic: 'test'})

    return new Promise(async (resolve, reject) => {

      const id = await pubsub.publish({foo: 'bar'})

      pubsub.onMessage((message) => {
  
        expect(message.data).to.be.an('object')
        expect(message.id).to.be.a('string')

        message.ack()
  
        pubsub.offMessage()

        resolve()
  
      })

    })

  })

})
