import React from 'react'
import './Header.scss'
import logo from "../images/logo.svg"

function Header() {
  return (
    <div className="header">
      <div>
      <img src={logo} alt="logo" className="logo" />
      </div>
      <div>
        <span className="pre-address">Property address</span>
        <span className="address">123 Main St, Anytown, USA</span>
        <span className="logout">Log Out</span>
      </div>
    </div>
  )
}

export default Header