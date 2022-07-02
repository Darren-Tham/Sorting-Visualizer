import React, { Component } from 'react'

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
      const randomNum = Math.floor(Math.random() * 100)
      arr.push(randomNum)
    }
    this.setState({ arr })
  }

  render() {
    return (
      <>
        {this.state.arr.map(num => <div key={num}>{num}</div>)}
      </>
    )
  }
}

