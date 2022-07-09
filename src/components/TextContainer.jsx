import React from 'react'

export default function TextContainer(props) {
  return (
    <div className="text-container">
      <select id="dropdown">
        <option>Choose a sorting algorithm!</option>
        <option>Bubble Sort</option>
        <option>Insertion Sort</option>
        <option>Merge Sort</option>
        <option>Selection Sort</option>
      </select>
      <input type="text" min="1" defaultValue={props.defaultValue} onChange={props.handleSampleChange} />
      <button onClick={props.handleResetClick}>Reset</button>
      <button onClick={props.handleSortClick}>Sort</button>
    </div>
  )
}