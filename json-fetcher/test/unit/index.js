const JF = require('../../src/index')

describe('JSON Fetcher', function() {

  it('should not fetch a resource (not found)', async function() {

    const jf = new JF({url: 'https://foooobaaazzzz.com/a/b/c/d/e/f/g'})

    try {
      await jf.fetch({responseTimeout: 1000}).parse()
    }
    catch(e) {
      expect(typeof e == 'object').to.be.true
    }

  })

  it('should fetch a resource', async function() {

    const jf = new JF({url: 'https://bittrex.com/api/v1.1/public/getmarketsummary?market=usdt-btc'})

    const result = await jf.fetch().parse()

    expect(result.result instanceof Array).to.be.true

  })

  it('should fetch and parse a resource', async function() {

    const jf = new JF({url: 'https://bittrex.com/api/v1.1/public/getmarketsummary?market=usdt-btc'})

    const result = await jf.fetch().parse((res) => res.result[0])

    expect(result.MarketName).to.equal('USDT-BTC')

  })

})
