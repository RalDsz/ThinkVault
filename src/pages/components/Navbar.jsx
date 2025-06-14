import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Moon, Sun, Menu, User, Bell, Settings } from "lucide-react";

// Temporary Link component for demo - replace with actual Link in your project
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

const Navbar = ({ onSearch, searchTerm = "" }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Enhanced scroll effect with scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClearSearch();
      e.target.blur();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigationItems = [
    { name: 'Benefits', href: '/benefits' },
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Pricing', href: '/pricing' }
  ];

  // Calculate dynamic blur and opacity based on scroll position
  const blurAmount = Math.min(scrollY / 10, 24);
  const glassOpacity = Math.min(0.4 + (scrollY / 300), 0.65);

  return (
    <>
      {/* Main Navbar with Glassmorphism */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled 
            ? 'mt-3 mx-3' 
            : 'mt-0 mx-0'
        }`}
        style={{
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
        }}
      >
        <div 
          className={`transition-all duration-500 ease-out ${
            scrolled 
              ? 'rounded-3xl shadow-2xl shadow-black/10 border border-white/10' 
              : 'rounded-none shadow-none border-b border-white/5'
          }`}
          style={{
            background: scrolled 
              ? `rgba(255, 255, 255, 0.85)` 
              : 'rgba(255, 255, 255, 0.75)',
            backdropFilter: `blur(${Math.max(blurAmount, 20)}px) saturate(1.8)`,
            WebkitBackdropFilter: `blur(${Math.max(blurAmount, 20)}px) saturate(1.8)`,
          }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo - Pushed more to the left */}
              <div className="flex items-center flex-shrink-0">
                <Link to="/" className="flex items-center group" aria-label="Go to home">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-gray-700 transition-colors duration-200">
                    ThoughtVault
                  </span>
                </Link>
              </div>

              {/* Center Navigation - Desktop with more space */}
              <div className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/20"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right Side Actions - More spaced out */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                
                {/* Search - Desktop Only */}
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={`w-4 h-4 transition-colors duration-200 ${
                        isSearchFocused ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={localSearchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      onKeyDown={handleKeyDown}
                      className={`
                        w-64 pl-10 pr-4 py-2 text-sm
                        bg-white/5 border border-white/10 rounded-2xl
                        backdrop-blur-sm
                        focus:bg-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/10 focus:outline-none
                        transition-all duration-300
                        placeholder:text-gray-500
                        ${isSearchFocused ? 'shadow-lg shadow-black/5' : ''}
                      `}
                      style={{
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                      }}
                    />
                    {localSearchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-2xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="p-2 text-gray-600 hover:text-gray-800 rounded-2xl hover:bg-white/10 transition-all duration-200 relative backdrop-blur-sm">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-sm"></span>
                </button>

                {/* Create Note Button */}
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gray-900/70 hover:bg-gray-900/90 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500/30 shadow-lg shadow-gray-900/10 backdrop-blur-sm"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create Note
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-800 rounded-2xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-white/20 mt-1">
              <div 
                className="px-6 py-6 space-y-4 rounded-b-3xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                }}
              >
                {/* Mobile Search */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  />
                </div>
                
                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-gray-700 hover:text-gray-900 text-sm font-medium py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t border-white/30 pt-6 mt-6">
                  <Link
                    to="/create"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-medium text-white bg-gray-900/70 hover:bg-gray-900/90 rounded-2xl transition-all duration-300 shadow-lg shadow-gray-900/10 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Note
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Results Indicator */}
      {localSearchTerm && (
        <div 
          className={`fixed z-40 left-0 right-0 px-6 py-4 transition-all duration-500 ${
            scrolled ? 'top-20 mx-3' : 'top-16 mx-0'
          }`}
          style={{
            background: 'rgba(59, 130, 246, 0.05)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: scrolled ? '24px' : '0px',
            border: scrolled ? '1px solid rgba(59, 130, 246, 0.1)' : 'none',
            borderTop: scrolled ? '1px solid rgba(59, 130, 246, 0.1)' : '1px solid rgba(59, 130, 246, 0.1)',
          }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-sm text-blue-800 font-medium">
              Searching for: <span className="font-semibold">"{localSearchTerm}"</span>
              <button 
                onClick={handleClearSearch}
                className="ml-3 text-xs text-blue-700 hover:text-blue-900 underline font-medium"
              >
                Clear
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;