const EE = require('../../event-emitter')
const MW = require('../../middleware')

class MiddlewareProcessor {

  constructor() {

    const ee = this.ee = new EE()
    this.emit = ee.emit.bind(ee)
    this.on = ee.on.bind(ee)

    const mw = this.mw = new MW()
    mw.emit = ee.emit.bind(ee)
    mw.on = ee.on.bind(ee)
    this.next = mw.next.bind(mw)
    this.use = mw.use.bind(mw)
  }

}

module.exports = MiddlewareProcessor
