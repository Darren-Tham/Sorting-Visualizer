import React from 'react'

export default function Dropdown(props) {
  return (
    <select onChange={props.handleAlgorithmChange}>
      <option>Choose a sorting algorithm!</option>
      <option>Bubble Sort</option>
    </select>
  )
}