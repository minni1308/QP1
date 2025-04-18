import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
  FormText,
  FormFeedback,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { baseUrl } from "../../url";
import { WaveTopBottomLoading } from "react-loadingg";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle, FaGraduationCap, FaUserPlus, FaChalkboardTeacher } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phno: "",
    password: "",
    rewrite: "",
  });

  const [validation, setValidation] = useState({
    name: { valid: true, message: "" },
    email: { valid: true, message: "" },
    phno: { valid: true, message: "" },
    password: { valid: true, message: "" },
    rewrite: { valid: true, message: "" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimLeft() }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let isValid = true;
    let message = "";

    switch (name) {
      case "email":
        isValid = /^[A-Za-z0-9.]+@gmail\.com$/.test(value);
        message = isValid ? "" : "Please use a valid Gmail address";
        break;
      case "phno":
        isValid = /\+?\d[\d -]{8,12}\d$/.test(value);
        message = isValid ? "" : "Please enter a valid phone number";
        break;
      case "password":
        isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,32}$/.test(value);
        message = isValid ? "" : "Password must meet all criteria";
        break;
      case "rewrite":
        isValid = value === formData.password;
        message = isValid ? "" : "Passwords do not match";
        break;
      default:
        break;
    }

    setValidation(prev => ({
      ...prev,
      [name]: { valid: isValid, message }
    }));

    return isValid;
  };

  const validateInputs = () => {
    const fields = ["name", "email", "phno", "password", "rewrite"];
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const res = await fetch(baseUrl + "/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setFormData({
          name: "",
          email: "",
          phno: "",
          password: "",
          rewrite: "",
        });
        setSubmitted(true);
      } else {
        setValidation(prev => ({
          ...prev,
          email: { valid: false, message: data.message || "Signup failed" }
        }));
      }
    } catch (err) {
      setValidation(prev => ({
        ...prev,
        email: { valid: false, message: "Server error. Please try again." }
      }));
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

  if (submitted) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" 
        style={{ 
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Card className="border-0 shadow-lg" style={{ maxWidth: "500px" }}>
          <CardBody className="text-center p-5">
            <div className="mb-4">
              <FaCheckCircle size={60} className="text-success" />
            </div>
            <h2 className="mb-4">Account Created Successfully!</h2>
            <p className="text-muted mb-4">
              A verification link has been sent to your email address. Please check your inbox and click on the link to verify your account.
            </p>
            <Button
              tag={Link}
              to="/signin"
              color="primary"
              size="lg"
              className="px-5"
              style={{ 
                background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              Go to Login
            </Button>
          </CardBody>
        </Card>
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
                    <h3 className="font-weight-bold mb-2">Join Us Today!</h3>
                    <p className="opacity-75">Create your account to start generating question papers</p>
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

              {/* Right side - Signup Form */}
              <Col md={7}>
                <CardBody className="p-5">
                  <div className="text-center mb-4">
                    <FaGraduationCap size={40} className="mb-3 text-primary" />
                    <h2 className="font-weight-bold" style={{ color: '#1e3c72' }}>Create Account</h2>
                    <p className="text-muted">Fill in your details to register</p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-3">
                      <Label className="text-muted">
                        <FaUser className="me-2" size={14} />
                        Full Name
                      </Label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInput}
                        placeholder="Enter your full name"
                        required
                        className="form-control-lg"
                        invalid={!validation.name.valid}
                      />
                      <FormFeedback>{validation.name.message}</FormFeedback>
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <Label className="text-muted">
                        <FaEnvelope className="me-2" size={14} />
                        Email Address
                      </Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInput}
                        placeholder="Enter your email"
                        required
                        className="form-control-lg"
                        invalid={!validation.email.valid}
                      />
                      <FormFeedback>{validation.email.message}</FormFeedback>
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <Label className="text-muted">
                        <FaPhone className="me-2" size={14} />
                        Phone Number
                      </Label>
                      <Input
                        name="phno"
                        value={formData.phno}
                        onChange={handleInput}
                        placeholder="Enter your phone number"
                        required
                        className="form-control-lg"
                        invalid={!validation.phno.valid}
                      />
                      <FormFeedback>{validation.phno.message}</FormFeedback>
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <Label className="text-muted">
                        <FaLock className="me-2" size={14} />
                        Password
                      </Label>
                      <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInput}
                        placeholder="Create a password"
                        required
                        className="form-control-lg"
                        invalid={!validation.password.valid}
                      />
                      <FormFeedback>{validation.password.message}</FormFeedback>
                      <FormText color="muted" className="mt-2">
                        <small>
                          Must be 8-32 characters with uppercase, lowercase, number, and special character
                        </small>
                      </FormText>
                    </FormGroup>

                    <FormGroup className="mb-4">
                      <Label className="text-muted">
                        <FaLock className="me-2" size={14} />
                        Confirm Password
                      </Label>
                      <Input
                        name="rewrite"
                        type="password"
                        value={formData.rewrite}
                        onChange={handleInput}
                        placeholder="Re-enter your password"
                        required
                        className="form-control-lg"
                        invalid={!validation.rewrite.valid}
                      />
                      <FormFeedback>{validation.rewrite.message}</FormFeedback>
                    </FormGroup>

                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      block
                      className="mb-4 d-flex align-items-center justify-content-center"
                      style={{ 
                        gap: '0.5rem',
                        background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaUserPlus size={16} />
                      Create Account
                    </Button>

                    <div className="text-center">
                      <p className="mb-0">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-primary text-decoration-none fw-bold">
                          Sign In
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

export default Signup;