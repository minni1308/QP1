import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { baseUrl } from "../../url";
import localStorage from "local-storage";
import { WaveTopBottomLoading } from "react-loadingg";
import { FaUser, FaLock, FaSignInAlt, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [verify, setVerify] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setVerify(false);

    try {
      const response = await fetch(baseUrl + "/teacher/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.status === "VERIFY") {
        setVerify(true);
        setError("Please verify your email to continue");
      } else if (result.status && result.token) {
        // First store the auth data
        localStorage.set("token", result.token);
        localStorage.set("user", result.user);
        
        // Force a page reload to update the navigation state
        window.location.href = result.user.admin ? "/admin/home" : "/teacher/landing";
      } else {
        setError(result.err || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
        <WaveTopBottomLoading />
      </Container>
    );
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" 
      style={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}
      ></div>

      <Row className="justify-content-center align-items-center w-100">
        <Col xs={12} md={10} lg={8} xl={8} className="p-4">
          <Card className="shadow-lg border-0 overflow-hidden">
            <Row className="g-0">
              {/* Left side - Illustration */}
              <Col md={5} className="bg-primary d-none d-md-block" style={{ position: 'relative' }}>
                <div className="p-5 d-flex flex-column justify-content-center h-100 text-white" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
                  <div className="text-center mb-5">
                    <FaChalkboardTeacher size={60} className="mb-4" />
                    <h3 className="font-weight-bold mb-2">Welcome Back!</h3>
                    <p className="opacity-75">Log in to access your question paper generator dashboard</p>
                  </div>
                  
                  <div className="login-illustration">
                    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="100%" style={{ maxHeight: '250px' }}>
                      <g transform="matrix(1, 0, 0, 1, 0, 0)">
                        <circle style={{ fill: 'rgba(255,255,255,0.1)' }} cx="250" cy="250" r="130"></circle>
                        <path style={{ fill: 'rgba(255,255,255,0.2)' }} d="M237.7,227.9c0,13.3-10.8,24.1-24.1,24.1s-24.1-10.8-24.1-24.1s10.8-24.1,24.1-24.1S237.7,214.6,237.7,227.9z"></path>
                        <path style={{ fill: 'rgba(255,255,255,0.25)' }} d="M308.8,304c0,0-35.7-18.5-59.2-18.5c-23.5,0-59.2,18.5-59.2,18.5v-21.7c0,0,35.7-18.5,59.2-18.5 c23.5,0,59.2,18.5,59.2,18.5V304z"></path>
                        <path style={{ fill: 'rgba(255,255,255,0.25)' }} d="M328.8,261.7c0,8.1-6.6,14.7-14.7,14.7c-8.1,0-14.7-6.6-14.7-14.7c0-8.1,6.6-14.7,14.7-14.7 C322.2,247,328.8,253.6,328.8,261.7z"></path>
                        <rect x="210" y="176" width="80" height="4" rx="2" style={{ fill: 'rgba(255,255,255,0.3)' }}></rect>
                        <rect x="210" y="190" width="140" height="4" rx="2" style={{ fill: 'rgba(255,255,255,0.3)' }}></rect>
                        <rect x="210" y="204" width="120" height="4" rx="2" style={{ fill: 'rgba(255,255,255,0.3)' }}></rect>
                        <rect x="210" y="310" width="140" height="4" rx="2" style={{ fill: 'rgba(255,255,255,0.3)' }}></rect>
                        <rect x="210" y="324" width="100" height="4" rx="2" style={{ fill: 'rgba(255,255,255,0.3)' }}></rect>
                        <rect x="150" y="340" width="200" height="4" rx="2" style={{ fill: 'rgba(255,255,255,0.3)' }}></rect>
                      </g>
                    </svg>
                  </div>
                  
                  <div className="mt-4">
                    <div className="d-flex align-items-center mb-3">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white', marginRight: '10px' }}></div>
                      <span className="small">Create Custom Questions</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white', marginRight: '10px' }}></div>
                      <span className="small">Generate Question Papers</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white', marginRight: '10px' }}></div>
                      <span className="small">Manage Your Subjects</span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Right side - Login Form */}
              <Col md={7}>
                <CardBody className="p-5">
                  <div className="text-center mb-4">
                    <FaGraduationCap size={40} className="mb-3 text-primary" />
                    <h2 className="font-weight-bold" style={{ color: '#1e3c72' }}>QP Generator</h2>
                    <p className="text-muted">Please sign in to continue</p>
                  </div>

                  {(error || verify) && (
                    <Alert color={verify ? "info" : "danger"} className="mb-4">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-4">
                      <Label for="username" className="text-muted">
                        <FaUser className="me-2" size={14} />
                        Username
                      </Label>
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInput}
                        className="form-control-lg"
                        autoComplete="username"
                      />
                    </FormGroup>

                    <FormGroup className="mb-4">
                      <Label for="password" className="text-muted">
                        <FaLock className="me-2" size={14} />
                        Password
                      </Label>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInput}
                        className="form-control-lg"
                        autoComplete="current-password"
                      />
                    </FormGroup>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Link to="/forgot" className="text-primary text-decoration-none">
                        Forgot Password?
                      </Link>
                    </div>

                    <Button
                      color="primary"
                      size="lg"
                      block
                      type="submit"
                      className="mb-4 d-flex align-items-center justify-content-center"
                      style={{ 
                        gap: '0.5rem',
                        background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaSignInAlt size={16} />
                      Sign In
                    </Button>

                    <div className="text-center">
                      <p className="mb-0">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary text-decoration-none fw-bold">
                          Sign Up
                        </Link>
                      </p>
                    </div>
                  </Form>
                </CardBody>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;