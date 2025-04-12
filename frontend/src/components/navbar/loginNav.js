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
import { Link } from "react-router-dom";

const LoginNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div style={{ width: "100vw", position: "sticky", top: 0, zIndex: 1 }}>
      <Navbar color="light" light expand="lg">
        <NavbarBrand tag={Link} to="/home" style={{ color: "black" }}>
          <img src="/favicon.ico" alt="icon" width={50} /> QP Generator
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/teacher/insert" style={{ color: "gray" }}>
                Insert
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/teacher/generate" style={{ color: "gray" }}>
                Generate
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/teacher/edit" style={{ color: "gray" }}>
                Edit
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/teacher/profile" style={{ padding: "3%" }}>
                <img
                  src="/img/user.png"
                  alt="user"
                  width={40}
                  style={{ borderRadius: "50%" }}
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
