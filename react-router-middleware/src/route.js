const React = require('react')
const {Component} = require('react')
const MiddlewareProcessor = require('./process-middleware')
const {Route, Redirect} = require('react-router-dom')

class MiddlewareRoute extends Component {

  constructor(props) {
    super(props)

    this.error = undefined
    this.inProgress = false
    this.processor = new MiddlewareProcessor()

    /*
    NOTE: Can't render a route with a both component & render property
    */
    this.rProps = Object.assign({}, props)
    delete this.rProps.component

    this.state = {
      completed: false,
      props: this.rProps,
      redirectPathname: this.props.redirectPathname // Default path to send on redirect
    }

  }

  componentWillMount() {
    this.processMiddleware()
  }

  componentWillReceiveProps(nextProps) {

    /*
    This is a Component that was mounted from another route; let the component know that the route has changed
    */
    if(this.state.completed && this.props.computedMatch.path != nextProps.computedMatch.path) {
      this.setState({props: nextProps})
    }
  }

  processMiddleware() {

    const middleware = (this.props.middleware instanceof Array) ? this.props.middleware : []

    if(middleware.length > 0) {
      for(let i = 0, l = middleware.length; i < l; i++) {
        const m = middleware[i]
  
        this.processor.use(m)
      }
      
      this.processor
        .on('end', () => {
          this.setState({
            completed: true,
            //redirectPathname: '/dashboard'
          })
        })
        .on('error', (e) => {
          this.error = e
  
          this.setState({
            completed: true,
            //redirectPathname: '/dashboard'
          })
        })
  
      this.processor.next()
    }
    else {
      this.setState({
        completed: true
      })
    }

  }

  redirect = (props, pathname) => {
    const options = {pathname, state: {from: props.location}}
    return <Redirect to={options} />
  }

  renderComponent = (props) => {
    const Component = this.props.component

    if(!this.error) {
      return <Component {...props} />
    }

    return this.redirect(props, this.state.redirectPathname)

  }

  render() {

    // Can use this to create an optional spinner component while waiting for async function to complete
    const spinner = null

    return this.state.completed
      ? <Route
          {...this.state.props}
          ref='route'
          render={this.renderComponent}
        />
      : spinner

  }

}

module.exports = MiddlewareRoute
