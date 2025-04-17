import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
} from "reactstrap";
import "./index.css";
import { baseUrl } from "../../url";
import { WaveTopBottomLoading } from "react-loadingg";
import { Link } from "react-router-dom";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => setEmail(e.target.value);

  const toggle = () => setStatus(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validate email ends with '@gmail.com'
    if (!email.endsWith("@gmail.com")) {
      setMessage("Only @gmail.com emails are allowed");
      setStatus(true);
      return;
    }

    verifyEmail();
  };

  const verifyEmail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(baseUrl + "/teacher/forgot/check", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.success) {
        setMessage(
          "Please Reset Your Password using the link forwarded to your Mail"
        );
      } else {
        setMessage("Cannot Find Email given !!!!");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    } finally {
      setIsLoading(false);
      setEmail("");
      setStatus(true);
    }
  };

  if (isLoading) return <WaveTopBottomLoading />;

  return (
    <Container
      style={{
        maxWidth: "400px",
        margin: "auto",
        marginTop: "10vh",
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
        Forgot Password
      </h3>
      <Form onSubmit={handleSubmit}>
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
            Email Address
          </Label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleInput}
            required
            placeholder="Enter Registered Email"
            autoComplete="off"
            style={{
              borderRadius: "6px",
              border: "1px solid #ccc",
              padding: "12px",
              fontSize: "1rem",
            }}
          />
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
          Submit
        </Button>
      </Form>

      <Modal isOpen={status} toggle={toggle}>
        <ModalHeader toggle={toggle}>Verification</ModalHeader>
        <ModalBody style={{ fontSize: "1rem", color: "#333" }}>
          {message}
        </ModalBody>
        <ModalFooter>
          {message === "Cannot Find Email given !!!!" ||
          message === "Only @gmail.com emails are allowed" ? (
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          ) : (
            <Link to="/home" className="btn btn-primary">
              Okay
            </Link>
          )}
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Forgot;