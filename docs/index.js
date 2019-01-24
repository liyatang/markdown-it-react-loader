import React from 'react'
import ReactDOM from 'react-dom'
import ReadMe from '../README.md'

class Index extends React.Component {
  render () {
    return (
      <ReadMe/>
    )
  }
}

ReactDOM.render(<Index/>, document.getElementById('appContainer'))
