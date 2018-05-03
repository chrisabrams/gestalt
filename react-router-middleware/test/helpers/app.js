const React = require('react')
const {Component} = require('react')
const Route = require('../../src/route')
const {
  Switch
} = require('react-router-dom')

const Home = () => <div id='home'>Home</div>
const Foo = () => <div id='foo'>Foo</div>
const NotFound = () => <div id='notfound'>Not Found</div>

function fooware(o, next) {
  next()
}

class App extends Component {

  render() {
    return (
      <Switch>
        <Route path="/foo" middleware={[fooware]} component={Foo} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

module.exports = App
module.exports.components = {
  Foo,
  Home,
  NotFound
}
