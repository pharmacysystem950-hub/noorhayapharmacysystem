import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { FaUserPlus } from "react-icons/fa";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../styles/SignUpPage.css';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password) {
            setError('All fields are required');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            // No need to assign to res since it's unused
            await api.post('/admins/signup', {
                USERNAME: username,
                PASSWORD: password,
            });

            setSuccess('Account created successfully! You can now login.');
            setError('');

            // Clear form
            setUsername('');
            setPassword('');

            // Redirect to login after short delay
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
            setSuccess('');
        }
    };

    const ToastPopup = ({ message, type }) => {
        if (!message) return null;
        return <div className={`toast-popup ${type}`}>{message}</div>;
    };

    return (
        <Container fluid className="signup-page">
            {/* Header */}
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

                            <Form.Group controlId="passwordy">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" className="signup-button mt-3">
                                Sign Up
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default SignUpPage;
