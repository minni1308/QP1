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
} from "reactstrap";
import { WaveTopBottomLoading } from "react-loadingg";
import localStorage from "local-storage";
import { getProfile, updateProfile, postLogout } from "./ActionCreators";

// ✅ Reusable input field
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
}) => (
  <FormGroup>
    <Label for={name}>{label}</Label>
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
    />
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

    if (isLoading) return <WaveTopBottomLoading />;

    const data = isDisabled ? user : updated;

    return (
      <Form
        onSubmit={isDisabled ? undefined : this.handleSubmit}
        style={{ margin: "2% 7%" }}
      >
        <h3 style={{ color: "blue", marginLeft: "30vw" }}>Profile</h3>

        <ProfileField
          label="Name"
          name="name"
          value={data.name}
          onChange={this.handleInput}
          disabled={isDisabled}
        />

        <ProfileField
          label="Email"
          name="username"
          type="email"
          value={data.username}
          onChange={this.handleInput}
          disabled={isDisabled}
          pattern="^[A-Za-z0-9.]+@bvrit\.ac\.in$"
          tooltip="Please use your college email ID"
        />

        <ProfileField
          label="Phone Number"
          name="phno"
          value={data.phno}
          onChange={this.handleInput}
          disabled={isDisabled}
          pattern="\+?\d[\d -]{8,12}\d$"
          tooltip="Please enter a valid phone number"
        />

        <Row style={{ marginLeft: "1.3em" }}>
          {isDisabled ? (
            <>
              <Col xs={6}>
                <Button color="primary" size="sm" onClick={this.toggleEdit}>
                  Update
                </Button>
              </Col>
              <Col xs={6}>
                <Button color="success" size="sm" onClick={postLogout}>
                  Logout
                </Button>
              </Col>
            </>
          ) : (
            <>
              <Col xs={6}>
                <Button role="submit" color="success" size="sm">
                  Save
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  size="sm"
                  color="white"
                  style={{ border: "1px solid" }}
                  onClick={this.toggleEdit}
                >
                  Cancel
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Form>
    );
  }
}

export default Profile;
