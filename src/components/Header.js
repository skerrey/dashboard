import React from 'react'
import './Header.scss'
import logo from "../images/logo.svg"

function Header() {
  return (
    <div className="header">
      <img src={logo} alt="logo" className="logo" />
      Header
    </div>
  )
}

export default Header