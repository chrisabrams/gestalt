const winston = require('winston')

const logger = winston.createLogger({
  colorize: true,
  level: (process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'silly',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

class Logger {

  constructor() {
    return logger
  }

}

module.exports = Logger