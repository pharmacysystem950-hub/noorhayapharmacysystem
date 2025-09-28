import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Get the current login admin from localStorage
        const token = localStorage.getItem('authToken');
        const storedProfile = localStorage.getItem('profile'); // Assuming you stored it in Settings

        if (!token) {
            navigate('/login'); // Redirect if no token
            return;
        }

        if (storedProfile) {
            try {
                const parsedProfile = JSON.parse(storedProfile);
                setUsername(parsedProfile.USERNAME || '');
            } catch (error) {
                console.error('Error parsing profile from localStorage:', error);
            }
        }

        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminId');
        localStorage.removeItem('profile'); // ✅ Clear profile data
        navigate('/login');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-page p">
            <div className="profile-containers">
                <div className="profile-icon">
                    <FaUserCircle size={80} className="profile-icon" />
                </div>
                <div className="profile-info">
                    <p><strong>Username:</strong> {username}</p>
                </div>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default ProfilePage;
