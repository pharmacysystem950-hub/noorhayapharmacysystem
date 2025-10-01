import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import api from "../api";
import { jwtDecode } from 'jwt-decode'; 
import { Button, Form, Container, Row, Col } from 'react-bootstrap'; 
import { FaUserShield } from 'react-icons/fa';
import '../styles/LoginPage.css';  

const LoginPage = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pharmacyName, setPharmacyName] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password || !pharmacyName) {
            setError('All fields are required');
            return;
        }
        try {
            const response = await api.post('/admins/login', {
                USERNAME: username,
                PASSWORD: password,
                PHARMACY_NAME: pharmacyName,
            });

            const token = response.data.token;
            const decodedToken = jwtDecode(token);
            const adminId = decodedToken.ADMIN_ID;

            localStorage.setItem('authToken', token);
            localStorage.setItem('adminId', adminId);

            setIsAuthenticated(true);
            navigate('/');
        } catch (err) {
            setError(err.response ? err.response.data.error : 'An error occurred');
        }
    };

   return (
    <Container fluid className="login-page">
        {/* Pharmacy Header */}
        <div className="pharmacy-header">
            <div className="pharmacy-logo"></div>
            <div className="header-text">
                <h2>Point Of Sale and Inventory Management System</h2>
                <h3>Maymed Pharmacy</h3>
            </div>
        </div>

        {/* Login Row */}
        <Row className="login-row">
            {/* Right Side: Login Form Only */}
            <Col md={6} className="right-side">
                <div className="login-container">
                    <h2>
                        <FaUserShield className="login-icon" />
                        <span className="login-text">Login</span>
                    </h2>

                    {error && <div className="error-message">{error}</div>}

                    <Form autoComplete="off" onSubmit={handleLogin}>
                        <input type="password" style={{ display: 'none' }} autoComplete="new-password" />

                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-control"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="pharmacyName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the name"
                                value={pharmacyName}
                                onChange={(e) => setPharmacyName(e.target.value)}
                                className="form-control"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Passwords</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                required
                                autoComplete="new-password"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="login-button">
                            Login
                        </Button>
                    </Form>

                    <p className="signup-link">
                        Do not yet have an account?{' '}
                        <span className="link-text" onClick={() => navigate('/signup')}>
                            Sign up
                        </span>
                    </p>
                </div>
            </Col>
        </Row>
    </Container>
);

};

export default LoginPage;
