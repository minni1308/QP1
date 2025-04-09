import React from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import localStorage from "local-storage";
import { Link } from "react-router-dom";

const SignNav = () => {
  if (localStorage.get("token")) return null;

  return (
    <div style={{ width: "100vw", position: "sticky", top: 0, zIndex: 10 }}>
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={Link} to="/home" style={{ color: "grey" }}>
          <img src="/favicon.ico" alt="icon" width={50} /> QP Generator
        </NavbarBrand>

        <Nav className="ms-auto" navbar style={{ gap: "1.5rem" }}>
          <NavItem>
            <NavLink tag={Link} to="/signin" style={{ color: "grey" }}>
              Login{" "}
              <img
                src="/img/login.png"
                alt="login"
                style={{ display: "inline", width: 20 }}
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/signup" style={{ color: "grey" }}>
              Signup{" "}
              <img
                src="/img/logout.png"
                alt="signup"
                style={{ display: "inline", width: 20 }}
              />
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};

export default SignNav;
