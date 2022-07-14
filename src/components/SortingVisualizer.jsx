import React, { Component } from 'react'
import Bar from './Bar'
import TextContainer from './TextContainer'

const DEFAULT_VALUE = 10
const BLUE = '#c7e4ff'
const LIGHT_BLUE = '#bbfaf8'
const RED = '#ff9494'
const GREEN = '#b3ffc3'
const PURPLE = '#e3c7ff'
const TIME = 1000

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

  createBar = (num, i, color, value) => {
    const spacing = getSpacing()
    const width = getBarWidth(value, spacing)
    const heightPercentage = getMaxBarHeight() / 100
    const height = heightPercentage * num
    const left = (width + spacing) * i
    return <Bar key={i} width={width} height={height} left={left} color={color} num={num} />
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

  updateBar = (bars, num, i, color, value) => {
    bars[i] = this.createBar(num, i, color, value)
    this.setState({ bars })
  }

  resetBars = (bars, N) => {
    bars.forEach((bar, i) => {
      const num = bar.props.num
      bars[i] = this.createBar(num, i, BLUE, N)
    })
    this.setState({ bars })
  }

  finalizeBars = (bars, N) => {
    let time = 0
    bars.forEach((bar, i) => {
      setTimeout(() => {
        const num = bar.props.num
        bars[i] = this.createBar(num, i, GREEN, N)
        this.setState({ bars })
      }, time)
      time += this.incrementTime(N)
    })

    setTimeout(() => this.isSorting = false, time)
  }

  // Handle Functions

  handleSampleChange = evt => {
    const value = evt.target.value
    this.setState({ value })
    if (!this.isSorting) {
      this.generateBars(value)
    }
  }

  handleSortClick = () => {
    if (this.isSorting || this.state.bars.length !== parseInt(this.state.value)) return
    this.isSorting = true

    const dropdown = document.getElementById('dropdown')
    switch (dropdown.value) {
      case 'Bitonic Sort':
        this.bitonicSort()
        break
      case 'Bogo Sort':
        this.bogoSort()
        break
      case 'Bubble Sort':
        this.bubbleSort()
        break
      case 'Cocktail Sort':
        this.cocktailSort()
        break
      case 'Gnome Sort':
        this.gnomeSort()
        break
      case 'Heap Sort':
        this.heapSort()
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
      case 'Radix Sort':
        this.radixSort()
        break
      case 'Selection Sort':
        this.selectionSort()
        break
      case 'Shell Sort':
        this.shellSort()
        break
      default:
        alert("Please choose a sorting algorithm!")
        this.isSorting = false
    }
  }

  handleResetClick = () => {
    if (!this.isSorting) {
      this.generateBars(this.state.value)
    }
  }

  // Sorting Functions

  incrementTime = (n, b = true) => {
    return b ? TIME / n : 0
  }

  bubbleSort = () => {
    const bars = this.state.bars
    const nums = bars.map(bar => bar.props.num)
    const A = nums.slice()
    const N = this.state.value
    let time = 0
    
    this.resetBars(bars, N)

    for (let i = N - 1; i > 0; i--) {
      let isSorted = true
      for (let j = 0; j < i; j++) {
        setTimeout(() => {
          this.updateBar(bars, nums[j], j, RED, N)
          this.updateBar(bars, nums[j + 1], j + 1, RED, N)
        }, time)
        time += this.incrementTime(N)

        setTimeout(() => {
          if (nums[j] > nums[j + 1]) {
            const temp = nums[j]
            nums[j] = nums[j + 1]
            nums[j + 1] = temp
            this.updateBar(bars, nums[j], j, RED, N)
            this.updateBar(bars, nums[j + 1], j + 1, RED, N)
          }
        }, time)
        time += this.incrementTime(N, A[j] > A[j + 1])

        setTimeout(() => {
          this.updateBar(bars, nums[j], j, BLUE, N)
          this.updateBar(bars, nums[j + 1], j + 1, BLUE, N)
        }, time)
        time += this.incrementTime(N)

        if (A[j] > A[j + 1]) {
          const temp = A[j]
          A[j] = A[j + 1]
          A[j + 1] = temp
          isSorted = false
        }
      }
      if (isSorted) break
    }

    setTimeout(() => this.finalizeBars(bars, N), time)
  }

  insertionSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const A = nums.slice()
    const N = bars.length
    let time = 0

    for (let i = 1; i < N; i++) {
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
          this.updateBars(bars, currNum, prevNum, j, j - 1, RED, N)
        }, time)
        time += this.incrementTime(N)

        // Switch if not sorted
        setTimeout(() => {
          if (prevNum > currNum) {
            [currNum, prevNum] = [prevNum, currNum]
            this.updateBars(bars, currNum, prevNum, j, j - 1, RED, N)
          }
        }, time)
        time += this.incrementTime(N)

        // Change color back
        setTimeout(() => this.updateBars(bars, currNum, prevNum, j, j - 1, BLUE, N), time)
        time += this.incrementTime(N)
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

  bogoSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    const permutation = (bank, A) => {
      if (bank.length === 0) {
        return [A]
      }

      const P = []

      bank.forEach(num => {
        const newBank = bank.filter(number => number !== num)
        const newA = A.slice()
        newA.push(num)
        P.push(...permutation(newBank, newA))
      })

      return P
    }

    const isSorted = A => {
      for (let i = 1; i < A.length; i++) {
        if (A[i] < A[i - 1]) return false
      }
      return true
    }

    try {
      permutation(nums, []).some(perm => {
        setTimeout(() => {
          perm.forEach((num, idx) => {
            this.updateBar(bars, num, idx, BLUE, value)
          })
        }, time)
        time += this.incrementTime(n)
        return isSorted(perm)
      })

      setTimeout(() => this.finalizeBars(), time)
    } catch (e) {
      alert(e)
      this.isSorting = false
    }
  }

  shellSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        for (let j = i - gap; j >= 0; j -= gap) {
          let currNum, nextNum

          setTimeout(() => {
            currNum = bars[j].props.num
            nextNum = bars[j + gap].props.num
            this.updateBars(bars, currNum, nextNum, j, j + gap, RED, value)
          }, time)
          time += this.incrementTime(n)

          setTimeout(() => {
            if (currNum > nextNum) {
              [currNum, nextNum] = [nextNum, currNum]
              this.updateBars(bars, currNum, nextNum, j, j + gap, RED, value)
            }
          }, time)
          time += this.incrementTime(n, nums[j] > nums[j + gap])

          setTimeout(() => this.updateBars(bars, currNum, nextNum, j, j + gap, BLUE, value), time)
          time += this.incrementTime(n)

          if (nums[j] > nums[j + gap]) {
            const temp = nums[j]
            nums[j] = nums[j + gap]
            nums[j + gap] = temp
          } else break
        }
      }
    }

    setTimeout(() => this.finalizeBars(), time)
  }

  cocktailSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    for (let start = 0, end = n - 1; start < end; start++) {
      let currNum, nextNum, temp
      let startSorted = true
      let endSorted = true

      for (let i = start; i < end; i++) {
        setTimeout(() => {
          currNum = bars[i].props.num
          nextNum = bars[i + 1].props.num
          this.updateBars(bars, currNum, nextNum, i, i + 1, RED, value)
        }, time)
        time += this.incrementTime(n)

        setTimeout(() => {
          if (currNum > nextNum) {
            [currNum, nextNum] = [nextNum, currNum]
            this.updateBars(bars, currNum, nextNum, i, i + 1, RED, value)
          }
        }, time)
        time += this.incrementTime(n, nums[i] > nums[i + 1])

        setTimeout(() => this.updateBars(bars, currNum, nextNum, i, i + 1, BLUE, value), time)
        time += this.incrementTime(n)

        if (nums[i] > nums[i + 1]) {
          temp = nums[i]
          nums[i] = nums[i + 1]
          nums[i + 1] = temp
          startSorted = false
        }
      }

      end--

      if (!startSorted) {
        for (let i = end; i > start; i--) {
          setTimeout(() => {
            currNum = bars[i].props.num
            nextNum = bars[i - 1].props.num
            this.updateBars(bars, currNum, nextNum, i, i - 1, RED, value)
          }, time)
          time += this.incrementTime(n)

          setTimeout(() => {
            if (currNum < nextNum) {
              [currNum, nextNum] = [nextNum, currNum]
              this.updateBars(bars, currNum, nextNum, i, i - 1, RED, value)
            }
          }, time)
          time += this.incrementTime(n, nums[i] < nums[i - 1])

          setTimeout(() => this.updateBars(bars, currNum, nextNum, i, i - 1, BLUE, value), time)
          time += this.incrementTime(n)

          if (nums[i] < nums[i - 1]) {
            temp = nums[i]
            nums[i] = nums[i - 1]
            nums[i - 1] = temp
            endSorted = false
          }
        }
      }

      if (startSorted || endSorted) break
    }

    setTimeout(() => this.finalizeBars(), time)
  }

  gnomeSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    let i = 0
    let barIdx = 0
    while (i < n) {
      let currNum, nextNum
      setTimeout(() => {
        currNum = bars[barIdx].props.num
        this.updateBar(bars, currNum, barIdx, RED, value)

        if (barIdx !== 0) {
          nextNum = bars[barIdx - 1].props.num
          this.updateBar(bars, nextNum, barIdx - 1, RED, value)
        }
      }, time)
      time += this.incrementTime(n)

      if (i === 0 || nums[i] >= nums[i - 1]) {
        setTimeout(() => {
          this.updateBar(bars, currNum, barIdx, BLUE, value)

          if (barIdx !== 0) {
            this.updateBar(bars, nextNum, barIdx - 1, BLUE, value)
          }

          barIdx++
        }, time)
        time += this.incrementTime(n)
        i++
      } else {
        setTimeout(() => {
          [currNum, nextNum] = [nextNum, currNum]
          this.updateBars(bars, currNum, nextNum, barIdx, barIdx - 1, RED, value)
        }, time)
        time += this.incrementTime(n)

        setTimeout(() => {
          this.updateBars(bars, currNum, nextNum, barIdx, barIdx - 1, BLUE, value)
          barIdx--
        }, time)
        time += this.incrementTime(n)

        const temp = nums[i]
        nums[i] = nums[i - 1]
        nums[i - 1] = temp
        i--
      }
    }

    setTimeout(() => this.finalizeBars(), time)
  }

  radixSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    const max = nums.reduce((m, curr) => m > curr ? m : curr)

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const count = new Array(10).fill(0)
      const output = new Array(n)

      for (let i = 0; i < n; i++) {
        const digit = Math.floor(nums[i] / exp) % 10
        count[digit]++
      }

      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1]
      }

      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(nums[i] / exp) % 10
        output[count[digit] - 1] = nums[i]
        count[digit]--
      }

      for (let i = 0; i < n; i++) {
        let currNum
        setTimeout(() => {
          currNum = bars[i].props.num
          this.updateBar(bars, currNum, i, RED, value)
        }, time)
        time += this.incrementTime(n)

        setTimeout(() => {
          currNum = output[i]
          this.updateBar(bars, currNum, i, RED, value)
        }, time)
        time += this.incrementTime(n)

        setTimeout(() => this.updateBar(bars, currNum, i, BLUE, value), time)
        time += this.incrementTime(n)

        nums[i] = output[i]
      }
    }

    setTimeout(() => this.finalizeBars(), time)
  }

  bitonicSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    const helper = (low, count, isAscending) => {
      if (count > 1) {
        const k = count / 2
        helper(low, k, true)
        helper(low + k, k, false)
        bitonicMerge(low, count, isAscending)
      }
    }

    const bitonicMerge = (low, count, isAscending) => {
      if (count > 1) {
        setTimeout(() => {
          for (let i = low; i < low + count; i++) {
            const currNum = bars[i].props.num
            this.updateBar(bars, currNum, i, RED, value)
          }
        }, time)
        time += this.incrementTime(n)

        const k = count / 2
        for (let i = low; i < low + k; i++) {
          let currNum, nextNum
          setTimeout(() => {
            currNum = bars[i].props.num
            nextNum = bars[i + k].props.num
            this.updateBars(bars, currNum, nextNum, i, i + k, LIGHT_BLUE, value)
          }, time)
          time += this.incrementTime(n)

          setTimeout(() => {
            if (currNum > nextNum === isAscending) {
              [currNum, nextNum] = [nextNum, currNum]
              this.updateBars(bars, currNum, nextNum, i, i + k, LIGHT_BLUE, value)
            }
          }, time)
          time += this.incrementTime(n, nums[i] > nums[i + k] === isAscending)

          setTimeout(() => this.updateBars(bars, currNum, nextNum, i, i + k, RED, value), time)
          time += this.incrementTime(n)

          if (nums[i] > nums[i + k] === isAscending) {
            const temp = nums[i]
            nums[i] = nums[i + k]
            nums[i + k] = temp
          }
        }

        setTimeout(() => {
          for (let i = low; i < low + count; i++) {
            const currNum = bars[i].props.num
            this.updateBar(bars, currNum, i, BLUE, value)
          }
        }, time)
        time += this.incrementTime(n)

        bitonicMerge(low, k, isAscending)
        bitonicMerge(low + k, k, isAscending)
      }
    }

    const isLoggable = num => {
      while (num > 1) {
        if (num % 2 === 0) {
          num >>= 1
        } else {
          return false
        }
      }
      return true
    }

    if (isLoggable(value)) {
      helper(0, n, true)
      setTimeout(() => this.finalizeBars(), time)
    } else {
      alert('Number of elements must be a power of 2!')
      this.isSorting = false
    }
  }

  heapSort = () => {
    const bars = this.state.bars.slice()
    const nums = bars.map(bar => bar.props.num)
    const n = bars.length
    const value = this.state.value
    let time = 0

    const heapify = (end, i) => {
      let max = i
      let l = 2 * i + 1
      let r = l + 1
      let currBar, lBar, rBar

      setTimeout(() => {
        currBar = bars[i].props.num
        this.updateBar(bars, currBar, i, PURPLE, value)
        if (l < end) {
          lBar = bars[l].props.num
          this.updateBar(bars, lBar, l, RED, value)
        }
        if (r < end) {
          rBar = bars[r].props.num
          this.updateBar(bars, rBar, r, RED, value)
        }
      }, time)
      time += this.incrementTime(n)

      if (l < end && nums[l] > nums[max]) {
        max = l
      }
      if (r < end && nums[r] > nums[max]) {
        max = r
      }

      setTimeout(() => {
        if (max !== i) {
          let innerTime = this.incrementTime(n)
          let maxBar = bars[max].props.num
          this.updateBars(bars, currBar, maxBar, i, max, LIGHT_BLUE, value)

          setTimeout(() => {
            [currBar, maxBar] = [maxBar, currBar]
            this.updateBars(bars, currBar, maxBar, i, max, LIGHT_BLUE, value)
          }, innerTime)
          innerTime += this.incrementTime(n)

          setTimeout(() => {
            this.updateBar(bars, currBar, i, RED, value)
            this.updateBar(bars, maxBar, max, PURPLE, value)
          }, innerTime)
        }
      }, time)
      time += this.incrementTime(n, max !== i) * 3

      setTimeout(() => {
        currBar = bars[i].props.num
        this.updateBar(bars, currBar, i, BLUE, value)
        if (l < end) {
          lBar = bars[l].props.num
          this.updateBar(bars, lBar, l, BLUE, value)
        }
        if (r < end) {
          rBar = bars[r].props.num
          this.updateBar(bars, rBar, r, BLUE, value)
        }
      }, time)
      time += this.incrementTime(n)

      if (max !== i) {
        const temp = nums[i]
        nums[i] = nums[max]
        nums[max] = temp
        heapify(end, max)
      }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i)
    }

    for (let i = n - 1; i > 0; i--) {
      let firstBar, lastBar
      setTimeout(() => {
        firstBar = bars[0].props.num
        lastBar = bars[i].props.num
        this.updateBars(bars, firstBar, lastBar, 0, i, RED, value)
      }, time)
      time += this.incrementTime(n)

      setTimeout(() => {
        [firstBar, lastBar] = [lastBar, firstBar]
        this.updateBars(bars, firstBar, lastBar, 0, i, RED, value)
      }, time)
      time += this.incrementTime(n)

      setTimeout(() => {
        this.updateBars(bars, firstBar, lastBar, 0, i, BLUE, value)
      }, time)
      time += this.incrementTime(n)

      const temp = nums[0]
      nums[0] = nums[i]
      nums[i] = temp
      heapify(i, 0)
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
        <TextContainer value={this.state.value} handleSampleChange={this.handleSampleChange} handleSortClick={this.handleSortClick} handleResetClick={this.handleResetClick} />
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

