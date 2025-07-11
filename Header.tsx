import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ClothingStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/products?category=men" className="text-gray-700 hover:text-blue-600 transition-colors">
              Men
            </Link>
            <Link to="/products?category=women" className="text-gray-700 hover:text-blue-600 transition-colors">
              Women
            </Link>
            <Link to="/products?category=kids" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kids
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <User className="h-6 w-6" />
                  <span className="hidden lg:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible group-hover:visible">
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>

              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Home
                </Link>
                <Link to="/products?category=men" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Men
                </Link>
                <Link to="/products?category=women" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Women
                </Link>
                <Link to="/products?category=kids" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Kids
                </Link>
              </nav>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  <span>Cart ({cartItemCount})</span>
                </Link>

                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;