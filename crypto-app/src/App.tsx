import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './Home';
import Trades from './Trades';
import CryptoDetails from './CryptoDetails';
import Favorites from './Favorites';

export default function App() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header with improved navigation */}
      <header className="navbar bg-base-200 shadow-lg">
        <div className="navbar-start">
          <div className="text-xl font-bold text-primary px-4">
            CryptoTracker
          </div>
        </div>
        <div className="navbar-center">
          <nav className="flex gap-2">
            <NavLink 
              to="/" 
              end 
              className={({ isActive }) =>
                `btn btn-ghost ${isActive ? 'btn-active' : ''}`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </NavLink>
            <NavLink 
              to="/trades" 
              className={({ isActive }) =>
                `btn btn-ghost ${isActive ? 'btn-active' : ''}`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Live Trades
            </NavLink>
            <NavLink 
              to="/favorites" 
              className={({ isActive }) =>
                `btn btn-ghost ${isActive ? 'btn-active' : ''}`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Favorites
            </NavLink>
          </nav>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://api.dicebear.com/6.x/identicon/svg?seed=crypto" alt="avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Settings</a></li>
              <li><a>Profile</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main content with container */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {location.pathname === '/' ? 'Crypto Dashboard' : 
             location.pathname === '/trades' ? 'Live Trading Data' :
             location.pathname === '/favorites' ? 'Favorite Cryptocurrencies' :
             'Cryptocurrency Details'}
          </h1>
          <p className="text-base-content/60">
            {location.pathname === '/' 
              ? 'Monitor your favorite cryptocurrencies and market trends'
              : location.pathname === '/trades'
              ? 'Real-time cryptocurrency trading activity'
              : location.pathname === '/favorites'
              ? 'Track and manage your favorite cryptocurrencies'
              : 'Detailed cryptocurrency information and analysis'
            }
          </p>
        </div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/crypto/:id" element={<CryptoDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <div>
          <p>Copyright © 2025 - All rights reserved by CryptoTracker</p>
        </div>
      </footer>
    </div>
  );
}
