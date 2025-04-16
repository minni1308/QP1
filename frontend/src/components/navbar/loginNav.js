import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";

const LoginNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();

  // Style objects for better organization
  const styles = {
    navbar: {
      width: "100vw",
      position: "sticky",
      top: 0,
      zIndex: 1,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff",
    },
    brand: {
      color: "#2c3e50",
      fontSize: "1.5rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    // We add a new style that pushes the nav to the right
    navRight: {
      marginLeft: "auto",     // This ensures the items float to the right
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    navItem: {
      margin: "0 5px",
    },
    navLink: (isActive) => ({
      color: isActive ? "#ffffff" : "#2c3e50",
      backgroundColor: isActive ? "#3498db" : "transparent",
      padding: "0.5rem 1.2rem",
      borderRadius: "6px",
      transition: "all 0.3s ease",
      fontWeight: "500",
      textTransform: "uppercase",
      fontSize: "0.9rem",
      letterSpacing: "0.5px",
      border: isActive ? "none" : "2px solid #3498db",
      '&:hover': {
        backgroundColor: "#3498db",
        color: "#ffffff",
        transform: "translateY(-2px)",
      },
    }),
    profileLink: {
      padding: "0.5rem",
      marginLeft: "10px",
    },
    profileImage: {
      borderRadius: "50%",
      border: "2px solid #3498db",
      padding: "2px",
      transition: "all 0.3s ease",
      '&:hover': {
        transform: "scale(1.1)",
      },
    },
  };

  return (
    <div style={styles.navbar}>
      <Navbar expand="lg" className="px-4 py-2">
        <NavbarBrand tag={Link} to="/teacher/landing" style={styles.brand}>
          <img
            src="/favicon.ico"
            alt="icon"
            width={50}
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          />
          <span>QP Generator</span>
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          {/* Apply our custom right-align style here */}
          <Nav navbar style={styles.navRight}>
            {[
              { path: "/teacher/insert", text: "Insert" },
              { path: "/teacher/generate", text: "Generate" },
              { path: "/teacher/edit", text: "Edit" },
            ].map((item) => (
              <NavItem key={item.path} style={styles.navItem}>
                <NavLink
                  tag={Link}
                  to={item.path}
                  style={styles.navLink(location.pathname === item.path)}
                >
                  {item.text}
                </NavLink>
              </NavItem>
            ))}
            <NavItem>
              <NavLink tag={Link} to="/teacher/profile" style={styles.profileLink}>
                <img
                  src="/img/user.png"
                  alt="user"
                  width={40}
                  style={styles.profileImage}
                />
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default LoginNav;
