import React, { Component } from 'react'
import Bars from './bar-component/Bars'
import TextContainer from './text-component/TextContainer'
import BubbleSort from './sorting-algorithms/BubbleSort'

const DEFAULT_VALUE = 10

export default class SortingVisualizer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      algorithm: '',
      value: DEFAULT_VALUE,
      arr: []
    }
  }

  componentDidMount = () => this.generateArr(this.state.value)

  generateArr = value => {
    const arr = []
    for (let i = 0; i < value; i++) {
      const randomNum = randomBetween(5, 100)
      arr.push(randomNum)
    }
    this.setState({ arr })
  }

  handleSampleChange = evt => {
    const value = evt.target.value
    this.generateArr(value)
    this.setState({ value })
  }

  handleClick = () => {
    switch (this.state.algorithm) {
      case 'Bubble Sort':
        BubbleSort()
        break
      default:
        alert("Please choose a sorting algorithm!")
    }
  }

  handleAlgorithmChange = evt => {
    const algorithm = evt.target.value
    this.setState({ algorithm })
  }

  render() {
    return (
      <div>
        <Bars arr={this.state.arr} />
        <TextContainer defaultValue={this.state.value} handleSampleChange={this.handleSampleChange} handleClick={this.handleClick} handleAlgorithmChange={this.handleAlgorithmChange} />
      </div>
    )
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}