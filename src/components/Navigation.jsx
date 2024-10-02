import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <nav className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Reddit Tracker</h1>
      </div>
      <ul className="space-y-2 p-4">
        <li>
          <Link to="/" className={`flex items-center p-2 rounded-lg ${isActive('/')}`}>
            <Home className="mr-2 h-5 w-5" />
            Comment Tracker
          </Link>
        </li>
        <li>
          <Link to="/subreddit-explorer" className={`flex items-center p-2 rounded-lg ${isActive('/subreddit-explorer')}`}>
            <Search className="mr-2 h-5 w-5" />
            Subreddit Explorer
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;