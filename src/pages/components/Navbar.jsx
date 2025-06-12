import React, { useState } from 'react';
import { Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ onSearch, searchTerm = "" }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

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

  return (
    <nav className="bg-base-300 border-b border-base-content/10 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Go to home">
            <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
              ThoughtVault
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              {/* Search Icon */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isSearchFocused ? 'text-primary' : 'text-base-content/60'
                  }`} 
                />
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search your thoughts..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={handleKeyDown}
                className={`
                  input input-bordered w-full pl-12 pr-12 
                  bg-base-100 border-base-content/20
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  transition-all duration-200 ease-in-out
                  placeholder:text-base-content/50
                  ${isSearchFocused ? 'shadow-lg scale-[1.02]' : 'shadow-sm'}
                `}
                aria-label="Search notes"
              />

              {/* Clear Button */}
              {localSearchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/60 hover:text-error transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Search Highlight Border */}
              <div 
                className={`
                  absolute inset-0 rounded-lg pointer-events-none
                  transition-all duration-200 ease-in-out
                  ${isSearchFocused ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-base-300' : ''}
                `}
              />
            </div>

            {/* Search Shortcut Hint */}
            {!isSearchFocused && !localSearchTerm && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <kbd className="kbd kbd-sm bg-base-content/10 text-base-content/60 border-base-content/20">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>

          {/* Create Note Button */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/create"
              className="btn btn-primary flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-base-300"
              aria-label="Create a new note"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Note</span>
              <span className="sm:hidden">Create</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Results Indicator */}
      {localSearchTerm && (
        <div className="bg-base-200 border-t border-base-content/10 px-4 py-2">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm text-base-content/70">
              Searching for: <span className="font-medium text-primary">"{localSearchTerm}"</span>
              <button 
                onClick={handleClearSearch}
                className="ml-2 text-xs text-base-content/60 hover:text-primary underline"
              >
                Clear
              </button>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;