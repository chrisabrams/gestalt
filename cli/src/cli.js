const fs = require('fs')

class CLI {
  constructor({argv, configPath}) {
    this.argv = argv
    this.commands = []
    this._configPath = configPath

    this._config = this.config()
  }

  config() {

    if(arguments.length == 0) {
      try {
        return JSON.parse(fs.readFileSync(this._configPath, 'utf8'))
      }
      catch(e) {
        return {}
      }
    }

    this._config = Object.assign({}, arguments[0])

    fs.writeFileSync(this._configPath, `${JSON.stringify(this._config)}\n`, 'utf8')
  }

  registerCommand(name, Command, actions) {
    this.commands.push({name, Command, actions})

    return this
  }

  start() {

    for(let i = 0, l = this.commands.length; i < l; i++) {
      this.cmd = this.commands[i]
      const name = this.cmd.name
      const actions = this.cmd.actions

      if(name == this.argv._[0]) {
        const command = new this.cmd.Command({argv: this.argv})
        command.config = this.config.bind(this) // Enable commands to have access to config
        actions(command)

        command.process() // This is on the super
        break
      }
    }
  }
}

module.exports = CLI
