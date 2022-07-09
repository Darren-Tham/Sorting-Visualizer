import React from 'react'

export default function SortButton(props) {
  return (
    <button id="sort" onClick={props.handleSortClick}>Sort</button>
  )
}