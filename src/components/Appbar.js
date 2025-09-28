import React, { useEffect, useState } from 'react';
import '../styles/Appbar.css';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Appbar = ({ isSidebarOpen, handleLogout }) => {
    const [profile, setProfile] = useState({ USERNAME: '' });
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    // Fetch profile (only USERNAME now)
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3000/admins/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile({ USERNAME: response.data.USERNAME }); // ✅ Only keep USERNAME
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminId');
        handleLogout && handleLogout();
        navigate('/login');
    };

    return (
        <div className={`app-bar-container ${isSidebarOpen ? "" : "closed"}`}>
            <div className="app-bar-titles">
                POINT OF SALE AND INVENTORY MANAGEMENT SYSTEM MAYMED PHARMACY
            </div>

            <div 
                className="profile-container"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
                <FaUserCircle size={30} className="profile-icon" />
                {showProfileDropdown && (
                    <div className="profile-dropdown">
                        <div>
                            <p className="username">{profile.USERNAME}</p>
                        </div>
                        <button className="logout-btn" onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appbar;
