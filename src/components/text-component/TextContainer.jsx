import React from 'react'
import Dropdown from './Dropdown'
import SampleTextBox from './SampleTextBox'
import SortButton from './SortButton'

export default function TextContainer(props) {
  return (
    <div className="text-container">
      <Dropdown handleAlgorithmChange={props.handleAlgorithmChange} />
      <SampleTextBox defaultValue={props.defaultValue} handleSampleChange={props.handleSampleChange} />
      <SortButton handleClick={props.handleClick} />
    </div>
  )
}