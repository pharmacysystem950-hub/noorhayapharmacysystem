import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSun, FaMoon, FaRegLightbulb, FaPalette, FaAdjust, 
  FaTextHeight, FaLowVision, FaUserEdit 
} from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = ({ onSettingsChange }) => {
  // Theme, font, and contrast settings
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'default',
    fontSize: localStorage.getItem('fontSize') || 'normal',
    contrast: localStorage.getItem('contrast') || 1
  });

  // Profile settings
  const [profile, setProfile] = useState({
    USERNAME: '',
    PASSWORD: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.style.setProperty('--app-contrast', settings.contrast);
    document.documentElement.style.fontSize =
      settings.fontSize === 'small' ? '0.8rem' :
      settings.fontSize === 'normal' ? '1rem' :
      '1.2rem';
  }, [settings.contrast, settings.fontSize]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:3000/admins/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSettingsChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(key, value);
    if (onSettingsChange) onSettingsChange(newSettings);
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const updatedFields = {};
    if (profile.USERNAME?.trim()) updatedFields.USERNAME = profile.USERNAME.trim();
    if (profile.PASSWORD) updatedFields.PASSWORD = profile.PASSWORD;

    if (Object.keys(updatedFields).length === 0) {
      setMessage('No changes detected.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://localhost:3000/admins/edit-profile', updatedFields, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Profile updated successfully!');
      setProfile(prev => ({ ...prev, PASSWORD: '' })); // clear password field
    } catch (error) {
      console.error('Error updating admin profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <>
      <header className="settings-header">
        <h2>Settings</h2>
      </header>

      <div className="settings-wrapper">
        <div className="settings-container">
          {/* Theme Options */}
          <div className="settings-section">
            <h3>Theme</h3>
            <div className="settings-buttons">
              <button onClick={() => handleSettingsChange('theme', 'default')}><FaPalette /> Default</button>
              <button onClick={() => handleSettingsChange('theme', 'light')}><FaSun /> Light</button>
              <button onClick={() => handleSettingsChange('theme', 'dark')}><FaMoon /> Dark</button>
              <button onClick={() => handleSettingsChange('theme', 'comfort')}><FaRegLightbulb /> Comfort</button>
              <button onClick={() => handleSettingsChange('theme', 'sepia')}><FaAdjust /> Sepia</button>
            </div>
          </div>

          {/* Font Size Options */}
          <div className="settings-section">
            <h3>Font Size</h3>
            <div className="settings-buttons">
              <button onClick={() => handleSettingsChange('fontSize', 'small')}><FaTextHeight /> Small</button>
              <button onClick={() => handleSettingsChange('fontSize', 'normal')}><FaTextHeight /> Normal</button>
              <button onClick={() => handleSettingsChange('fontSize', 'large')}><FaTextHeight /> Large</button>
            </div>
          </div>

          {/* Contrast Options */}
          <div className="settings-section contrast-options">
            <h3>Contrast</h3>
            <div className="settings-buttons">
              <button onClick={() => handleSettingsChange('contrast', 0.5)}><FaLowVision /> Low Contrast</button>
              <button onClick={() => handleSettingsChange('contrast', 1)}><FaLowVision /> Normal Contrast</button>
              <button onClick={() => handleSettingsChange('contrast', 2)}><FaLowVision /> High Contrast</button>
            </div>
            <input 
              type="range" 
              min="0.2" 
              max="3" 
              step="0.1" 
              value={settings.contrast} 
              onChange={(e) => handleSettingsChange('contrast', e.target.value)}
            />
          </div>

          {/* Profile Editing Section */}
          <div className="settings-section">
            <h3>Edit Profile <FaUserEdit /></h3>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleProfileUpdate}>
              <label>Username:</label>
              <input
                type="text"
                name="USERNAME"
                value={profile.USERNAME}
                onChange={handleProfileChange}
              />

              <label>New Password:</label>
              <input
                type="password"
                name="PASSWORD"
                placeholder="Leave blank to keep current password"
                value={profile.PASSWORD}
                onChange={handleProfileChange}
              />

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>

        {/* Display Current Settings */}
        <div className="current-settings-container">
          <div className="settings-box">
            <p>Contrast: {Math.round(settings.contrast * 100)}%</p>
          </div>
          <div className="settings-box">
            <p>Current Theme: {settings.theme}</p>
          </div>
          <div className="settings-box">
            <p>Font Size: {settings.fontSize}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
