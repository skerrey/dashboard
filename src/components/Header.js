import React from 'react'
import './Header.scss'
import logo from "../images/logo3.svg"

function Header() {
  return (
    <div className="header">
      <img src={logo} alt="logo" className="logo" />
      Header
    </div>
  )
}

export default Header