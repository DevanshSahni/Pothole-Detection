import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="navbar bg-base-300 rounded-lg shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Pothole Detection System</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/" >Dashboard</Link></li>
          <li><Link to="/" >Data Centre</Link></li>
          <li><Link to="/" >Proof of work</Link></li>
          <li><Link to="/contact" >Contact</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar