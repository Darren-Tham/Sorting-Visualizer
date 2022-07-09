import React from 'react'
import Dropdown from './Dropdown'
import SampleTextBox from './SampleTextBox'
import ResetButton from './ResetButton'
import SortButton from './SortButton'

export default function TextContainer(props) {
  return (
    <div className="text-container">
      <Dropdown />
      <SampleTextBox defaultValue={props.defaultValue} handleSampleChange={props.handleSampleChange} />
      <ResetButton handleResetClick={props.handleResetClick} />
      <SortButton handleSortClick={props.handleSortClick} />
    </div>
  )
}