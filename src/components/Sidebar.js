import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/" className="link" activeClassName="active">Home</NavLink>
      <NavLink to="/payments" className="link" activeClassName="active">Payments</NavLink>
      <NavLink to="/maintenance" className="link">Maintenance</NavLink>
      <NavLink to="/contact-us" className="link">Contact Us</NavLink>
      <NavLink to="/settings" className="link">Settings</NavLink>
    </div>
  )
}

export default Sidebar