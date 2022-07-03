import React from 'react'

export default function SampleTextBox(props) {
  return (
    <input type="text" min="1" defaultValue="10" onChange={props.handleChange} />
  )
}