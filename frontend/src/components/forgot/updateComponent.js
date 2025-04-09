import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { baseUrl } from "../../url";
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
  Row,
  Col,
} from "reactstrap";
import "./index.css";
import { WaveTopBottomLoading } from "react-loadingg";

const Update = () => {
  const { userId } = useParams(); // get userId from route
  const [password, setPassword] = useState("");
  const [rewrite, setRewrite] = useState("");
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    else setRewrite(value);
  };

  const toggle = () => setStatus(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== rewrite) {
      setMessage("Password didn't Matched, type again !!!");
      setStatus(true);
      setPassword("");
      setRewrite("");
      return;
    }

    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,32}$/;

    if (!pattern.test(password)) {
      setMessage("Password should match the pattern");
      setStatus(true);
      setPassword("");
      setRewrite("");
      return;
    }

    setIsLoading(true);
    updatePassword();
  };

  const updatePassword = async () => {
    try {
      const res = await fetch(`${baseUrl}/teacher/forgot/change/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      setMessage("Updated Successfully");
    } catch (error) {
      setMessage("Cannot find User!! Unauthorized Action!!");
    } finally {
      setStatus(true);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <WaveTopBottomLoading />;
  }

  return (
    <Row style={{ margin: "3%" }}>
      <Col sm={12} md={8}>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="password">New Password</Label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handleInput}
              required
              autoComplete="off"
              placeholder="Enter New Password"
            />
          </FormGroup>
          <FormGroup>
            <Label for="rewrite">Re-Enter New Password</Label>
            <Input
              type="password"
              name="rewrite"
              value={rewrite}
              onChange={handleInput}
              required
              autoComplete="off"
              placeholder="Re-enter new password"
            />
          </FormGroup>
          <Button
            type="submit"
            style={{ margin: "20px 28%" }}
            color="success"
            size="md"
            outline
          >
            Submit
          </Button>
        </Form>
      </Col>
      <Col sm={12} md={8}>
        <ol>
          <li>At least one digit [0-9]</li>
          <li>At least one lowercase character [a-z]</li>
          <li>At least one uppercase character [A-Z]</li>
          <li>
            At least one special character [*.!@#$%^&(){}[]:;{"<>"}
            ,.?/~_+-=|\]
          </li>
          <li>At least 8 characters in length, but no more than 32.</li>
        </ol>
      </Col>

      <Modal isOpen={status} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Password</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          {message !== "Updated Successfully" ? (
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          ) : (
            <Link to="/signin" className="btn btn-primary">
              Sign In
            </Link>
          )}
        </ModalFooter>
      </Modal>
    </Row>
  );
};

export default Update;
