import React from 'react'

export default function TextContainer(props) {
  return (
    <div className="text-container">
      <select id="dropdown">
        <option>Choose a sorting algorithm!</option>
        <option>Bitonic Sort</option>
        <option>Bogo Sort</option>
        <option>Bubble Sort</option>
        <option>Cocktail Sort</option>
        <option>Double Selection Sort</option>
        <option>Gnome Sort</option>
        <option>Heap Sort</option>
        <option>Insertion Sort</option>
        <option>Max Sort</option>
        <option>Merge Sort</option>
        <option>Odd-Even Sort</option>
        <option>Quick Sort</option>
        <option>Radix Sort</option>
        <option>Selection Sort</option>
        <option>Shell Sort</option>
      </select>
      <input type="text" min="1" value={props.value} onChange={props.handleSampleChange} />
      <button onClick={props.handleResetClick}>Reset</button>
      <button onClick={props.handleSortClick}>Sort</button>
    </div>
  )
}