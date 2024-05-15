import React from 'react'
import NotFound from '../assets/404.png'
export default function NFound() {
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <img src={NotFound} alt="Error 404" width="60%"/>
    </div>
  )
}
