import React, { Component } from 'react'
import '../styles.css'

export default function Bar(props) {
  const style = {
    width: `${props.width}vw`,
    height: `${props.height}vh`,
    left: `${props.left}vw`
  }

  return (
    <div className="bar" style={style}>{props.num}</div>
  )
}