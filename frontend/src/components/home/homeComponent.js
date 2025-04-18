import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button
} from "reactstrap";
import { FaBookOpen, FaRocket, FaLock, FaGraduationCap, FaClock } from "react-icons/fa";

const HomeComponent = () => {
  return (
    <div>
      {/* Hero Section with Animated Background */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "2rem 0"
        }}
      >
        {/* Animated circles in background */}
        <div className="animated-background">
          <style>
            {`
              .animated-background {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
              }
              .circle {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.05);
                animation: float 15s infinite ease-in-out;
              }
              @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); }
                33% { transform: translate(30px, -50px) rotate(120deg); }
                66% { transform: translate(-20px, 20px) rotate(240deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
              }
            `}
          </style>
          <div className="circle" style={{ width: "300px", height: "300px", top: "10%", left: "5%", animationDelay: "0s" }} />
          <div className="circle" style={{ width: "200px", height: "200px", top: "60%", right: "10%", animationDelay: "-5s" }} />
          <div className="circle" style={{ width: "150px", height: "150px", top: "30%", right: "20%", animationDelay: "-10s" }} />
        </div>

        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-left mb-5 mb-lg-0">
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="d-inline-block mb-4 p-3" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "50%" }}>
                  <FaGraduationCap size={50} color="white" />
                </div>
                <h1 
                  className="display-4 mb-3 font-weight-bold"
                  style={{ 
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                    lineHeight: "1.2"
                  }}
                >
                  Create Professional Question Papers in Minutes
                </h1>
                <p 
                  className="lead mb-5"
                  style={{ 
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "1.25rem",
                    lineHeight: "1.6",
                    maxWidth: "600px",
                    margin: "0 auto"
                  }}
                >
                  Empower your teaching with our intelligent question paper generator. 
                  Design, customize, and generate professional assessment papers effortlessly.
                </p>
                <div className="d-flex justify-content-center justify-content-lg-start">
                  <Button
                    tag={Link}
                    to="/signin"
                    color="light"
                    size="lg"
                    className="mr-3 px-4"
                    style={{
                      borderRadius: "30px",
                      padding: "0.8rem 2rem",
                      fontWeight: "600",
                      boxShadow: "0 4px 14px 0 rgba(0,0,0,0.25)",
                      marginRight: "1rem"
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    tag={Link}
                    to="/signup"
                    color="primary"
                    size="lg"
                    outline
                    className="px-4"
                    style={{
                      borderRadius: "30px",
                      borderColor: "white",
                      color: "white",
                      padding: "0.8rem 2rem",
                      fontWeight: "600"
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div 
                style={{ 
                  position: "relative",
                  zIndex: 2,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  padding: "2rem",
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="text-center text-white mb-4">
                  <FaClock size={30} className="mb-3" />
                  <h3 className="h5 mb-0">Time-Saving Features</h3>
                </div>
                <Row>
                  <Col xs={6} className="mb-4">
                    <div className="text-center text-white p-3" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }}>
                      <h4 className="h6 mb-2">Smart Templates</h4>
                      <small>Ready-to-use formats</small>
                    </div>
                  </Col>
                  <Col xs={6} className="mb-4">
                    <div className="text-center text-white p-3" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }}>
                      <h4 className="h6 mb-2">Auto Format</h4>
                      <small>Professional layout</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center text-white p-3" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }}>
                      <h4 className="h6 mb-2">Question Bank</h4>
                      <small>Organized library</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center text-white p-3" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px" }}>
                      <h4 className="h6 mb-2">Quick Export</h4>
                      <small>Multiple formats</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div style={{ padding: "5rem 0", backgroundColor: "#f8f9fa" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="mb-4" style={{ position: "relative", display: "inline-block" }}>
              Why Choose QPG?
              <div 
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  background: "linear-gradient(90deg, #1a237e 0%, #283593 100%)"
                }}
              />
            </h2>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card 
                className="h-100 border-0 shadow-sm"
                style={{
                  transition: "all 0.3s ease",
                  borderRadius: "15px",
                  overflow: "hidden"
                }}
              >
                <div className="card-wave" style={{ height: "100px", background: "#4caf50" }} />
                <CardBody className="position-relative pt-5">
                  <div 
                    className="feature-icon"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      background: "#4caf50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: "-35px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)"
                    }}
                  >
                    <FaBookOpen color="white" size={30} />
                  </div>
                  <h4 className="text-center mb-3">Smart Question Bank</h4>
                  <p className="text-muted text-center">
                    Build your personalized question repository with intelligent categorization, tagging, and difficulty levels.
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card 
                className="h-100 border-0 shadow-sm"
                style={{
                  transition: "all 0.3s ease",
                  borderRadius: "15px",
                  overflow: "hidden"
                }}
              >
                <div className="card-wave" style={{ height: "100px", background: "#2196f3" }} />
                <CardBody className="position-relative pt-5">
                  <div 
                    className="feature-icon"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      background: "#2196f3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: "-35px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)"
                    }}
                  >
                    <FaRocket color="white" size={30} />
                  </div>
                  <h4 className="text-center mb-3">Lightning Fast Creation</h4>
                  <p className="text-muted text-center">
                    Create comprehensive question papers in minutes, not hours. Save time with our intelligent paper generation system.
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card 
                className="h-100 border-0 shadow-sm"
                style={{
                  transition: "all 0.3s ease",
                  borderRadius: "15px",
                  overflow: "hidden"
                }}
              >
                <div className="card-wave" style={{ height: "100px", background: "#f44336" }} />
                <CardBody className="position-relative pt-5">
                  <div 
                    className="feature-icon"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      background: "#f44336",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: "-35px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: "0 4px 20px rgba(244, 67, 54, 0.3)"
                    }}
                  >
                    <FaLock color="white" size={30} />
                  </div>
                  <h4 className="text-center mb-3">Complete Control</h4>
                  <p className="text-muted text-center">
                    Customize every aspect of your papers - from question selection to formatting, all while keeping your content secure.
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action Section */}
      <div 
        style={{ 
          padding: "5rem 0",
          background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
          color: "white",
          textAlign: "center"
        }}
      >
        <Container>
          <h2 className="mb-4">Ready to Transform Your Assessment Process?</h2>
          <p className="lead mb-5" style={{ maxWidth: "700px", margin: "0 auto", opacity: 0.9 }}>
            Join educators worldwide who save hours every week using QPG
          </p>
          <Button
            tag={Link}
            to="/signup"
            color="light"
            size="lg"
            style={{
              borderRadius: "30px",
              padding: "1rem 3rem",
              fontWeight: "600",
              boxShadow: "0 4px 14px 0 rgba(0,0,0,0.25)"
            }}
          >
            Get Started For Free
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default HomeComponent;