import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  // Sidebar navigation items (without "About")
 const menuItems = [
  { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
  { path: '/create-product', icon: 'fas fa-plus-circle', label: 'Add Products' },
  { path: '/product-page', icon: 'fas fa-boxes', label: 'Stocks' },
  { path: '/product-sold', icon: 'fas fa-shopping-cart', label: 'Product Sold' },
  { path: '/cancelled-products', icon: 'fas fa-ban', label: 'Cancelled Purchases' },
  { path: '/low-stock-products', icon: 'fas fa-exclamation-triangle', label: 'Low Stock Products' },
  { path: '/active-products', icon: 'fas fa-check-circle', label: 'Active Products' }, // ✅ New Active Products
  { path: '/expired-products', icon: 'fas fa-calendar-times', label: 'Expired Products' },
  { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
];

  return (
    <div className={`sidebar-container ${isOpen ? "expanded" : "collapsed"}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-wrapper">
          {isOpen && <h1 className="app-title">POS AND IM</h1>}
        </div>
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <i className={`fas ${isOpen ? "fa-bars" : "fa-chevron-right"}`}></i>
        </button>
      </div>

      {/* Navigation */}
      <div className="sidebar-content">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <div className="menu-icon-container">
              <i className={item.icon}></i>
            </div>
            {isOpen && (
              <div className="menu-label-container">
                <span className="menu-label">{item.label}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* About stays separate at the bottom */}
      <div>
        <Link to="/about" className="about-link">
          {isOpen ? "About" : <i className="fas fa-info-circle"></i>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
