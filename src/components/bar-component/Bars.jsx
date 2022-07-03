import React from 'react'
import Bar from './Bar'

export default function Bars(props) {
  const barWidth = 100 / props.arr.length
  const heightPercentage = getHeight() / 100
  return (
    <div>
      {props.arr.map((num, idx) => <Bar key={idx} width={barWidth} height={heightPercentage * num} left={barWidth * idx} num={num} />)}
    </div>
  )
}

function getHeight() {
  const body = document.querySelector('body')
  const textContainerHeight = getComputedStyle(body).getPropertyValue('--text-container-height')
  return 100 - parseInt(textContainerHeight)
}