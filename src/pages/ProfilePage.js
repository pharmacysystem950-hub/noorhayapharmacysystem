import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import api from "../api";
import { FaUserCircle } from 'react-icons/fa'; // Profile icon
import '../styles/ProfilePage.css'; // Ensure consistent styling

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ USERNAME: '', PHARMACY_NAME: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                navigate('/login'); // Redirect if no token
                return;
            }

            try {
                // ✅ Updated to use /admins/profile
                const response = await api.get('/admins/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
                navigate('/login'); // Redirect if token is invalid
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminId'); // Optional: remove stored admin ID
        navigate('/login'); // Redirect to login
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page p">
            <div className="profile-containers">
                <div className="profile-icon">
                    <FaUserCircle size={80} className="profile-icon" />
                </div>
                <div className="profile-info">
                    <p><strong>Username:</strong> {profile.USERNAME}</p>
                    <p><strong>Pharmacy Name:</strong> {profile.PHARMACY_NAME}</p>
                </div>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default ProfilePage;
