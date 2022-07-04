import React from 'react'
import Dropdown from './Dropdown'
import SampleTextBox from './SampleTextBox'
import SortButton from './SortButton'

export default function TextContainer(props) {
  return (
    <div className="text-container">
      <Dropdown />
      <SampleTextBox handleChange={props.handleChange} defaultValue={props.defaultValue} />
      <SortButton />
    </div>
  )
}