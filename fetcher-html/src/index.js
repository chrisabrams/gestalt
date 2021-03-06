const methodChainMixin = require('../../method-chain')
const puppeteer = require('puppeteer')

function matchNodes(text) {

  try {

    const filter = {
      acceptNode: function(node){
        if(node.nodeValue.toLowerCase().includes(text)){
          return NodeFilter.FILTER_ACCEPT
        }

        return NodeFilter.FILTER_REJECT
      }
    }

    const nodes = []
    const rootElement = document.body
    const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, filter, false)

    while(walker.nextNode()) {
      nodes.push(walker.currentNode.parentNode)
    }

    return nodes.map(({ innerText }) => innerText)
  }
  catch(e) {
    console.error(e)
    return e
  }

}

class HTMLFetcher {

  constructor(options = {}) {

    this.data = {}
    this.headless = (typeof options.headless == 'boolean') ? options.headless : true
    this.url = options.url

    this._start()

  }

  authenticate(username, password) {

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {
        await this.page.authenticate({username, password})

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  evaluate(key, select) {
    if(!this.data.evaluate) {
      this.data.evaluate = {}
    }

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {
        const selection = await this.page.$$selector(select)

        this.data.evaluate[key] = selection

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))


  }

  getDimensions() {
    if(!this.data.dimensions) {
      this.data.dimensions = {}
    }

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {
        const dimensions = await this.page.evaluate(() => {
          return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio
          }
        })

        Object.assign(this.data.dimensions, dimensions)

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  getNodesContainingText(key, text, options = {ignore: []}) {
    if(!this.data.evaluate) {
      this.data.evaluate = {}
    }

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      const nodes = await this.page.evaluate(matchNodes, text)

      if(nodes instanceof Array) {
        this.data.evaluate[key] = nodes

        resolve()
      }
      else {
        console.error('ERROR\n', nodes)
        reject(nodes)
      }

    }))

  }

  _start() {

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {

        this.browser = await puppeteer.launch({headless: this.headless})
        this.page = await this.browser.newPage()

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  start() {

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {

        await this.page.goto(this.url)

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  stop(cb) {

    return this._addToChain(() => new Promise((resolve, reject) => {

      try {
        this.browser.close()

        resolve()
      }
      catch(e) {
        reject(e)
      }

    })).run(cb)

  }

  toPDF(path = '/tmp/page.pdf', options = {format: 'A4'}) {

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {
        await this.page.pdf({path, format: options.format})

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  toScreenshot(path = '/tmp/screenshot.png', options = {full: false}) {

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {
        await this.page.screenshot({path, fullPage: options.full})

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  waitForSelector(selector) {

    return this._addToChain(() => new Promise(async(resolve, reject) => {

      try {
        await this.page.waitForSelector(selector)

        resolve()
      }
      catch(e) {
        reject(e)
      }

    }))

  }

}

Object.assign(HTMLFetcher.prototype, methodChainMixin)
module.exports = HTMLFetcher
