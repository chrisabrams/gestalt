const gulp = require('gulp')
const mocha = require('gulp-mocha')

function processMocha(patterns) {
  //console.log('patterns', patterns)
  gulp
    .src(patterns, {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .once('end', function () {
      console.log('on end')
 
      process.exit()
    })
    .on('error', function (e) {
      console.error(e)

      process.exit(1)
    })

}

gulp.task('mocha', function(done) {

  processMocha([
    './test/setup.js',
    './compose/test/unit/*.js'
    //'./event-emitter/test/unit/*.js',
    //'./gc-fn-worker/test/unit/*.js',
    //'./gc-pubsub/test/integration/**/*.js',
    //'./fetcher-html/test/**/index.js',
    //'./json-fetcher/test/unit/index.js',
    //'./method-chain/test/unit/*.js'
  ])

})
