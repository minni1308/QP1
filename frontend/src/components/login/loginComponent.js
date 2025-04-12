import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UncontrolledAlert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Container,
} from "reactstrap";
import { baseUrl } from "../../url";
import localStorage from "local-storage";
import { WaveTopBottomLoading } from "react-loadingg";

const Login = () => {
  const navigate = useNavigate();

  const [cred, setCred] = useState({
    username: "",
    password: "",
  });

  const [verify, setVerify] = useState(false);
  const [failure, setFailure] = useState(false);
  const [success, setSuccess] = useState(localStorage.get("token") || false);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => {
    setCred((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(baseUrl + "/teacher/login", {
      method: "POST",
      body: JSON.stringify(cred),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status === "VERIFY") {
      setVerify(true);
      setIsLoading(false);
    } else if (result.status) {
      localStorage.set("token", result.token);
      localStorage.set("user", result.user);
      setSuccess(true);
      setIsLoading(false);
      window.location.reload(); // Preserving the original behavior
    } else {
      setFailure(true);
      setErr(result.err);
      setIsLoading(false);
    }
  };

  if (isLoading) return <WaveTopBottomLoading />;

  if (success) {
    navigate("/teacher/landing");
    return null;
  }

  return (
    <Container
      style={{
        maxWidth: "400px",
        margin: "auto",
        marginTop: "10%",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          marginBottom: "1.5rem",
          fontSize: "1.8rem",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        Login
      </h3>
      <Form onSubmit={handleSubmit}>
        {verify && (
          <UncontrolledAlert>
            Please complete the verification process as mentioned in the email
            forwarded to you during sign up.
          </UncontrolledAlert>
        )}
        {failure && (
          <UncontrolledAlert color="danger">{err}</UncontrolledAlert>
        )}
        <FormGroup>
          <Label
            for="email"
            style={{
              //fontWeight: "bold",
              fontSize: "1rem",
              color: "#333",
              marginBottom: "0.5rem",
              display: "block",
              textAlign: "left",
            }}
          >
            Email address
          </Label>
          <Input
            type="text"
            name="username"
            value={cred.username}
            onChange={handleInput}
            placeholder="Enter email"
            autoComplete="off"
            required
            style={{
              borderRadius: "6px",
              border: "1px solid #ccc",
              padding: "12px",
              fontSize: "1rem",
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label
            for="password"
            style={{
              //fontWeight: "bold",
              fontSize: "1rem",
              color: "#333",
              marginBottom: "0.5rem",
              display: "block",
              textAlign: "left",
            }}
          >
            Password
          </Label>
          <Input
            type="password"
            name="password"
            value={cred.password}
            onChange={handleInput}
            placeholder="Password"
            required
            style={{
              borderRadius: "6px",
              border: "1px solid #ccc",
              padding: "12px",
              fontSize: "1rem",
            }}
          />
          <FormText
            color="muted"
            style={{
              marginTop: "0.5rem",
              fontSize: "0.9rem",
              textAlign: "left",
            }}
          >
            Forget Password?{" "}
            <Link to="/forgot" style={{ textDecoration: "underline" }}>
              Click here
            </Link>
          </FormText>
        </FormGroup>
        <Button
          type="submit"
          color="primary"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "#007bff",
            border: "none",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;