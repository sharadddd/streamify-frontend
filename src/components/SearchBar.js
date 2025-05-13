import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/SearchBar.css';

function SearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchTrigger = () => {
    // Placeholder for triggering search
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className="search-bar-container">
      <input className="search-bar-input"
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInput}
      />
      <button className="search-bar-button" onClick={handleSearchTrigger}>Search</button>
    </div>
  );
}

export default SearchBar;