import React from 'react'
import Bar from './Bar'

export default function Bars(props) {
  return (
    <div>
      {props.arr.map(bar => bar)}
    </div>
  )
}