const React = require('react')
const ReactDOM = require('react-dom')
const { mount } = require('enzyme')
const { MemoryRouter } = require('react-router')

const App = require('../helpers/app')
const { Foo, Home, NotFound } = require('../helpers/app').components

describe('React Router Middleware', function() {

  it('should match a valid path', () => {
  
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <App />
      </MemoryRouter>
    )

    expect(wrapper.find(Foo)).to.have.length(0)
    expect(wrapper.find(Home)).to.have.length(1)
    expect(wrapper.find(NotFound)).to.have.length(0)
  
  })

  it('should match a valid path with middleware', () => {
  
    const wrapper = mount(
      <MemoryRouter initialEntries={['/foo']} initialIndex={0}>
        <App />
      </MemoryRouter>
    )

    expect(wrapper.find(Foo)).to.have.length(1)
    expect(wrapper.find(Home)).to.have.length(0)
    expect(wrapper.find(NotFound)).to.have.length(0)
  
  })

})
