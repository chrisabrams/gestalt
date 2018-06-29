const Err = require('../error')
const {ACTION_MISSING, ACTION_NOT_FOUND} = require('../error')

class Command {
  constructor(options = {}) {
    this.argv = options.argv
    this.action = this.argv._[1]
    this.actions = []

    if(!this.action) {
      new Err(ACTION_MISSING)
    }
  }

  process() {

    let actionExecuted = false

    for(let i = 0, l = this.actions.length; i < l; i++) {
      const action = this.actions[i]
      const name = action.name
      const fn = action.fn || this[name]

      if(this.action == name) {
        fn.call(this)
        actionExecuted = true
        break
      }
    }

    if(!actionExecuted) {
      new Err(ACTION_NOT_FOUND)
    }
  }

  registerAction(name, action) {
    this.actions.push({name, fn: action})

    return this
  }
}

module.exports = Command
