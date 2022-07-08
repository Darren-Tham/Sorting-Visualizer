import React, { Component } from 'react'
import Bar from './bar-component/Bar'
import TextContainer from './text-component/TextContainer'

const DEFAULT_VALUE = 10
const BLUE = '#c7e4ff'
const RED = '#ff9494'
const TIME = 500

export default class SortingVisualizer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      algorithm: '',
      value: DEFAULT_VALUE,
      bars: []
    }
  }

  componentDidMount = () => this.generateBars(this.state.value)

  createBar = (num, idx, selected, length = this.state.value) => {
    const spacing = getSpacing()
    const width = getBarWidth(length, spacing)
    const heightPercentage = getMaxBarHeight() / 100
    const height = heightPercentage * num
    const left = (width + spacing) * idx
    const color = selected ? RED : BLUE
    return <Bar key={idx} width={width} height={height} left={left} color={color} num={num} />
  }

  generateBars = value => {
    const bars = []
    for (let i = 0; i < value; i++) {
      const num = randomBetween(5, 100)
      const bar = this.createBar(num, i, false, value)
      bars.push(bar)
    }
    this.setState({ bars })
  }

  handleSampleChange = evt => {
    const value = evt.target.value
    this.generateBars(value)
    this.setState({ value })
  }

  handleAlgorithmChange = evt => {
    const algorithm = evt.target.value
    this.setState({ algorithm })
  }

  handleClick = () => {
    switch (this.state.algorithm) {
      case 'Bubble Sort':
        this.bubbleSort()
        break
      case 'Insertion Sort':
        this.insertionSort()
        break
      default:
        alert("Please choose a sorting algorithm!")
    }
  }

  updateBars(bars, currNum, nextNum, currIdx, nextIdx, selected) {
    const currBar = this.createBar(currNum, currIdx, selected)
    const nextBar = this.createBar(nextNum, nextIdx, selected)
    bars[currIdx] = currBar
    bars[nextIdx] = nextBar
    this.setState({ bars })
  }

  bubbleSort = () => {
    const bars = this.state.bars.slice()
    const n = bars.length
    let count = 0

    for (let i = n - 1; i > 0; i--) {
      for (let j = 0; j < i; j++, count++) {
        const totalTime = TIME * count / n
        const swapTime = TIME / n / 3
        const resetTime = swapTime * 2

        setTimeout(() => {
          let currNum = bars[j].props.num
          let nextNum = bars[j + 1].props.num
          this.updateBars(bars, currNum, nextNum, j, j + 1, true)

          setTimeout(() => {
            if (currNum > nextNum) {
              [currNum, nextNum] = [nextNum, currNum]
              this.updateBars(bars, currNum, nextNum, j, j + 1, true)
            }
          }, swapTime)

          setTimeout(() => this.updateBars(bars, currNum, nextNum, j, j + 1, false), resetTime)
        }, totalTime)
      }
    }
  }

  insertionSort = () => {
    const bars = this.state.bars.slice()
    const n = bars.length
    let count = 0

    for (let i = 1; i < n; i++, count++) {      
      const currNum = bars[i].props.num
      const prevNum = bars[i - 1].props.num
      setTimeout(() => this.updateBars(bars, currNum, prevNum, i, i - 1, true), 100 * count)
      for (let j = i; j > 0 && arr[j - 1] > arr[j]; j--, count++) {
        
      }
    }
  }

  render() {
    return (
      <>
        <div>
          {this.state.bars.map(bar => bar)}
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