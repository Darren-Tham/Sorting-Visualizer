import React, { Component } from 'react'
import Bar from './bar-component/Bar'
import TextContainer from './text-component/TextContainer'

const DEFAULT_VALUE = 10
const BLUE = '#c7e4ff'
const RED = '#ff9494'
const GREEN = '#b3ffc3'
const TIME = 100

export default class SortingVisualizer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: DEFAULT_VALUE,
      bars: []
    }
    this.isSorting = false
  }

  componentDidMount = () => this.generateBars(DEFAULT_VALUE)

  // Bar Functions

  createBar = (num, idx, color, value) => {
    const spacing = getSpacing()
    const width = getBarWidth(value, spacing)
    const heightPercentage = getMaxBarHeight() / 100
    const height = heightPercentage * num
    const left = (width + spacing) * idx
    return <Bar key={idx} width={width} height={height} left={left} color={color} num={num} />
  }

  generateBars = value => {
    const bars = []
    for (let i = 0; i < value; i++) {
      const num = randomBetween(5, 100)
      const bar = this.createBar(num, i, BLUE, value)
      bars.push(bar)
    }
    this.setState({ bars })
  }

  updateBars = (bars, currNum, nextNum, currIdx, nextIdx, color, value) => {
    const currBar = this.createBar(currNum, currIdx, color, value)
    const nextBar = this.createBar(nextNum, nextIdx, color, value)
    bars[currIdx] = currBar
    bars[nextIdx] = nextBar
    this.setState({ bars })
  }

  finalizeBars = () => {
    const bars = this.state.bars.slice()
    let time = 0
    const n = this.state.value

    bars.forEach((bar, idx) => {
      setTimeout(() => {
        bars[idx] = this.createBar(bar.props.num, idx, GREEN)
        this.setState({ bars })
      }, time)
      time = this.incrementTime(time, n)
    })

    setTimeout(() => this.isSorting = false, time)
  }

  // Handle Functions

  handleSampleChange = evt => {
    const value = evt.target.value
    this.setState({ value })
    if (!this.isSorting) this.generateBars(value)
  }

  handleSortClick = () => {
    if (this.isSorting || this.state.bars.length != this.state.value) return
    this.isSorting = true

    const dropdown = document.getElementById('dropdown')
    switch (dropdown.value) {
      case 'Bubble Sort':
        this.bubbleSort()
        break
      case 'Insertion Sort':
        this.insertionSort()
        break
      default:
        alert("Please choose a sorting algorithm!")
        this.isSorting = false
    }
  }

  handleResetClick = () => {
    if (this.isSorting) return
    this.generateBars(this.state.value)
  }

  // Sorting Functions

  incrementTime = (time, n) => time + TIME / n

  bubbleSort = () => {
    const bars = this.state.bars.slice()
    const n = bars.length
    const value = this.state.value
    let time = 0

    for (let i = n - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        let currNum
        let nextNum

        // Highlights bars
        setTimeout(() => {
          currNum = bars[j].props.num
          nextNum = bars[j + 1].props.num
          this.updateBars(bars, currNum, nextNum, j, j + 1, RED, value)
        }, time)
        time = this.incrementTime(time, n)

        // Switch if not sorted
        setTimeout(() => {
          if (currNum > nextNum) {
            [currNum, nextNum] = [nextNum, currNum]
            this.updateBars(bars, currNum, nextNum, j, j + 1, RED, value)
          }
        }, time)
        time = this.incrementTime(time, n)

        // Change color back
        setTimeout(() => this.updateBars(bars, currNum, nextNum, j, j + 1, BLUE, value), time)
        time = this.incrementTime(time, n)
      }
    }
    
    setTimeout(() => this.finalizeBars(time, n), time)
  }

  insertionSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    for (let i = 1; i < n; i++) {
      for (let j = i; j > 0 && nums[j - 1] > nums[j]; j--) {
        // Helps stop insertion early
        const temp = nums[j]
        nums[j] = nums[j - 1]
        nums[j - 1] = temp

        let currNum
        let prevNum

        // Highlight bars
        setTimeout(() => {
          currNum = bars[j].props.num
          prevNum = bars[j - 1].props.num
          this.updateBars(bars, currNum, prevNum, j, j - 1, RED, value)
        }, time)
        time = this.incrementTime(time, n)

        // Switch if not sorted
        setTimeout(() => {
          if (prevNum > currNum) {
            [currNum, prevNum] = [prevNum, currNum]
            this.updateBars(bars, currNum, prevNum, j, j - 1, RED, value)
          }
        }, time)
        time = this.incrementTime(time, n)

        // Change color back
        setTimeout(() => this.updateBars(bars, currNum, prevNum, j, j - 1, BLUE, value), time)
        time = this.incrementTime(time, n)
      }
    }

    setTimeout(() => this.finalizeBars(), time)
  }

  // Render Function

  render = () => {
    return (
      <>
        <div>
          {this.state.bars.map(bar => bar)}
        </div>
        <TextContainer defaultValue={this.state.value} handleSampleChange={this.handleSampleChange} handleSortClick={this.handleSortClick} handleResetClick={this.handleResetClick} />
      </>
    )
  }
}

// Styling Functions

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