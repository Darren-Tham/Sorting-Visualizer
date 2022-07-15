import React, { Component } from 'react'
import Bar from './Bar'
import TextContainer from './TextContainer'

const DEFAULT_VALUE = 10
const BLUE = '#c7e4ff'
const LIGHT_BLUE = '#bbfaf8'
const RED = '#ff9494'
const GREEN = '#b3ffc3'
const PURPLE = '#e3c7ff'
const DURATION = 500

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

  finalizeBars = async (bars, N) => {
    for (let i = 0; i < N; i++) {
      this.updateBar(bars, bars[i].props.num, i, GREEN, N)
      await timeout(N)
    }

    this.isSorting = false
  }

  // Handle Functions

  handleSampleChange = evt => {
    const value = evt.target.value
    this.setState({ value })
    if (!this.isSorting) {
      this.generateBars(value)
    }
  }

  handleSortClick = async () => {
    if (this.isSorting || this.state.bars.length !== parseInt(this.state.value)) return
    this.isSorting = true

    const bars = this.state.bars.slice()
    const A = bars.map(bar => bar.props.num)
    const N = this.state.value
    let isSuccessful = true

    this.resetBars(bars, N)

    const dropdown = document.getElementById('dropdown')
    switch (dropdown.value) {
      case 'Bitonic Sort': {
        const failed = await this.bitonicSort(bars, A, N)
        if (failed) {
          isSuccessful = false
        }
        break
      } case 'Bogo Sort': {
        const failed = await this.bogoSort(bars, A, N)
        if (failed) {
          isSuccessful = false
        }
        break
      } case 'Bubble Sort':
        await this.bubbleSort(bars, A, N)
        break
      case 'Cocktail Sort':
        await this.cocktailSort(bars, A, N)
        break
      case 'Double Selection Sort':
        await this.doubleSelectionSort(bars, A, N)
        break
      case 'Gnome Sort':
        await this.gnomeSort(bars, A, N)
        break
      case 'Heap Sort':
        await this.heapSort(bars, A, N)
        break
      case 'Insertion Sort':
        await this.insertionSort(bars, A, N)
        break
      case 'Merge Sort':
        await this.mergeSort(bars, A, N)
        break
      case 'Odd-Even Sort':
        await this.oddEvenSort(bars, A, N)
        break
      case 'Quick Sort':
        await this.quickSort(bars, A, N)
        break
      case 'Radix Sort':
        await this.radixSort(bars, A, N)
        break
      case 'Selection Sort':
        await this.selectionSort(bars, A, N)
        break
      case 'Shell Sort':
        await this.shellSort(bars, A, N)
        break
      default:
        alert("Please choose a sorting algorithm!")
        isSuccessful = false
        this.isSorting = false
    }

    if (isSuccessful) {
      await this.finalizeBars(bars, N)
    }
  }

  handleResetClick = () => {
    if (!this.isSorting) {
      this.generateBars(this.state.value)
    }
  }

  // Sorting Functions

  bitonicSort = async (bars, A, N) => {
    const helper = async (low, count, isAscending) => {
      if (count <= 1) return

      const k = count / 2
      await helper(low, k, true)
      await helper(low + k, k, false)
      await bitonicMerge(low, count, isAscending)
    }

    const bitonicMerge = async (low, count, isAscending) => {
      if (count <= 1) return

      for (let i = low; i < low + count; i++) {
        this.updateBar(bars, A[i], i, RED, N)
      }
      await timeout(N)

      const k = count / 2
      for (let i = low; i < low + k; i++) {
        this.updateBar(bars, A[i], i, LIGHT_BLUE, N)
        this.updateBar(bars, A[i + k], i + k, LIGHT_BLUE, N)
        await timeout(N)

        if ((A[i] > A[i + k]) === isAscending) {
          const temp = A[i]
          A[i] = A[i + k]
          A[i + k] = temp

          this.updateBar(bars, A[i], i, LIGHT_BLUE, N)
          this.updateBar(bars, A[i + k], i + k, LIGHT_BLUE, N)
          await timeout(N)
        }

        this.updateBar(bars, A[i], i, RED, N)
        this.updateBar(bars, A[i + k], i + k, RED, N)
        await timeout(N)
      }

      for (let i = low; i < low + count; i++) {
        this.updateBar(bars, A[i], i, BLUE, N)
      }
      await timeout(N)

      await bitonicMerge(low, k, isAscending)
      await bitonicMerge(low + k, k, isAscending)
    }

    const isLoggable = n => {
      while (n > 1) {
        if (n % 2 === 0) {
          n >>= 1
        } else {
          return false
        }
      }
      return true
    }

    if (isLoggable(N)) {
      await helper(0, N, true)
      return false
    } else {
      alert('Number of elements must be a power of 2!')
      this.isSorting = false
      return true
    }
  }

  bogoSort = async (bars, A, N) => {
    const permutation = (bank, arr) => {
      if (bank.length === 0) return [arr]

      const perms = []

      bank.forEach((num, i) => {
        const newBank = bank.slice(0, i).concat(bank.slice(i + 1))
        const newArr = arr.slice()
        newArr.push(num)
        perms.push(...permutation(newBank, newArr))
      })

      return perms
    }

    const isSorted = arr => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
          return false
        }
      }
      return true
    }
    try {
      const perms = permutation(A, [])

      for (let i = 0; i < perms.length; i++) {
        for (let j = 0; j < N; j++) {
          this.updateBar(bars, perms[i][j], j, BLUE, N)
        }
        await timeout(N)
        if (isSorted(perms[i])) break
      }

      return false
    } catch (err) {
      alert(err)
      this.isSorting = false
      return true
    }
  }

  bubbleSort = async (bars, A, N) => {
    for (let i = N - 1; i > 0; i--) {
      let isSorted = true
      for (let j = 0; j < i; j++) {
        this.updateBar(bars, A[j], j, RED, N)
        this.updateBar(bars, A[j + 1], j + 1, RED, N)
        await timeout(N)

        if (A[j] > A[j + 1]) {
          const temp = A[j]
          A[j] = A[j + 1]
          A[j + 1] = temp

          this.updateBar(bars, A[j], j, RED, N)
          this.updateBar(bars, A[j + 1], j + 1, RED, N)

          isSorted = false
          await timeout(N)
        }

        this.updateBar(bars, A[j], j, BLUE, N)
        this.updateBar(bars, A[j + 1], j + 1, BLUE, N)
        await timeout(N)
      }
      if (isSorted) break
    }
  }

  cocktailSort = async (bars, A, N) => {
    for (let start = 0, end = N - 1; start < end; start++) {
      let startSorted = true
      let endSorted = true

      for (let i = start; i < end; i++) {
        this.updateBar(bars, A[i], i, RED, N)
        this.updateBar(bars, A[i + 1], i + 1, RED, N)
        await timeout(N)

        if (A[i] > A[i + 1]) {
          const temp = A[i]
          A[i] = A[i + 1]
          A[i + 1] = temp

          this.updateBar(bars, A[i], i, RED, N)
          this.updateBar(bars, A[i + 1], i + 1, RED, N)

          startSorted = false
          await timeout(N)
        }

        this.updateBar(bars, A[i], i, BLUE, N)
        this.updateBar(bars, A[i + 1], i + 1, BLUE, N)
        await timeout(N)
      }

      end--

      if (!startSorted) {
        for (let i = end; i > start; i--) {
          this.updateBar(bars, A[i], i, RED, N)
          this.updateBar(bars, A[i - 1], i - 1, RED, N)
          await timeout(N)

          if (A[i] < A[i - 1]) {
            const temp = A[i]
            A[i] = A[i - 1]
            A[i - 1] = temp

            this.updateBar(bars, A[i], i, RED, N)
            this.updateBar(bars, A[i - 1], i - 1, RED, N)

            endSorted = false
            await timeout(N)
          }

          this.updateBar(bars, A[i], i, BLUE, N)
          this.updateBar(bars, A[i - 1], i - 1, BLUE, N)
          await timeout(N)
        }
      }

      if (startSorted || endSorted) break
    }
  }

  doubleSelectionSort = async (bars, A, N) => {
    for (let start = 0, end = N; start < end; start++) {
      let min = start

      this.updateBar(bars, A[min], min, PURPLE, N)
      await timeout(N)

      for (let i = start + 1; i < end; i++) {
        this.updateBar(bars, A[i], i, RED, N)
        await timeout(N)

        if (A[i] < A[min]) {
          if (min === start) {
            this.updateBar(bars, A[min], min, LIGHT_BLUE, N)
          } else {
            this.updateBar(bars, A[min], min, BLUE, N)
          }
          this.updateBar(bars, A[i], i, PURPLE, N)
          min = i
        } else {
          this.updateBar(bars, A[i], i, BLUE, N)
        }
        await timeout(N)
      }

      if (start === min) {
        this.updateBar(bars, A[start], start, BLUE, N)
      } else {
        const temp = A[start]
        A[start] = A[min]
        A[min] = temp

        this.updateBar(bars, A[start], start, PURPLE, N)
        this.updateBar(bars, A[min], min, LIGHT_BLUE, N)
        await timeout(N)

        this.updateBar(bars, A[start], start, BLUE, N)
        this.updateBar(bars, A[min], min, BLUE, N)
      }
      await timeout(N)

      end--

      let max = end

      this.updateBar(bars, A[max], max, PURPLE, N)
      await timeout(N)

      for (let i = end - 1; i > start; i--) {
        this.updateBar(bars, A[i], i, RED, N)
        await timeout(N)

        if (A[i] > A[max]) {
          if (max === end) {
            this.updateBar(bars, A[max], max, LIGHT_BLUE, N)
          } else {
            this.updateBar(bars, A[max], max, BLUE, N)
          }
          this.updateBar(bars, A[i], i, PURPLE, N)
          max = i
        } else {
          this.updateBar(bars, A[i], i, BLUE, N)
        }
        await timeout(N)
      }

      if (end === max) {
        this.updateBar(bars, A[end], end, BLUE, N)
      } else {
        const temp = A[end]
        A[end] = A[max]
        A[max] = temp

        this.updateBar(bars, A[end], end, PURPLE, N)
        this.updateBar(bars, A[max], max, LIGHT_BLUE, N)
        await timeout(N)

        this.updateBar(bars, A[end], end, BLUE, N)
        this.updateBar(bars, A[max], max, BLUE, N)
      }
      await timeout(N)
    }
  }

  gnomeSort = async (bars, A, N) => {
    let i = 0
    while (i < N) {
      this.updateBar(bars, A[i], i, RED, N)
      if (i !== 0) {
        this.updateBar(bars, A[i - 1], i - 1, RED, N)
      }
      await timeout(N)

      if (i === 0 || A[i] >= A[i - 1]) {
        this.updateBar(bars, A[i], i, BLUE, N)
        if (i !== 0) {
          this.updateBar(bars, A[i - 1], i - 1, BLUE, N)
        }
        await timeout(N)

        i++
      } else {
        const temp = A[i]
        A[i] = A[i - 1]
        A[i - 1] = temp

        this.updateBar(bars, A[i], i, RED, N)
        this.updateBar(bars, A[i - 1], i - 1, RED, N)
        await timeout(N)

        this.updateBar(bars, A[i], i, BLUE, N)
        this.updateBar(bars, A[i - 1], i - 1, BLUE, N)
        await timeout(N)

        i--
      }
    }
  }

  heapSort = async (bars, A, N) => {
    const heapify = async (n, i) => {
      let max = i
      const l = 2 * i + 1
      const r = l + 1
      let iEqualsMax = true

      this.updateBar(bars, A[i], i, PURPLE, N)

      if (l < n) {
        this.updateBar(bars, A[l], l, RED, N)

        if (A[l] > A[max]) {
          max = l
        }
      }

      if (r < n) {
        this.updateBar(bars, A[r], r, RED, N)

        if (A[r] > A[max]) {
          max = r
        }
      }

      await timeout(N)

      if (max !== i) {
        iEqualsMax = false

        this.updateBar(bars, A[i], i, LIGHT_BLUE, N)
        this.updateBar(bars, A[max], max, LIGHT_BLUE, N)
        await timeout(N)

        const temp = A[max]
        A[max] = A[i]
        A[i] = temp

        this.updateBar(bars, A[i], i, LIGHT_BLUE, N)
        this.updateBar(bars, A[max], max, LIGHT_BLUE, N)
        await timeout(N)

        this.updateBar(bars, A[i], i,
          RED, N)
        this.updateBar(bars, A[max], max, PURPLE, N)
        await timeout(N)
      }

      this.updateBar(bars, A[i], i, BLUE, N)

      if (l < n) {
        this.updateBar(bars, A[l], l, BLUE, N)
      }

      if (r < n) {
        this.updateBar(bars, A[r], r, BLUE, N)
      }

      await timeout(N)

      if (!iEqualsMax) {
        await heapify(n, max)
      }
    }

    for (let i = Math.floor(N / 2) - 1; i >= 0; i--) {
      await heapify(N, i)
    }

    for (let i = N - 1; i > 0; i--) {
      this.updateBar(bars, A[0], 0, RED, N)
      this.updateBar(bars, A[i], i, RED, N)
      await timeout(N)

      const temp = A[0]
      A[0] = A[i]
      A[i] = temp

      this.updateBar(bars, A[0], 0, RED, N)
      this.updateBar(bars, A[i], i, RED, N)
      await timeout(N)

      this.updateBar(bars, A[0], 0, BLUE, N)
      this.updateBar(bars, A[i], i, BLUE, N)
      await timeout(N)

      await heapify(i, 0)
    }
  }

  insertionSort = async (bars, A, N) => {
    for (let i = 1; i < N; i++) {
      for (let j = i; j > 0; j--) {
        let isSorted = true

        this.updateBar(bars, A[j], j, RED, N)
        this.updateBar(bars, A[j - 1], j - 1, RED, N)
        await timeout(N)

        if (A[j - 1] > A[j]) {
          const temp = A[j - 1]
          A[j - 1] = A[j]
          A[j] = temp

          this.updateBar(bars, A[j], j, RED, N)
          this.updateBar(bars, A[j - 1], j - 1, RED, N)

          isSorted = false
          await timeout(N)
        }

        this.updateBar(bars, A[j], j, BLUE, N)
        this.updateBar(bars, A[j - 1], j - 1, BLUE, N)
        await timeout(N)

        if (isSorted) break
      }
    }
  }

  mergeSort = async (bars, A, N) => {
    const I = A.map((_, i) => i)

    const helper = async (arr, indices) => {
      if (arr.length === 1) return arr

      const m = Math.floor(arr.length / 2)
      const l = await helper(arr.slice(0, m), indices.slice(0, m))
      const r = await helper(arr.slice(m), indices.slice(m))
      return merge(l, r, indices)
    }

    const merge = async (l, r, indices) => {
      const unsortedArr = l.concat(r)

      for (let i = 0; i < indices.length; i++) {
        this.updateBar(bars, unsortedArr[i], indices[i], RED, N)
      }
      await timeout(N)

      const arr = []

      while (l.length !== 0 && r.length !== 0) {
        if (l[0] > r[0]) {
          arr.push(r.shift())
        } else {
          arr.push(l.shift())
        }
      }

      while (l.length !== 0) {
        arr.push(l.shift())
      }

      while (r.length !== 0) {
        arr.push(r.shift())
      }

      for (let i = 0; i < indices.length; i++) {
        if (A[indices[i]] !== arr[i]) {
          this.updateBar(bars, arr[i], indices[i], RED, N)
          A[indices[i]] = arr[i]
          await timeout(N)
        }

        this.updateBar(bars, arr[i], indices[i], BLUE, N)
        await timeout(N)
      }

      return arr
    }

    await helper(A, I)
  }

  oddEvenSort = async (bars, A, N) => {
    let oddSorted = false
    let evenSorted = false

    while (!oddSorted && !evenSorted) {
      oddSorted = true
      evenSorted = true

      for (let i = 1; i < N - 1; i += 2) {
        this.updateBar(bars, A[i], i, RED, N)
        this.updateBar(bars, A[i + 1], i + 1, RED, N)
        await timeout(N)

        if (A[i] > A[i + 1]) {
          const temp = A[i]
          A[i] = A[i + 1]
          A[i + 1] = temp

          this.updateBar(bars, A[i], i, RED, N)
          this.updateBar(bars, A[i + 1], i + 1, RED, N)

          oddSorted = false
          await timeout(N)
        }

        this.updateBar(bars, A[i], i, BLUE, N)
        this.updateBar(bars, A[i + 1], i + 1, BLUE, N)
        await timeout(N)
      }

      if (!oddSorted) {
        for (let i = 0; i < N - 1; i += 2) {
          this.updateBar(bars, A[i], i, RED, N)
          this.updateBar(bars, A[i + 1], i + 1, RED, N)
          await timeout(N)

          if (A[i] > A[i + 1]) {
            const temp = A[i]
            A[i] = A[i + 1]
            A[i + 1] = temp

            this.updateBar(bars, A[i], i, RED, N)
            this.updateBar(bars, A[i + 1], i + 1, RED, N)

            evenSorted = false
            await timeout(N)
          }

          this.updateBar(bars, A[i], i, BLUE, N)
          this.updateBar(bars, A[i + 1], i + 1, BLUE, N)
          await timeout(N)
        }
      }
    }
  }

  quickSort = async (bars, A, N) => {
    const helper = async (l, h) => {
      if (l < h) {
        const pivot = await partition(l, h)
        await helper(l, pivot)
        await helper(pivot + 1, h)
      }
    }

    const partition = async (l, h) => {
      const pivot = A[l]
      let i = l
      let j = h

      this.updateBar(bars, pivot, l, PURPLE, N)

      for (let idx = l + 1; idx < h; idx++) {
        this.updateBar(bars, A[idx], idx, RED, N)
      }

      await timeout(N)

      while (i < j) {
        do {
          i++

          if (i !== h) {
            this.updateBar(bars, A[i], i, LIGHT_BLUE, N)
            await timeout(N)

            if (A[i] <= pivot) {
              this.updateBar(bars, A[i], i, RED, N)
              await timeout(N)
            }
          }
        } while (i !== h && A[i] <= pivot)

        do {
          j--

          if (j !== l && j !== i) {
            this.updateBar(bars, A[j], j, LIGHT_BLUE, N)
            await timeout(N)

            if (A[j] > pivot) {
              this.updateBar(bars, A[j], j, RED, N)
              await timeout(N)
            }
          }
        } while (j !== l && A[j] > pivot)

        if (i < j) {
          const temp = A[i]
          A[i] = A[j]
          A[j] = temp

          this.updateBar(bars, A[i], i, LIGHT_BLUE, N)
          this.updateBar(bars, A[j], j, LIGHT_BLUE, N)
          await timeout(N)
        }

        if (i !== h) {
          this.updateBar(bars, A[i], i, RED, N)
        }

        if (j !== l) {
          this.updateBar(bars, A[j], j, RED, N)
        }

        if (i !== h || j !== l) {
          await timeout(N)
        }
      }

      if (j !== l) {
        this.updateBar(bars, A[j], j, LIGHT_BLUE, N)
        await timeout(N)

        const temp = A[l]
        A[l] = A[j]
        A[j] = temp

        this.updateBar(bars, A[j], j, PURPLE, N)
        this.updateBar(bars, A[l], l, LIGHT_BLUE, N)
        await timeout(N)
      }

      for (let idx = l; idx < h; idx++) {
        this.updateBar(bars, A[idx], idx, BLUE, N)
      }
      await timeout(N)

      return j
    }

    await helper(0, N)
  }

  radixSort = async (bars, A, N) => {
    const max = A.reduce((curr, prev) => curr > prev ? curr : prev)

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const count = new Array(10).fill(0)
      const output = new Array(N)

      for (let i = 0; i < N; i++) {
        const digit = Math.floor(A[i] / exp) % 10
        count[digit]++
      }

      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1]
      }

      for (let i = N - 1; i >= 0; i--) {
        const digit = Math.floor(A[i] / exp) % 10
        output[count[digit] - 1] = A[i]
        count[digit]--
      }

      for (let i = 0; i < N; i++) {
        this.updateBar(bars, A[i], i, RED, N)
        await timeout(N)

        A[i] = output[i]
        this.updateBar(bars, A[i], i, RED, N)
        await timeout(N)

        this.updateBar(bars, A[i], i, BLUE, N)
      }
    }
  }

  selectionSort = async (bars, A, N) => {
    for (let i = 0; i < N - 1; i++) {
      let min = i

      this.updateBar(bars, A[i], i, PURPLE, N)
      await timeout(N)

      for (let j = i + 1; j < N; j++) {
        this.updateBar(bars, A[j], j, RED, N)
        await timeout(N)

        if (A[j] < A[min]) {
          if (i === min) {
            this.updateBar(bars, A[i], i, LIGHT_BLUE, N)
          } else {
            this.updateBar(bars, A[min], min, BLUE, N)
          }
          this.updateBar(bars, A[j], j, PURPLE, N)
          min = j
        } else {
          this.updateBar(bars, A[j], j, BLUE, N)
        }
        await timeout(N)
      }

      if (i === min) {
        this.updateBar(bars, A[i], i, BLUE, N)
      } else {
        const temp = A[i]
        A[i] = A[min]
        A[min] = temp

        this.updateBar(bars, A[i], i, PURPLE, N)
        this.updateBar(bars, A[min], min, LIGHT_BLUE, N)
        await timeout(N)

        this.updateBar(bars, A[i], i, BLUE, N)
        this.updateBar(bars, A[min], min, BLUE, N)
      }
      await timeout(N)
    }
  }

  shellSort = async (bars, A, N) => {
    for (let gap = Math.floor(N / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < N; i++) {
        for (let j = i - gap; j >= 0; j -= gap) {
          let isSorted = true

          this.updateBar(bars, A[j], j, RED, N)
          this.updateBar(bars, A[j + gap], j + gap, RED, N)
          await timeout(N)

          if (A[j] > A[j + gap]) {
            const temp = A[j]
            A[j] = A[j + gap]
            A[j + gap] = temp

            this.updateBar(bars, A[j], j, RED, N)
            this.updateBar(bars, A[j + gap], j + gap, RED, N)

            isSorted = false
            await timeout(N)
          }

          this.updateBar(bars, A[j], j, BLUE, N)
          this.updateBar(bars, A[j + gap], j + gap, BLUE, N)
          await timeout(N)

          if (isSorted) break
        }
      }
    }
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

const timeout = N => new Promise(res => setTimeout(res, DURATION / N))

