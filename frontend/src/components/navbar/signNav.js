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

const SignNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
      <Navbar color="light" light expand="md" style={{ padding: "0.5rem 1rem" }}>
        <Container>
          {/* Brand on the left */}
          <NavbarBrand
            tag={Link}
            to="/home"
            style={{
              color: "#333",
              fontWeight: "bold",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/favicon.ico"
              alt="icon"
              width={40}
              style={{ marginRight: "0.5rem" }}
            />
            QP Generator
          </NavbarBrand>

          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={isOpen} navbar className="justify-content-md-end">
            {/* 
              On mobile (under md):
                - flex-column: stack items vertically
                - align-items-center: center them horizontally
              On md+ screens:
                - flex-md-row: place them in a row
                - 'justify-content-md-end': align to right
            */}
            <Nav
              navbar
              className="
                w-100
                flex-column flex-md-row
                align-items-center
                justify-content-center justify-content-md-end
              "
            >
              {/* Login Button */}
              <NavItem
                className="mb-2 mb-md-0 mx-auto mx-md-0"
                // 'mx-auto' centers item on small screens
              >
                <Button
                  tag={Link}
                  to="/signin"
                  color="primary"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: "#007bff",
                    border: "none",
                    minWidth: "100px",
                    marginRight: "1rem", // extra horizontal space for md+ screens
                  }}
                  className="mb-2 mb-md-0" // vertical spacing on small screens
                >
                  Login
                </Button>
              </NavItem>

              {/* Signup Button */}
              <NavItem className="mx-auto mx-md-0">
                <Button
                  tag={Link}
                  to="/signup"
                  color="primary"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: "#007bff",
                    border: "none",
                    minWidth: "100px",
                  }}
                >
                  Signup
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
