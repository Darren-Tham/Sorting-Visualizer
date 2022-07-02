import React from 'react'
import ReactDOM from 'react-dom/client'
import Bars from './components/bar-component/Bars'
import TextContainer from './components/text-component/TextContainer'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<div>
  <Bars />
  <TextContainer />
</div>)
