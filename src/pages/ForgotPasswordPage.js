import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

     // Automatically hide notifications after 5s
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);


    const handleSendOtp = async () => {
        if (!email) {
            setError('Enter your email');
            return;
        }
        try {
            await api.post('/admins/forgot-password', { EMAIL: email });
            setOtpSent(true);
            setError('');
            setSuccess('OTP sent to your email');
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error sending OTP');
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword) {
            setError('OTP and new password are required');
            return;
        }
        try {
            await api.post('/admins/reset-password', {
                EMAIL: email,
                OTP: otp,
                NEW_PASSWORD: newPassword,
            });
            setSuccess('Password reset successful! You can now login.');
            setError('');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error resetting password');
        }
    };
return (
  <Container fluid className="forgot-page">

      {/* ✅ Pharmacy Header */}
    <div className="pharmacy-header">
      <div className="pharmacy-logo"></div>
      <div className="header-text">
        <h2>Point Of Sale and Inventory Management System </h2>
        <h3>Maymed Pharmacy</h3>
      </div>
    </div>
    
    <Row className="forgot-row">
      <Col md={{ span: 6, offset: 3 }} className="right-side">
        <div className="forgot-container">
          <h2>Forgot Password</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!otpSent ? (
            <div className="inner-container">
              <Form.Group>
                <Form.Label>Enter your email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <div className="button-wrapper">
                <Button variant="primary" onClick={handleSendOtp} className="mt-2">
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="inner-container">
              <Form.Group>
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <div className="button-wrapper">
                <Button variant="success" onClick={handleResetPassword} className="mt-2">
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </Col>
    </Row>
  </Container>
);

};

export default ForgotPasswordPage;
