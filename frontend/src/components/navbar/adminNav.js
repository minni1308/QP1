import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { postLogout } from "../ActionCreators";
import { Link } from "react-router-dom";

const AdminLoginNav = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div style={{ width: "100vw" }}>
      <Navbar color="light" light expand="lg">
        <NavbarBrand tag={Link} to="/home" style={{ color: "black" }}>
          <img src="/favicon.ico" alt="icon" width={60} /> {"  "}
          QP Generator
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/department">
                Department
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/subject">
                Subjects
              </NavLink>
            </NavItem>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {user?.user || "Admin"}
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem tag={Link} to="/profile">
                  Profile
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={postLogout}>Log Out</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AdminLoginNav;
