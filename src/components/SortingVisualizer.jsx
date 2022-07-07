import React, { Component } from 'react'
import Bar from './bar-component/Bar'
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
    const spacing = getSpacing()
    const width = getBarWidth(value, spacing)
    const heightPercentage = getMaxBarHeight() / 100

    for (let i = 0; i < value; i++) {
      const num = randomBetween(5, 100)
      const height = heightPercentage * num
      const left = (width + spacing) * i
      arr.push(<Bar key={i} width={width} height={height} left={left} num={num} />)
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
        const arr = BubbleSort(this.state.arr)
        this.setState({ arr })
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
      <>
        <div>
          {this.state.arr.map(bar => bar)}
        </div>
        <TextContainer defaultValue={this.state.value} handleSampleChange={this.handleSampleChange} handleClick={this.handleClick} handleAlgorithmChange={this.handleAlgorithmChange} />
      </>
    )
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getBarWidth(length, spacing) {
  return (100 - spacing * (length - 1)) / length
}

function getSpacing() {
  const spacing = getComputedStyle(document.body).getPropertyValue('--spacing')
  return parseFloat(spacing)
}

function getMaxBarHeight() {
  const textContainerHeight = getComputedStyle(document.body).getPropertyValue('--text-container-height')
  return 100 - parseInt(textContainerHeight)
}