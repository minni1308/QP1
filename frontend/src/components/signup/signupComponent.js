import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Container,
  Alert,
  FormText,
} from "reactstrap";
import { baseUrl } from "../../url";
import { WaveTopBottomLoading } from "react-loadingg";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phno: "",
    password: "",
    rewrite: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimLeft() }));
  };

  const validateInputs = () => {
    const { name, email, phno, password, rewrite } = formData;

    if (!/^[A-Za-z0-9.]+@gmail\.com$/.test(email)) {
      alert("Please use a valid Gmail address.");
      return false;
    }

    if (!/\+?\d[\d -]{8,12}\d$/.test(phno)) {
      alert("Invalid phone number.");
      return false;
    }

    if (password !== rewrite) {
      alert("Passwords do not match.");
      return false;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,32}$/.test(
        password
      )
    ) {
      alert("Password must meet the required criteria.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const res = await fetch(baseUrl + "/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setFormData({
          name: "",
          email: "",
          phno: "",
          password: "",
          rewrite: "",
        });
        setSubmitted(true);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <WaveTopBottomLoading />;

  if (submitted) {
    return (
      <Container className="text-center mt-5">
        <h1>QP Generator</h1>
        <Alert color="success">
          <h4>Thanks for signing up!</h4>
          <p>
            Please verify your account using the link sent to your email
            address.
          </p>
          <Link to="/signin">Go to Login</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "2rem",
        marginTop: "5rem", 
        marginBottom: "12rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Sign up</h3>
      <p style={{ textAlign: "center", color: "gray", marginBottom: "2rem" }}>
        Sign up to continue
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInput}
            placeholder="Name"
            required
            style={{
              borderRadius: "4px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInput}
            placeholder="Email"
            required
            style={{
              borderRadius: "4px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="phno">Phone Number</Label>
          <Input
            name="phno"
            value={formData.phno}
            onChange={handleInput}
            placeholder="Phone Number"
            required
            style={{
              borderRadius: "4px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          />
        </FormGroup>
        <FormGroup>
  <Label for="password">Password</Label>
  <Input
    name="password"
    type="password"
    value={formData.password}
    onChange={handleInput}
    placeholder="Password"
    required
    style={{
      borderRadius: "4px",
      border: "1px solid #ccc",
      padding: "10px",
    }}
  />
  <FormText color="muted" style={{ marginTop: "0.5rem" }}>
    Password must be 8-32 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
  </FormText>
</FormGroup>
        <FormGroup>
          <Label for="rewrite">Re-enter Password</Label>
          <Input
            name="rewrite"
            type="password"
            value={formData.rewrite}
            onChange={handleInput}
            placeholder="Re-enter Password"
            required
            style={{
              borderRadius: "4px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          />
        </FormGroup>
        <FormGroup check style={{ marginBottom: "1rem" }}>
          <Label check>
            <Input type="checkbox" /> Remember me
          </Label>
        </FormGroup>
        <Button
          type="submit"
          color="primary"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            border: "none",
          }}
        >
          Sign up
        </Button>
      </Form>
      <FormText style={{ textAlign: "center", marginTop: "1rem" }}>
        Already have an account? <Link to="/signin">Sign in</Link>
      </FormText>
    </Container>
  );
};

export default Signup;