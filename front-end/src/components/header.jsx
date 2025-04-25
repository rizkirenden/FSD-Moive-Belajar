import React from 'react';
import { Link } from 'react-router-dom';

function Header({ title }) {
  return (
    <header>
      <nav className="bg-white p-2 h-12 flex justify-between items-center mx-4 mt-4 rounded-full">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4 flex-wrap sm:flex-nowrap">
          <img
            src="/assets/baverse.png"
            alt="baverse"
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-[#4a70db] text-sm sm:text-lg">{title}</h1>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-4 mr-4 text-sm flex-wrap sm:flex-nowrap">
          <li>
            <Link to="/" className="text-black">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-black">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
