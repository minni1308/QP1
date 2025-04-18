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
  Container
} from "reactstrap";
import { postLogout } from "../ActionCreators";
import { Link, useLocation } from "react-router-dom";
import { 
  FaUserCog, 
  FaSignOutAlt, 
  FaUsers, 
  FaBook, 
  FaUserGraduate, 
  FaUserCircle,
  FaHome,
  FaUser
} from "react-icons/fa";

const AdminLoginNav = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ 
      position: "sticky", 
      top: 0, 
      zIndex: 100,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    }}>
      <Navbar 
        expand="lg" 
        light
        style={{ 
          background: "linear-gradient(to right, #ffffff, #f8f9fa)",
          padding: "0.8rem 1.5rem",
        }}
      >
        <Container fluid className="d-flex">
          <NavbarBrand 
            tag={Link} 
            to="/admin/landing"
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
            <Nav className="d-flex flex-row align-items-center" navbar>
              <NavItem className="mx-2">
                <NavLink 
                  tag={Link} 
                  to="/admin/home" 
                  className={`px-3 py-2 rounded-pill ${isActive('/admin/home') ? 'active' : ''}`}
                  style={{
                    color: isActive('/admin/home') ? '#fff' : '#1e3c72',
                    backgroundColor: isActive('/admin/home') ? '#1e3c72' : 'transparent',
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  <FaHome size={14} />
                  <span>Dashboard</span>
                </NavLink>
              </NavItem>
            
              <NavItem className="mx-2">
                <NavLink 
                  tag={Link} 
                  to="/admin/department" 
                  className={`px-3 py-2 rounded-pill ${isActive('/admin/department') ? 'active' : ''}`}
                  style={{
                    color: isActive('/admin/department') ? '#fff' : '#1e3c72',
                    backgroundColor: isActive('/admin/department') ? '#1e3c72' : 'transparent',
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  <FaUsers size={14} />
                  <span>Departments</span>
                </NavLink>
              </NavItem>
              
              <NavItem className="mx-2">
                <NavLink 
                  tag={Link} 
                  to="/admin/subject" 
                  className={`px-3 py-2 rounded-pill ${isActive('/admin/subject') ? 'active' : ''}`}
                  style={{
                    color: isActive('/admin/subject') ? '#fff' : '#1e3c72',
                    backgroundColor: isActive('/admin/subject') ? '#1e3c72' : 'transparent',
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  <FaBook size={14} />
                  <span>Subjects</span>
                </NavLink>
              </NavItem>
              
              <NavItem className="mx-2">
                <NavLink 
                  tag={Link} 
                  to="/admin/teacher-subjects" 
                  className={`px-3 py-2 rounded-pill ${isActive('/admin/teacher-subjects') ? 'active' : ''}`}
                  style={{
                    color: isActive('/admin/teacher-subjects') ? '#fff' : '#1e3c72',
                    backgroundColor: isActive('/admin/teacher-subjects') ? '#1e3c72' : 'transparent',
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  <FaUserGraduate size={14} />
                  <span>Teacher Subjects</span>
                </NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar className="ms-3">
                <DropdownToggle 
                  nav 
                  className="p-0" 
                  style={{ 
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div 
                      style={{ 
                        width: "38px", 
                        height: "38px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(45deg, #1e3c72, #2a5298)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: "#fff",
                        marginRight: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                      }}
                    >
                      <FaUserCircle size={24} />
                    </div>
                    <span 
                      style={{ 
                        fontWeight: "500", 
                        fontSize: "0.95rem", 
                        color: "#1e3c72",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {user?.name || user?.username || "Admin"}
                    </span>
                  </div>
                </DropdownToggle>
                
                <DropdownMenu end 
                  style={{ 
                    borderRadius: "8px", 
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    border: "none",
                    marginTop: "10px",
                    padding: "0.5rem"
                  }}
                >
                  <DropdownItem 
                    tag={Link} 
                    to="/admin/profile"
                    style={{
                      borderRadius: "6px",
                      transition: "background-color 0.2s ease"
                    }}
                    className="d-flex align-items-center py-2"
                  >
                    <FaUser className="me-2 text-primary" />
                    Profile
                  </DropdownItem>
                  
                  <DropdownItem divider className="my-1" />
                  
                  <DropdownItem 
                    onClick={postLogout}
                    style={{
                      borderRadius: "6px",
                      transition: "background-color 0.2s ease",
                      color: "#dc3545"
                    }}
                    className="d-flex align-items-center py-2"
                  >
                    <FaSignOutAlt className="me-2" />
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AdminLoginNav;
