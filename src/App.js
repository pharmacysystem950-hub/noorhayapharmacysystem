import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Appbar from './components/Appbar';
import ProductPage from './pages/ProductPage';
import CreateProduct from './pages/CreateProduct';
import Home from './pages/Home';
import ProductSoldPage from './pages/ProductSoldPage';
import LoginPage from './pages/LoginPage';
import Settings from './pages/Settings';
import About from './pages/About'; 
import SignUpPage from './pages/SignUpPage';
import CancelledProductsPage from './pages/CancelledProductsPage';
import ExpiredProductsPage from './pages/ExpiredProductsPage';
import LowStocksPage from './pages/LowStocksPage';
import ActiveProductsPage from './pages/ActiveProductsPage';
import RotateWrapper from './components/RotateWrapper'; // ✅ new wrapper
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'default',
    fontSize: localStorage.getItem('fontSize') || 'normal',
    contrast: localStorage.getItem('contrast') || 1,
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('Token'); 
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('Token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleSettingsChange = (newSettings) => setSettings(newSettings);

  return (
    <div className={`app-container ${settings.theme} ${settings.fontSize}`}>
      <Router>
        {isAuthenticated && <Appbar isSidebarOpen={isSidebarOpen} handleLogout={handleLogout} />}
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
        
        <div 
          className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
          style={{ marginTop: isAuthenticated ? '64px' : 0 }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<SignUpPage setIsAuthenticated={setIsAuthenticated} />} />

            {/* Protected Routes (wrapped in RotateWrapper) */}
            <Route path="/home" element={isAuthenticated ? <RotateWrapper><Home /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/product-page" element={isAuthenticated ? <RotateWrapper><ProductPage /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/create-product" element={isAuthenticated ? <RotateWrapper><CreateProduct /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/product-sold" element={isAuthenticated ? <RotateWrapper><ProductSoldPage /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/low-stock-products" element={isAuthenticated ? <RotateWrapper><LowStocksPage /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/expired-products" element={isAuthenticated ? <RotateWrapper><ExpiredProductsPage /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/active-products" element={isAuthenticated ? <RotateWrapper><ActiveProductsPage /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/cancelled-products" element={isAuthenticated ? <RotateWrapper><CancelledProductsPage /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/settings" element={isAuthenticated ? <RotateWrapper><Settings onSettingsChange={handleSettingsChange} /></RotateWrapper> : <Navigate to="/" replace />} />
            <Route path="/about" element={isAuthenticated ? <RotateWrapper><About /></RotateWrapper> : <Navigate to="/" replace />} /> 

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
