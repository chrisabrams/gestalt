const mixin = require('../../src/index')

describe('Method Chain', function() {

  it('should assign to class', function() {

    class Foo {}
    Object.assign(Foo.prototype, mixin)
    const foo = new Foo()

    expect(typeof foo._addToChain).to.equal('function')
    expect(typeof foo._reset).to.equal('function')
    expect(typeof foo.run).to.equal('function')
    expect(foo._steps.length).to.equal(0)

  })

  it('should chain a method', async function() {

    class Foo {
      bar() {
        return this._addToChain(new Promise((resolve, reject) => {resolve('baz')}))
      }
    }
    Object.assign(Foo.prototype, mixin)
    const foo = new Foo()

    const result = await foo.bar().run()

    expect(result).to.equal('baz')

  })

  it('should chain a method, using await on method', async function() {

    class Foo {
      constructor() {

      }

      one() {
        function _one() {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }

        return this._addToChain(new Promise(async (resolve, reject) => {
          this.foo = await _one()
          resolve()
        }))
      }

    }
    Object.assign(Foo.prototype, mixin)

    const foo = new Foo()

    const result = await foo.one().run()

    expect(foo.foo).to.be.true

  })

  it('should chain two methods, getting the scope value created in the previous method', async function() {

    class Foo {
      constructor() {

      }

      one() {
        return this._addToChain(() => new Promise((resolve, reject) => {
          this.foo = true
          resolve()
        }))
      }

      two() {
        return this._addToChain(() => new Promise((resolve, reject) => {
          this.bar = this.foo
          resolve()
        }))
      }
    }
    Object.assign(Foo.prototype, mixin)

    const foo = new Foo()

    const result = await foo.one().two().run()

    expect(foo.bar).to.be.true

  })

  it('should chain two methods, getting the scope value created in the previous method, using await on methods', async function() {

    class Foo {
      constructor() {

      }

      one() {
        function _one() {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }

        return this._addToChain(() => new Promise(async (resolve, reject) => {
          this.foo = await _one()

          resolve()
        }))
      }

      two() {
        return this._addToChain(() => new Promise((resolve, reject) => {
          this.bar = this.foo

          resolve()
        }))
      }
    }
    Object.assign(Foo.prototype, mixin)

    const foo = new Foo()

    const result = await foo.one().two().run()

    expect(foo.bar).to.be.true

  })

  it('should chain two methods, passing the value', async function() {

    class Foo {
      constructor() {
        this.value = 0
      }

      add() {
        return this._addToChain(() => new Promise((resolve, reject) => {resolve(this.value + 1)}))
      }

      subtract() {
        return this._addToChain((value) => new Promise((resolve, reject) => {resolve(value - 1)}))
      }
    }
    Object.assign(Foo.prototype, mixin)

    const foo = new Foo()

    const result = await foo.add().subtract().run()

    expect(result).to.equal(0)

  })

})
