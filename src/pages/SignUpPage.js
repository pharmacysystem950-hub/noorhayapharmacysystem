import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { FaUserPlus } from "react-icons/fa";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../styles/SignUpPage.css';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [pharmacyName, setPharmacyName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password || !confirmPassword || !pharmacyName) {
            setError('All fields are required');
            setTimeout(() => setError(''), 5000);
            return;
        }

        // Strong password validation
        const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            setError('Password must be at least 8 characters, include letters, numbers, and special characters.');
            setTimeout(() => setError(''), 8000);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await api.post('/admins/signup', {
                USERNAME: username,
                PASSWORD: password,
                CONFIRM_PASSWORD: confirmPassword,
                PHARMACY_NAME: pharmacyName,
            });

            setSuccess(res.data.message || 'Admin registered successfully.');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login

            // Clear form
            setUsername('');
            setPharmacyName('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        }
    };

    const ToastPopup = ({ message, type }) => {
        if (!message) return null;
        return <div className={`toast-popup ${type}`}>{message}</div>;
    };

    return (
        <Container fluid className="signup-page">
            {/* Pharmacy Header */}
            <div className="pharmacy-header">
                <div className="pharmacy-logo"></div>
                <div className="header-text">
                    <h2>Point Of Sale and Inventory Management System</h2>
                    <h3>Maymed Pharmacy</h3>
                </div>
            </div>

            <Row className="signup-row">
                <Col md={{ span: 6, offset: 3 }} className="signup-count">
                    <div className="signup-container">
                        <h2 className="signup-title">
                            <FaUserPlus className="signup-icon" /> Sign Up
                        </h2>

                        {/* Toast notifications */}
                        <ToastPopup message={error} type="error" />
                        <ToastPopup message={success} type="success" />

                        <Form onSubmit={handleSignUp} autoComplete="off">
                            <Form.Group controlId="usernamey">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="pharmacyNamey">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter pharmacy name"
                                    value={pharmacyName}
                                    onChange={(e) => setPharmacyName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="passwordy">
                                <Form.Label>Passwordr</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="confirmy">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password again"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" className="signup-button mt-3">
                                Sign Up
                            </Button>
                        </Form>

                        <p className="login-link">
                        Already have an account?{' '}
                        <span className="link-text" onClick={() => navigate('/login')}>
                            Login
                        </span>
                    </p>

                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default SignUpPage;
