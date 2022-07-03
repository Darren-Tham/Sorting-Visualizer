import React, { Component } from 'react'
import Bars from './bar-component/Bars'
import TextContainer from './text-component/TextContainer'

export default class SortingVisualizer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 10,
      arr: []
    }
  }

  componentDidMount = () => this.generateArr(this.state.value)

  generateArr = (value) => {
    const arr = []
    for (let i = 0; i < value; i++) {
      const randomNum = randomBetween(5, 100)
      arr.push(randomNum)
    }
    this.setState({ arr })
  }

  handleChange = evt => {
    const value = evt.target.value
    this.generateArr(value)
    this.setState({ value })
  }

  render() {
    return (
      <div>
        <Bars arr={this.state.arr} />
        <TextContainer handleChange={this.handleChange} />
      </div>
    )
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}