const Pubsub = require('@google-cloud/pubsub')

const pubsub = new Pubsub({
  keyFilename: process.env.GCLOUD_CREDENTIALS_PATH,
  projectId: process.env.GCLOUD_PROJECT
})

class PubSub {

  constructor(options = {}) {
    this._cb = null
    this.topic = pubsub.topic(options.topic)
    this.publisher = this.topic.publisher()
    this.subscription = pubsub.subscription(options.subscription || options.topic)

  }

  getTopics() {
    return pubsub.getTopics()
  }

  offMessage() {

    this.subscription.removeListener('message', this._cb)

  }

  onMessage(cb) {

    this._cb = (message) => {

      message.data = PubSub.parseMessage(message)

      cb(message)

    }

    this._cb = this._cb.bind(this)

    this.subscription.on('message', this._cb)

  }

  static parseMessage(message) {

    try {
      return JSON.parse(message.data.toString('utf8'))
    }
    catch(e) {
      console.error('Could not parse message', e)

      return {}
    }

  }

  publish(data) {

    return new Promise( (resolve, reject) => {

      let pkg = data

      if(typeof data == 'object') {
        pkg = Buffer.from(JSON.stringify(data))
      }

      this.publisher
        .publish(pkg)
        .then(function(id) {
          resolve(id)
        })
        .catch(err => {
          console.error('ERROR:', err);
          reject(err)
        })

    })

  }

}

module.exports = PubSub
