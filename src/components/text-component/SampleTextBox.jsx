import React from 'react'

export default function SampleTextBox(props) {
  return (
    <input type="text" min="1" defaultValue={props.defaultValue} onChange={props.handleSampleChange} />
  )
}