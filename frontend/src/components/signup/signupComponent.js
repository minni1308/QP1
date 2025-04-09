import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
  Container,
  Alert,
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
    <Form onSubmit={handleSubmit} style={{ padding: "2%", margin: "auto" }}>
      <h3 style={{ color: "blue", textAlign: "center" }}>Sign Up</h3>
      <FormGroup>
        <Label for="name">Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleInput}
          placeholder="Name"
          required
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
        />
      </FormGroup>

      <Row>
        <Col sm={8}>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInput}
              placeholder="Password"
              required
            />
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
            />
          </FormGroup>
        </Col>
        <Col sm={4}>
          <ol>
            <li>At least one digit [0–9]</li>
            <li>One lowercase letter [a–z]</li>
            <li>One uppercase letter [A–Z]</li>
            <li>One special character</li>
            <li>8–32 characters long</li>
          </ol>
        </Col>
      </Row>

      <FormText className="mb-3">
        Already have an account? <Link to="/signin">Login</Link>
      </FormText>

      <Button type="submit" color="success" outline style={{ marginLeft: "30vw" }}>
        Sign Up
      </Button>
    </Form>
  );
};

export default Signup;
