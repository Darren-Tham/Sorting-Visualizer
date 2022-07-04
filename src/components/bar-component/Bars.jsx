import React from 'react'
import Bar from './Bar'

export default function Bars(props) {
  const spacing = getSpacing()
  const barWidth = getBarWidth(props.arr.length, spacing)
  const heightPercentage = getMaxBarHeight() / 100

  return (
    <div>
      {props.arr.map((num, idx) => <Bar key={idx} width={barWidth} height={heightPercentage * num} left={(barWidth + spacing) * idx} num={num} />)}
    </div>
  )
}

function getBarWidth(length, spacing) {
  return (100 - spacing * (length  - 1)) / length
}

function getSpacing() {
  const spacing = getComputedStyle(document.body).getPropertyValue('--spacing')
  return parseFloat(spacing)
}

function getMaxBarHeight() {
  const textContainerHeight = getComputedStyle(document.body).getPropertyValue('--text-container-height')
  return 100 - parseInt(textContainerHeight)
}