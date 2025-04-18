import React, { Component } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
  Card,
  CardBody,
  CardTitle,
  Container
} from "reactstrap";
import { WaveTopBottomLoading } from "react-loadingg";
import localStorage from "local-storage";
import { getProfile, updateProfile, postLogout } from "./ActionCreators";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaSignOutAlt } from "react-icons/fa";

// ✅ Reusable input field with modern styling
const ProfileField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  tooltip,
  tooltipTarget,
  pattern,
  required = true,
  icon: Icon,
}) => (
  <FormGroup className="mb-4">
    <Label 
      for={name}
      className="text-secondary mb-2"
      style={{ fontSize: "0.9rem", fontWeight: "500" }}
    >
      {label}
    </Label>
    <div className="position-relative">
      <div 
        className="position-absolute d-flex align-items-center justify-content-center"
        style={{
          left: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#1e3c72",
          opacity: disabled ? 0.5 : 0.8
        }}
      >
        <Icon size={18} />
      </div>
      <Input
        type={type}
        name={name}
        id={tooltipTarget || name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        pattern={pattern}
        required={required}
        className="form-control-lg"
        style={{
          paddingLeft: "45px",
          height: "50px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          fontSize: "0.95rem",
          backgroundColor: disabled ? "#f8f9fa" : "white",
          transition: "all 0.3s ease"
        }}
      />
    </div>
    {tooltip && (
      <UncontrolledTooltip placement="left" target={tooltipTarget || name}>
        {tooltip}
      </UncontrolledTooltip>
    )}
  </FormGroup>
);

// ✅ Email & Phone Validators
const isValidEmail = (email) => /^[A-Za-z0-9.]+@bvrit\.ac\.in$/.test(email);
const isValidPhone = (phno) => /\+?\d[\d -]{8,12}\d$/.test(phno);

class Profile extends Component {
  state = {
    user: { name: "", phno: "", username: "" },
    updated: { name: "", phno: "", username: "" },
    isLoading: false,
    isDisabled: true,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    getProfile()
      .then((res) => res.json())
      .then((user) => {
        this.setState({ user, updated: user, isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false });
        alert("Cannot Connect to Server!!! Logging Out...");
        localStorage.clear();
        window.location.reload();
      });
  }

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      updated: { ...prev.updated, [name]: value.trimLeft() },
    }));
  };

  toggleEdit = () => {
    this.setState((prev) => ({
      isDisabled: !prev.isDisabled,
      updated: prev.user,
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { updated, user } = this.state;

    if (!isValidEmail(updated.username)) {
      alert("Please use college mail ID.");
      return this.setState({
        updated: { ...updated, username: "" },
      });
    }

    if (!isValidPhone(updated.phno)) {
      alert("Invalid Phone Number");
      return this.setState({
        updated: { ...updated, phno: "" },
      });
    }

    this.setState({ isLoading: true });
    updateProfile(updated)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const emailChanged = user.username !== updated.username;
          if (emailChanged) {
            alert("Email changed. Logging out...");
            localStorage.clear();
            window.location.reload();
          } else {
            this.setState({
              user: res.user,
              updated: res.user,
              isDisabled: true,
              isLoading: false,
            });
          }
        } else {
          alert("Invalid email or failed update.");
          this.setState({ isLoading: false });
        }
      })
      .catch(() => {
        alert("Update failed. Logging out...");
        localStorage.clear();
        window.location.reload();
      });
  };

  render() {
    const { user, updated, isDisabled, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <WaveTopBottomLoading />
        </div>
      );
    }

    const data = isDisabled ? user : updated;

    return (
      <Container>
        <Row className="justify-content-center" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card 
              className="border-0" 
              style={{ 
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                borderRadius: "12px"
              }}
            >
              <CardBody className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "linear-gradient(45deg, #1e3c72, #2a5298)",
                      boxShadow: "0 4px 15px rgba(30,60,114,0.2)"
                    }}
                  >
                    <FaUser size={35} color="white" />
                  </div>
                  <CardTitle tag="h2" className="mb-1" style={{ color: "#1e3c72", fontWeight: "600" }}>
                    Profile Settings
                  </CardTitle>
                  <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
                    Manage your account information
                  </p>
                </div>

                <Form onSubmit={isDisabled ? undefined : this.handleSubmit}>
                  <ProfileField
                    label="Full Name"
                    name="name"
                    value={data.name}
                    onChange={this.handleInput}
                    disabled={isDisabled}
                    icon={FaUser}
                    placeholder="Enter your full name"
                  />

                  <ProfileField
                    label="Email Address"
                    name="username"
                    type="email"
                    value={data.username}
                    onChange={this.handleInput}
                    disabled={isDisabled}
                    pattern="^[A-Za-z0-9.]+@bvrit\.ac\.in$"
                    tooltip="Please use your college email ID"
                    icon={FaEnvelope}
                    placeholder="your.email@bvrit.ac.in"
                  />

                  <ProfileField
                    label="Phone Number"
                    name="phno"
                    value={data.phno}
                    onChange={this.handleInput}
                    disabled={isDisabled}
                    pattern="\+?\d[\d -]{8,12}\d$"
                    tooltip="Please enter a valid phone number"
                    icon={FaPhone}
                    placeholder="Enter your phone number"
                  />

                  <Row className="mt-4">
                    {isDisabled ? (
                      <Col className="d-flex justify-content-center" style={{ gap: "2rem" }}>
                        <Button
                          color="secondary"
                          size="md"
                          onClick={postLogout}
                          style={{
                            borderRadius: "6px",
                            padding: "0.5rem 1.5rem",
                            background: "#dc3545",
                            border: "none",
                            boxShadow: "0 2px 6px rgba(220,53,69,0.2)",
                            transition: "all 0.3s ease",
                            fontSize: "0.9rem",
                            minWidth: "140px"
                          }}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <FaSignOutAlt size={14} className="me-2" />
                          Logout
                        </Button>
                        <Button
                          color="primary"
                          size="md"
                          onClick={this.toggleEdit}
                          style={{
                            borderRadius: "6px",
                            padding: "0.5rem 1.5rem",
                            background: "linear-gradient(45deg, #1e3c72, #2a5298)",
                            border: "none",
                            boxShadow: "0 2px 6px rgba(30,60,114,0.2)",
                            transition: "all 0.3s ease",
                            fontSize: "0.9rem",
                            minWidth: "140px"
                          }}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <FaEdit size={14} className="me-2" />
                          Edit Profile
                        </Button>
                      </Col>
                    ) : (
                      <Col className="d-flex justify-content-center" style={{ gap: "2rem" }}>
                        <Button
                          color="secondary"
                          size="md"
                          onClick={this.toggleEdit}
                          style={{
                            borderRadius: "6px",
                            padding: "0.5rem 1.5rem",
                            background: "#6c757d",
                            border: "none",
                            boxShadow: "0 2px 6px rgba(108,117,125,0.2)",
                            transition: "all 0.3s ease",
                            fontSize: "0.9rem",
                            minWidth: "140px"
                          }}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <FaTimes size={14} className="me-2" />
                          Cancel
                        </Button>
                        <Button
                          color="success"
                          size="md"
                          type="submit"
                          style={{
                            borderRadius: "6px",
                            padding: "0.5rem 1.5rem",
                            background: "linear-gradient(45deg, #1e3c72, #2a5298)",
                            border: "none",
                            boxShadow: "0 2px 6px rgba(30,60,114,0.2)",
                            transition: "all 0.3s ease",
                            fontSize: "0.9rem",
                            minWidth: "140px"
                          }}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <FaSave size={14} className="me-2" />
                          Save Changes
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Profile;
