// verifyComponent.js
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
    <div>
      <Form onSubmit={handleSubmit} style={{ margin: "10vh 10%" }}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleInput}
            required
            placeholder="Enter Registered Email"
            autoComplete="off"
          />
        </FormGroup>
        <Button
          type="submit"
          size="md"
          outline
          style={{ marginTop: "5%", marginLeft: "20vw", marginBottom: "5%" }}
          color="danger"
        >
          Submit
        </Button>
      </Form>

      <Modal isOpen={status} toggle={toggle}>
        <ModalHeader toggle={toggle}>Verification</ModalHeader>
        <ModalBody>{message}</ModalBody>
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
    </div>
  );
};

export default Forgot;
