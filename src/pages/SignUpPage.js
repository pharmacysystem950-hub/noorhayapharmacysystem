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
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    

    // OTP modal state
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpSuccess, setOtpSuccess] = useState('');
    const [adminId, setAdminId] = useState('');


    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password || !pharmacyName || !email) {
            setError('All fields are required');
            setTimeout(() => setError(''), 5000); // <-- added
            return;
        }

        try {
            const res = await api.post('/admins/signup', {
                USERNAME: username,
                PASSWORD: password,
                PHARMACY_NAME: pharmacyName,
                EMAIL: email,
            });

            setSuccess('Account created successfully! OTP sent to your email.');
            setOtpError('');
            setShowOtpModal(true); // Show OTP modal
            setAdminId(res.data.adminId);

            // Optional: clear form
            setUsername('');
            setPharmacyName('');
            setPassword('');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
            setSuccess('');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setOtpError('Please enter the OTP.');
            return;
        }

        try {
            await api.post('/admins/verify-otp', {
                ADMIN_ID: adminId,
                otp,
            });

            setOtpSuccess('OTP verified successfully! You can now login.');
            setOtpError('');
            setShowOtpModal(false);

            // Redirect to login page
            navigate('/login');
        } catch (err) {
            setOtpError(err.response?.data?.error || 'Invalid OTP. Please try again.');
            setOtpSuccess('');
        }
    };

    const ToastPopup = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast-popup ${type}`}>
      {message}
    </div>
  );
};


    return (
        <Container fluid className="signup-page">
              {/* ✅ Pharmacy Header */}
    <div className="pharmacy-header">
      <div className="pharmacy-logo"></div>
      <div className="header-text">
        <h2>Noor haya Pharmacy Point Of Sale and Inventory</h2>
        <h3>Management System</h3>
      </div>
    </div>

    <Row className="signup-row">
        <Col md={{ span: 6, offset: 3 }} className="signup-count">
            <div className="signup-container">
                <h2 className="signup-title">
  <FaUserPlus className="signup-icon" /> Sign Up
</h2>


               
                {/* Toast notifications */}
<ToastPopup message={error} type="error" onClose={() => setError('')} />
<ToastPopup message={success} type="success" onClose={() => setSuccess('')} />
<ToastPopup message={otpError} type="error" onClose={() => setOtpError('')} />
<ToastPopup message={otpSuccess} type="success" onClose={() => setOtpSuccess('')} />


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
                        <Form.Label>Pharmacy Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter pharmacy name"
                            value={pharmacyName}
                            onChange={(e) => setPharmacyName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="emaily">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

    {/* OTP Verification Modal */}
    {showOtpModal && (
  <div className="custom-modal">
    <div className="custom-modal-content">
      <h3>Verify OTP</h3>

      {otpError && <div className="error-message">{otpError}</div>}
      {otpSuccess && <div className="success-message">{otpSuccess}</div>}

      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Enter the OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Form.Group>

      <div className="button-row">
  <Button className="btn btn-primary" onClick={handleVerifyOtp}>
    Verify
  </Button>

  <Button
    variant="secondary"
    onClick={() => setShowOtpModal(false)}
  >
    Cancel
  </Button>
</div>

    </div>
  </div>
)}

</Container>

    );
};

export default SignUpPage;
