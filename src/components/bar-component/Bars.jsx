import React from 'react'
import Bar from './Bar'

export default function Bars(props) {
  const body = document.body
  const spacing = getSpacing(body)
  const barWidth = getBarWidth(props.arr.length, spacing)
  const heightPercentage = getMaxBarHeight(body) / 100

  return (
    <div>
      {props.arr.map((num, idx) => <Bar key={idx} width={barWidth} height={heightPercentage * num} left={(barWidth + spacing) * idx} num={num} />)}
    </div>
  )
}

function getBarWidth(length, spacing) {
  return (100 - spacing * (length  - 1)) / length
}

function getSpacing(body) {
  const spacing = getComputedStyle(body).getPropertyValue('--spacing')
  return parseFloat(spacing)
}

function getMaxBarHeight(body) {
  const textContainerHeight = getComputedStyle(body).getPropertyValue('--text-container-height')
  return 100 - parseInt(textContainerHeight)
}