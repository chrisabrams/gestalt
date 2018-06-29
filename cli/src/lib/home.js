const home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']

module.exports = home