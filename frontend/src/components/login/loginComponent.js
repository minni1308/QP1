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
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

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
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0">
            <CardBody className="p-5">
              <div className="text-center mb-4">
                <img src="/favicon.ico" alt="logo" style={{ width: '80px', marginBottom: '1rem' }} />
                <h2 className="font-weight-bold mb-4" style={{ color: '#1e3c72' }}>QP Generator</h2>
              </div>

              {(error || verify) && (
                <Alert color={verify ? "info" : "danger"} className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-4">
                  <Label for="username" className="text-muted">
                    <FaUser className="me-2" />
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
                    <FaLock className="me-2" />
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
                    background: '#1e3c72',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaSignInAlt />
                  Sign In
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary text-decoration-none">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;