// src/components/SignNav.js
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarToggler,
  Collapse,
  Button,
  Container,
} from "reactstrap";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const SignNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div style={{ 
      position: "sticky", 
      top: 0, 
      zIndex: 100,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    }}>
      <Navbar 
        expand="md" 
        light
        style={{ 
          background: "linear-gradient(to right, #ffffff, #f8f9fa)",
          padding: "0.8rem 1.5rem",
        }}
      >
        <Container fluid className="d-flex">
          {/* Brand on the left */}
          <NavbarBrand
            tag={Link}
            to="/home"
            className="py-2 me-auto"
          >
            <svg width="42" height="42" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.7rem" }}>
              <circle cx="256" cy="256" r="248" fill="#1e3c72" stroke="#ffffff" stroke-width="16"/>
              <path d="M160 96h128l64 64v256H160V96z" fill="white"/>
              <path d="M288 96v64h64" fill="#2a5298"/>
              <rect x="192" y="200" width="128" height="12" rx="6" fill="white" opacity="0.8"/>
              <rect x="192" y="240" width="128" height="12" rx="6" fill="white" opacity="0.8"/>
              <rect x="192" y="280" width="96" height="12" rx="6" fill="white" opacity="0.8"/>
              <path d="M368 256c0-8.8-1.8-17.2-5-24.8l28.5-28.5-22.6-22.6-28.5 28.5c-7.6-3.2-16-5-24.8-5s-17.2 1.8-24.8 5l-28.5-28.5-22.6 22.6 28.5 28.5c-3.2 7.6-5 16-5 24.8s1.8 17.2 5 24.8l-28.5 28.5 22.6 22.6 28.5-28.5c7.6 3.2 16 5 24.8 5s17.2-1.8 24.8-5l28.5 28.5 22.6-22.6-28.5-28.5c3.2-7.6 5-16 5-24.8z" fill="#2a5298"/>
              <circle cx="368" cy="256" r="24" fill="white"/>
            </svg>
            <span>QP Generator</span>
          </NavbarBrand>

          <NavbarToggler onClick={toggle} className="border-0" />

          <Collapse isOpen={isOpen} navbar className="flex-grow-0">
            <Nav
              navbar
              className="d-flex flex-row align-items-center"
            >
              <NavItem style={{ marginRight: "20px" }}>
                <Button
                  tag={Link}
                  to="/signin"
                  color="primary"
                  style={{
                    borderRadius: "6px",
                    padding: "0.5rem 1.5rem",
                    background: "linear-gradient(45deg, #1e3c72, #2a5298)",
                    border: "none",
                    minWidth: "120px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease"
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaSignInAlt size={14} style={{ marginRight: "10px" }} />
                  Login
                </Button>
              </NavItem>

              <NavItem>
                <Button
                  tag={Link}
                  to="/signup"
                  color="primary"
                  style={{
                    borderRadius: "6px",
                    padding: "0.5rem 1.5rem",
                    background: "linear-gradient(45deg, #1e3c72, #2a5298)",
                    border: "none",
                    minWidth: "120px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease"
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaUserPlus size={14} style={{ marginRight: "10px" }} />
                  Sign Up
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default SignNav;
