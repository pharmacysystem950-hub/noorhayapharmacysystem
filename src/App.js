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
import CancelledProductsPage from './pages/CancelledProductsPage';
import ExpiredProductsPage from './pages/ExpiredProductsPage';
import LowStocksPage from './pages/LowStocksPage';
import ActiveProductsPage from './pages/ActiveProductsPage';
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

  // Logout function shared by Appbar
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('Token'); // whatever token key you use
    setIsAuthenticated(false);
    setIsSidebarOpen(false); // hide sidebar on logout
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
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" replace />} />
            <Route path="/product-page" element={isAuthenticated ? <ProductPage /> : <Navigate to="/" replace />} />
            <Route path="/create-product" element={isAuthenticated ? <CreateProduct /> : <Navigate to="/" replace />} />
            <Route path="/product-sold" element={isAuthenticated ? <ProductSoldPage /> : <Navigate to="/" replace />} />
            <Route path="/low-stock-products" element={isAuthenticated ? <LowStocksPage /> : <Navigate to="/" replace />} />
            <Route path="/expired-products" element={isAuthenticated ? <ExpiredProductsPage /> : <Navigate to="/" replace />} />
            <Route path="/active-products" element={isAuthenticated ? <ActiveProductsPage /> : <Navigate to="/" replace />} />
            <Route path="/cancelled-products" element={isAuthenticated ? <CancelledProductsPage /> : <Navigate to="/" replace />} />
            <Route path="/settings" element={isAuthenticated ? <Settings onSettingsChange={handleSettingsChange} /> : <Navigate to="/" replace />} />
            <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/" replace />} /> 
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
