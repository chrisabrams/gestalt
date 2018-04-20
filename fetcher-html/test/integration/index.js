const fs = require('fs')
const HTMLFetcher = require('../../src/index')

describe('HTML Fetcher: Integration', function() {

  it('should fetch page dimensions', async function() {
    this.timeout(10000)

    const scraper = new HTMLFetcher({url: 'http://www.greenmatters.com'})

    const data = await scraper
      .start()
      .getDimensions()
      .stop()
      .run(() => scraper.data)

    expect(typeof data.dimensions.width == 'number').to.be.true

  })

  it('should convert page to pdf', async function() {
    this.timeout(10000)

    const scraper = new HTMLFetcher({url: 'http://www.greenmatters.com'})

    const pagePath = '/tmp/gm.pdf'
    const data = await scraper
      .start()
      .toPDF(pagePath)
      .stop()
      .run()

    expect(fs.existsSync(pagePath)).to.be.true

  })

  it('should convert page to screenshot', async function() {
    this.timeout(10000)

    const scraper = new HTMLFetcher({url: 'http://www.greenmatters.com'})

    const pagePath = '/tmp/gm.png'
    const data = await scraper
      .start()
      .toScreenshot(pagePath)
      .stop()
      .run()

    expect(fs.existsSync(pagePath)).to.be.true

  })

  it('should convert full page to screenshot', async function() {
    this.timeout(10000)

    const scraper = new HTMLFetcher({url: 'http://www.greenmatters.com'})

    const pagePath = '/tmp/gm-full.png'
    const data = await scraper
      .start()
      .toScreenshot(pagePath, {full: true})
      .stop()
      .run()

    expect(fs.existsSync(pagePath)).to.be.true

  })

  it('should get nodes of page by text', async function() {
    this.timeout(10000)

    const scraper = new HTMLFetcher({url: 'http://www.greenmatters.com'})

    const data = await scraper
      .start()
      .getNodesContainingText('news', 'news')
      .stop()
      .run(() => scraper.data)

    expect(data.evaluate.news.length > 0).to.be.true

  })

})
