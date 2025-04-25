import React from 'react';
import { Link } from 'react-router-dom';
function Header({ title }) {
  return (
    <header>
      <nav className="bg-white p-2 h-12 flex justify-between items-center ml-4 mr-4 mt-4 rounded-full">
        <div className="flex items-center space-x-4">
          <img
            src="/assets/baverse.png"
            alt="baverse"
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-[#4a70db] text-sm">{title}</h1>
        </div>
        <ul className="flex space-x-4 mr-4">
          <li>
            <Link to="/" className="text-black text-sm">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-black text-sm">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
