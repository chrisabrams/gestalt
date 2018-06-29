function time() {

}

time.now = function now() {
  const date = new Date(Date.now())

  return date.toISOString()
}

module.exports = time
