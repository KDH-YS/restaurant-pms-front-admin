import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUtensils, faClipboardList, faStar, faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#" role="button">
            <FontAwesomeIcon icon={faBars} />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="#" className="nav-link">Dashboard</a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Navbar Search */}
        <li className="nav-item">
          <a className="nav-link" href="#" role="button" onClick={handleSearchToggle}>
            <FontAwesomeIcon icon={faSearch} />
          </a>
          {isSearchActive && (
            <div className="navbar-search-block">
              <form className="form-inline" onSubmit={handleSearchSubmit}>
                <div className="input-group input-group-sm">
                  <input
                    className="form-control form-control-navbar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <button className="btn btn-navbar" type="button" onClick={handleSearchToggle}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </li>

        {/* Member Management */}
        <li className="nav-item">
          <a className="nav-link" href="/member-management">
            <FontAwesomeIcon icon={faUser} />
            <span className="nav-link-text">회원 관리</span>
          </a>
        </li>

        {/* Restaurant Management */}
        <li className="nav-item">
          <a className="nav-link" href="/restaurant-management">
            <FontAwesomeIcon icon={faUtensils} />
            <span className="nav-link-text">레스토랑 관리</span>
          </a>
        </li>

        {/* Reservation Management */}
        <li className="nav-item">
          <a className="nav-link" href="/reservation-management">
            <FontAwesomeIcon icon={faClipboardList} />
            <span className="nav-link-text">예약 관리</span>
          </a>
        </li>

        {/* Review Management */}
        <li className="nav-item">
          <a className="nav-link" href="/review-management">
            <FontAwesomeIcon icon={faStar} />
            <span className="nav-link-text">리뷰 관리</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
