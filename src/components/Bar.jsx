import React from 'react'
import '../styles.css'

export default function Bar(props) {
  const style = {
    width: `${props.width}vw`,
    height: `${props.height}vh`,
    left: `${props.left}vw`,
    backgroundColor: props.color
  }

  return (
    <div className="bar" style={style}></div>
  )
}