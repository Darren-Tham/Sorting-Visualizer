import React from 'react'
import Dropdown from './Dropdown'
import SampleTextBox from './SampleTextBox'
import SortButton from './SortButton'
import '../../styles.css'

export default function TextContainer(props) {
  return (
    <div className="text-container">
      <Dropdown />
      <SampleTextBox />
      <SortButton />
    </div>
  )
}