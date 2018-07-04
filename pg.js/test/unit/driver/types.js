const {castType} = require('../../../src/driver/types')

describe('Driver: Types', function() {

  it('should cast a type: int', function() {

    const val1 = castType('int', 5)
    expect(val1).to.equal(5)

    const val2 = castType('int', '5')
    expect(val2).to.equal(5)

  })

  it('should cast a type: bigint', function() {

    const val1 = castType('int', 5)
    expect(val1).to.equal(5)

    const val2 = castType('int', '5')
    expect(val2).to.equal(5)

  })

  it('should cast a type: decimal', function() {

    const val1 = castType('int', 5)
    expect(val1).to.equal(5)

    const val2 = castType('int', '5.00')
    expect(val2).to.equal(5.00)

  })

  it('should cast a type: string', function() {

    const val1 = castType('string', 5)
    expect(val1).to.equal('5')

    const val2 = castType('string', 5.00)
    expect(val2).to.equal('5') // JavaScript converts decimals -> string as int

  })

})
