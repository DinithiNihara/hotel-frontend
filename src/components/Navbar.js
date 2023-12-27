import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <header>
      <div className="flex flex-row text-xl gap-3">
        <Link to="/">
          <h1>Dashboard</h1>
        </Link>
        <Link to="/guests">
          <h1>Guests</h1>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
