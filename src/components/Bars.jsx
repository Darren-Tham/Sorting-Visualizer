import React, { Component } from 'react'
import Bar from './Bar'

export default class Bars extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arr: []
    }
  }

  componentDidMount() {
    this.generateArr()
  }

  generateArr() {
    const arr = []
    for (let i = 0; i < 10; i++) {
      const randomNum = randomBetween(5, 100)
      arr.push(randomNum)
    }
    this.setState({ arr })
  }

  render() {
    const width = 100 / this.state.arr.length
    return (
      <>
        {this.state.arr.map((num, idx) => <Bar key={idx} width={width} height={num} left={width * idx} num={num} />)}
      </>
    )
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}