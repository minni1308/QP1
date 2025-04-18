import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button
} from 'reactstrap';
import { FaGraduationCap, FaBook, FaClock, FaTools, FaRocket, FaShieldAlt } from 'react-icons/fa';

const LandingComponent = () => {
  return (
    <div className="landing-page">
      <style>
        {`
          .landing-page {
            overflow-x: hidden;
          }
          .hero-section {
            position: relative;
            background-color: #1a237e;
            color: white;
            overflow: hidden;
            min-height: 100vh;
            display: flex;
            align-items: center;
          }
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
          }
          .hero-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }
          .floating-shapes > div {
            position: absolute;
            background: rgba(255, 255, 255, 0.05);
            animation-name: float-around;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-duration: 20s;
            border-radius: 50%;
          }
          .floating-shapes > div:nth-child(1) {
            width: 400px;
            height: 400px;
            top: -10%;
            left: -10%;
            animation-delay: 0s;
          }
          .floating-shapes > div:nth-child(2) {
            width: 300px;
            height: 300px;
            top: 60%;
            right: -5%;
            animation-delay: -5s;
          }
          .floating-shapes > div:nth-child(3) {
            width: 200px;
            height: 200px;
            bottom: 10%;
            left: 10%;
            animation-delay: -10s;
          }
          .floating-shapes > div:nth-child(4) {
            width: 250px;
            height: 250px;
            top: 20%;
            right: 20%;
            animation-delay: -15s;
          }
          @keyframes float-around {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(30px, -30px) rotate(90deg); }
            50% { transform: translate(0, 50px) rotate(180deg); }
            75% { transform: translate(-30px, 10px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          .hero-title {
            font-size: 4rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          }
          .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            max-width: 700px;
          }
          .features-section {
            background-color: #f8f9fa;
            padding: 6rem 0;
          }
          .section-heading {
            position: relative;
            display: inline-block;
            margin-bottom: 3rem;
            font-weight: 700;
          }
          .section-heading::after {
            content: '';
            position: absolute;
            width: 80px;
            height: 4px;
            background: linear-gradient(to right, #1a237e, #7986cb);
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
          }
          .feature-card {
            height: 100%;
            border: none;
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          }
          .feature-icon {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            position: relative;
            z-index: 1;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
          }
          .feature-icon::before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            z-index: -1;
          }
          .feature-icon svg {
            color: white;
            font-size: 1.6rem;
          }
          .feature-card h4 {
            margin-bottom: 1rem;
            font-weight: 600;
          }
          .cta-section {
            background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
            color: white;
            padding: 5rem 0;
            text-align: center;
          }
          .creative-display {
            position: relative;
            height: 400px;
            perspective: 1000px;
          }
          .paper-preview {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateY(15deg) rotateX(5deg);
            width: 90%;
            max-width: 400px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .paper-header {
            padding: 20px;
            background: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
          }
          .paper-title {
            text-align: center;
            color: #333;
            margin: 0;
            font-weight: 600;
          }
          .paper-body {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            color: #333;
          }
          .question-line {
            display: flex;
            height: 12px;
            background: #f0f0f0;
            margin-bottom: 5px;
            border-radius: 3px;
          }
          .question-line.short {
            width: 70%;
          }
          .question-line.medium {
            width: 85%;
          }
          .question-line.long {
            width: 100%;
          }
          .highlight-block {
            padding: 20px 25px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }
          .highlight-block:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.15);
          }
          .action-btn {
            border-radius: 30px;
            padding: 0.8rem 2.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          }
          .action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-pattern"></div>
        <div className="floating-shapes">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        
        <Container className="position-relative">
          <Row className="align-items-center">
            <Col lg={7} className="text-center text-lg-left mb-5 mb-lg-0">
              <div className="d-inline-block mb-4">
                <FaGraduationCap size={50} className="mb-3" />
              </div>
              <h1 className="hero-title">Create Question Papers Online</h1>
              <p className="hero-subtitle mb-5">
                A powerful platform that helps educators create professional assessment materials in minutes.
              </p>
              
              <div className="d-flex flex-column flex-md-row justify-content-center justify-content-lg-start">
                <Button 
                  tag={Link} 
                  to="/signin" 
                  color="light" 
                  size="lg"
                  className="action-btn mb-3 mb-md-0 mr-md-3"
                >
                  Sign In
                </Button>
                <Button 
                  tag={Link} 
                  to="/signup" 
                  color="info" 
                  outline
                  size="lg"
                  className="action-btn ml-0 ml-md-3"
                  style={{ borderColor: 'white', color: 'white' }}
                >
                  Create Account
                </Button>
              </div>
              
              <Row className="mt-5">
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="highlight-block text-center">
                    <FaClock size={24} className="mb-3" />
                    <h5>Time-Saving</h5>
                  </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="highlight-block text-center">
                    <FaBook size={24} className="mb-3" />
                    <h5>Comprehensive</h5>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="highlight-block text-center">
                    <FaTools size={24} className="mb-3" />
                    <h5>Customizable</h5>
                  </div>
                </Col>
              </Row>
            </Col>
            
            <Col lg={5} className="d-none d-lg-block">
              <div className="creative-display">
                <div className="paper-preview">
                  <div className="paper-header">
                    <h5 className="paper-title">QPG Sample Assessment</h5>
                  </div>
                  <div className="paper-body">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`question-line ${
                          i % 3 === 0 ? 'short' : i % 3 === 1 ? 'medium' : 'long'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-heading">Why Choose QPG?</h2>
          </div>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card shadow-sm">
                <CardBody className="text-center p-4">
                  <div 
                    className="feature-icon"
                    style={{ background: '#4caf50' }}
                  >
                    <FaBook />
                  </div>
                  <h4>Smart Question Bank</h4>
                  <p className="text-muted">
                    Build and organize your question repository with tags, categories, and difficulty levels.
                  </p>
                </CardBody>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card shadow-sm">
                <CardBody className="text-center p-4">
                  <div 
                    className="feature-icon"
                    style={{ background: '#2196f3' }}
                  >
                    <FaRocket />
                  </div>
                  <h4>Instant Generation</h4>
                  <p className="text-muted">
                    Create professionally formatted question papers in seconds with our intelligent algorithms.
                  </p>
                </CardBody>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card shadow-sm">
                <CardBody className="text-center p-4">
                  <div 
                    className="feature-icon"
                    style={{ background: '#f44336' }}
                  >
                    <FaShieldAlt />
                  </div>
                  <h4>Secure & Reliable</h4>
                  <p className="text-muted">
                    Your content is safe with our secure storage and reliable backup systems.
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Call to Action Section */}
      <section className="cta-section">
        <Container>
          <h2 className="mb-3">Ready to Transform Your Assessment Process?</h2>
          <p className="lead mb-5">
            Join thousands of educators who save hours each week using QPG
          </p>
          <Button
            tag={Link}
            to="/signup"
            color="light"
            size="lg"
            className="action-btn"
          >
            Get Started For Free
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default LandingComponent;