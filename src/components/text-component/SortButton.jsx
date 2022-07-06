import React from 'react'

export default function SortButton(props) {
  return (
    <button className='sort-button' onClick={props.handleClick}>Sort!</button>
  )
}