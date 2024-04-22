import React from "react";
import { Link } from "react-router-dom";
import { GiBlackHoleBolas } from "react-icons/gi";
const Navbar = () => {
  return (
    <div className="navbar bg-base-300 rounded-lg shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <GiBlackHoleBolas className="text-2xl" /> Pothole Detection System
        </a>{" "}
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/potholedata">Data Centre</Link>
          </li>
          <li>
            <Link to="/proofofwork">Proof of work</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
