import React, { Component } from 'react'
import Bar from './Bar'
import TextContainer from './TextContainer'

const DEFAULT_VALUE = 10
const BLUE = '#c7e4ff'
const LIGHT_BLUE = '#bbfaf8'
const RED = '#ff9494'
const GREEN = '#b3ffc3'
const PURPLE = '#e3c7ff'
const TIME = 500

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

  updateBar = (bars, currNum, currIdx, color, value) => {
    const currBar = this.createBar(currNum, currIdx, color, value)
    bars[currIdx] = currBar
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
      time += this.incrementTime(n)
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
      case 'Merge Sort':
        this.mergeSort()
        break
      case 'Quick Sort':
        this.quickSort()
        break
      case 'Selection Sort':
        this.selectionSort()
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

  incrementTime = (n, b = true) => {
    return b ? TIME / n : 0
  }

  bubbleSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    for (let i = n - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        let currNum, nextNum

        // Highlights bars
        setTimeout(() => {
          currNum = bars[j].props.num
          nextNum = bars[j + 1].props.num
          this.updateBars(bars, currNum, nextNum, j, j + 1, RED, value)
        }, time)
        time += this.incrementTime(n)

        // Switch if not sorted
        setTimeout(() => {
          if (currNum > nextNum) {
            [currNum, nextNum] = [nextNum, currNum]
            this.updateBars(bars, currNum, nextNum, j, j + 1, RED, value)
          }
        }, time)
        time += this.incrementTime(n, nums[j] > nums[j + 1])

        if (nums[j] > nums[j + 1]) {
          const temp = nums[j]
          nums[j] = nums[j + 1]
          nums[j + 1] = temp
        }

        // Change color back
        setTimeout(() => this.updateBars(bars, currNum, nextNum, j, j + 1, BLUE, value), time)
        time += this.incrementTime(n)
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

        let currNum, prevNum

        // Highlight bars
        setTimeout(() => {
          currNum = bars[j].props.num
          prevNum = bars[j - 1].props.num
          this.updateBars(bars, currNum, prevNum, j, j - 1, RED, value)
        }, time)
        time += this.incrementTime(n)

        // Switch if not sorted
        setTimeout(() => {
          if (prevNum > currNum) {
            [currNum, prevNum] = [prevNum, currNum]
            this.updateBars(bars, currNum, prevNum, j, j - 1, RED, value)
          }
        }, time)
        time += this.incrementTime(n)

        // Change color back
        setTimeout(() => this.updateBars(bars, currNum, prevNum, j, j - 1, BLUE, value), time)
        time += this.incrementTime(n)
      }
    }

    setTimeout(() => this.finalizeBars(), time)
  }

  selectionSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i, barMinIdx, minNum, currNum, nextNum

      // Set the first bar to purple
      setTimeout(() => {
        barMinIdx = i
        currNum = minNum = bars[i].props.num
        this.updateBar(bars, minNum, i, PURPLE, value)
      }, time)
      time += this.incrementTime(n)

      for (let j = i + 1; j < n; j++) {
        // Used for timing
        if (nums[j] < nums[minIdx]) {
          minIdx = j
        }

        // Set the next bar to red
        setTimeout(() => {
          nextNum = bars[j].props.num
          this.updateBar(bars, nextNum, j, RED, value)
        }, time)
        time += this.incrementTime(n)

        // If there is new min, change new min to purple
        // Else, change back to blue
        setTimeout(() => {
          if (nextNum < minNum) {
            if (minNum === currNum) {
              this.updateBar(bars, minNum, barMinIdx, RED, value)
            } else {
              this.updateBar(bars, minNum, barMinIdx, BLUE, value)
            }
            barMinIdx = j
            minNum = nextNum
            this.updateBar(bars, minNum, barMinIdx, PURPLE, value)
          } else {
            this.updateBar(bars, nextNum, j, BLUE, value)
          }
        }, time)
        time += this.incrementTime(n)
      }

      // If sorted, stay blue
      // Else, swap bars
      setTimeout(() => {
        if (barMinIdx === i) {
          this.updateBar(bars, minNum, barMinIdx, BLUE, value)
        } else {
          let swapTime = this.incrementTime(n)
          this.updateBars(bars, currNum, minNum, i, barMinIdx, RED, value)

          setTimeout(() => {
            [currNum, minNum] = [minNum, currNum]
            this.updateBars(bars, currNum, minNum, i, barMinIdx, RED, value)
          }, swapTime)
          swapTime += this.incrementTime(n)

          setTimeout(() => this.updateBars(bars, currNum, minNum, i, barMinIdx, BLUE, value), swapTime)
        }
      }, time)
      time += this.incrementTime(n)

      // Used for timing
      if (minIdx !== i) {
        const temp = nums[minIdx]
        nums[minIdx] = nums[i]
        nums[i] = temp
        time += this.incrementTime(n) * 2
      }
    }

    setTimeout(() => this.finalizeBars(), time)
  }

  mergeSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const indices = nums.map((_, idx) => idx)
    const n = bars.length
    const value = this.state.value
    let time = 0

    const helper = (A, I) => {
      if (A.length === 1) {
        return A
      }

      const mid = Math.floor(A.length / 2)
      const left = helper(A.slice(0, mid), I.slice(0, mid))
      const right = helper(A.slice(mid), I.slice(mid))

      mergeVisualizer(left.slice(), right.slice(), I)
      return merge(left, right)
    }

    const merge = (left, right) => {
      const A = []

      while (left.length !== 0 && right.length !== 0) {
        if (left[0] > right[0]) {
          A.push(right.shift())
        } else {
          A.push(left.shift())
        }
      }

      while (left.length !== 0) {
        A.push(left.shift())
      }

      while (right.length !== 0) {
        A.push(right.shift())
      }

      return A
    }

    const mergeVisualizer = (left, right, currIndices) => {
      setTimeout(() => {
        const unsortedArr = left.concat(right)
        const A = []

        while (left.length !== 0 && right.length !== 0) {
          if (left[0] > right[0]) {
            A.push(right.shift())
          } else {
            A.push(left.shift())
          }
        }

        while (left.length !== 0) {
          A.push(left.shift())
        }

        while (right.length !== 0) {
          A.push(right.shift())
        }

        let swapTime = this.incrementTime(n)

        // Highlight all bars in the current indices
        setTimeout(() => {
          for (let i = 0; i < currIndices.length; i++) {
            this.updateBar(bars, unsortedArr[i], currIndices[i], RED, value)
          }
        }, swapTime)
        swapTime += this.incrementTime(n)

        for (let i = 0; i < currIndices.length; i++) {
          // Place the sorted number in the correct position
          setTimeout(() => this.updateBar(bars, A[i], currIndices[i], RED, value), swapTime)
          swapTime += this.incrementTime(n)

          // Change the color back
          setTimeout(() => this.updateBar(bars, A[i], currIndices[i], BLUE, value), swapTime)
          swapTime += this.incrementTime(n)
        }
      }, time)
      time += (2 + 2 * currIndices.length) * this.incrementTime(n)
    }

    helper(nums, indices)
    setTimeout(() => this.finalizeBars(), time)
  }

  quickSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    const helper = (A, l, h) => {
      if (l < h) {
        const pivot = partition(A, l, h)
        helper(A, l, pivot)
        helper(A, pivot + 1, h)
      }
    }

    const partition = (A, l, h) => {
      const pivot = A[l]
      let i = l
      let j = h
      let temp, iBar, jBar, pivotBar, iBarIdx, jBarIdx

      setTimeout(() => {
        pivotBar = bars[l].props.num
        iBarIdx = l
        jBarIdx = h
        this.updateBar(bars, pivotBar, l, PURPLE, value)

        for (let idx = l + 1; idx < h; idx++) {
          const barNum = bars[idx].props.num
          this.updateBar(bars, barNum, idx, RED, value)
        }
      }, time)
      time += this.incrementTime(n)

      while (i < j) {
        do {
          i++

          // Highlight next bar from the left
          setTimeout(() => {
            iBarIdx++
            if (iBarIdx < h) {
              iBar = bars[iBarIdx].props.num
              this.updateBar(bars, iBar, iBarIdx, LIGHT_BLUE, value)
            }
          }, time)
          time += this.incrementTime(n, i < h)

          // Highlight bar red if it is not greater than the pivot
          setTimeout(() => {
            if (iBar <= pivotBar && iBarIdx < h) {
              this.updateBar(bars, iBar, iBarIdx, RED, value)
            }
          }, time)
          time += this.incrementTime(n, A[i] <= pivot && i < h)
        } while (A[i] <= pivot)

        do {
          j--

          // Highlight next bar from the right
          setTimeout(() => {
            jBarIdx--
            if (jBarIdx !== l && jBarIdx !== iBarIdx) {
              jBar = bars[jBarIdx].props.num
              this.updateBar(bars, jBar, jBarIdx, LIGHT_BLUE, value)
            }
          }, time)
          time += this.incrementTime(n, j !== l && j !== i)

          // Highlight bar red if it is not less than or equal to the pivot
          setTimeout(() => {
            if (jBar > pivotBar && jBarIdx !== l && jBarIdx !== iBarIdx) {
              this.updateBar(bars, jBar, jBarIdx, RED, value)
            }
          }, time)
          time += this.incrementTime(n, A[j] > pivot && j !== l && j !== i)
        } while (A[j] > pivot)

        // Switch bars
        setTimeout(() => {
          if (iBarIdx < jBarIdx) {
            [iBar, jBar] = [jBar, iBar]
            this.updateBars(bars, iBar, jBar, iBarIdx, jBarIdx, LIGHT_BLUE, value)
          }
        }, time)

        if (i < j) {
          temp = A[i]
          A[i] = A[j]
          A[j] = temp
          time += this.incrementTime(n)
        }

        // Set bar to red
        setTimeout(() => {
          if (iBarIdx < h) {
            this.updateBar(bars, iBar, iBarIdx, RED, value)
          }

          if (jBarIdx !== l) {
            this.updateBar(bars, jBar, jBarIdx, RED, value)
          }
        }, time)
        time += this.incrementTime(n, i < h || j !== l)
      }

      temp = A[l]
      A[l] = A[j]
      A[j] = temp

      // Set the new pivot location to light blue
      setTimeout(() => {
        if (jBarIdx !== l) {
          this.updateBar(bars, jBar, jBarIdx, LIGHT_BLUE, value)
        }
      }, time)
      time += this.incrementTime(n, j !== l)

      // Switch bars
      setTimeout(() => {
        if (jBarIdx !== l) {
          this.updateBar(bars, pivotBar, jBarIdx, PURPLE, value)
          this.updateBar(bars, jBar, l, LIGHT_BLUE, value)
        }
      }, time)
      time += this.incrementTime(n, j !== l)

      // Change all bars back to blue
      setTimeout(() => {
        for (let idx = l; idx < h; idx++) {
          const barNum = bars[idx].props.num
          this.updateBar(bars, barNum, idx, BLUE, value)
        }
      }, time)
      time += this.incrementTime(n)

      return j
    }

    helper(nums, 0, n)
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

// Miscellaneous Functions

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const getBarWidth = (length, spacing) => (100 - spacing * (length - 1)) / length

const getSpacing = () => {
  const spacing = getComputedStyle(document.body).getPropertyValue('--spacing')
  return parseFloat(spacing)
}

const getMaxBarHeight = () => {
  const textContainerHeight = getComputedStyle(document.body).getPropertyValue('--text-container-height')
  return 100 - parseInt(textContainerHeight)
}

