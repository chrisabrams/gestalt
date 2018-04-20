class GoogleCloudFunctionWorker {

  constructor(options = {}) {
    this.callback = options.callback
    this.event = options.event
  }

  async process(fn) {

    const event = this.event
    const data = (Buffer.isBuffer(event.data)) ? event.data.toString('utf8') : event.data

    event.data = JSON.parse(data)

    const result = await fn(event)

    this.callback()

    return result

  }

}

module.exports = GoogleCloudFunctionWorker
