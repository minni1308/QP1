// loginComponent.js
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
  Row,
  Col,
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
    navigate("/");
    return null; // equivalent to <ModalExample />
  }

  return (
    <Row
      style={{
        justifyContent: "center",
        marginLeft: "12%",
        marginTop: "5%",
        marginRight: "10%",
        marginBottom: "1%",
        padding: "2%",
      }}
    >
      <Col xs={12} md={2} style={{ padding: "1em" }}>
        <img src="/Users/meenakshikolishetty/QP-main/frontend/public/back.jpeg" alt="vishu logo" width="200em" />
      </Col>
      <Col xs={12} md={10} style={{ paddingLeft: "10%" }}>
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
            <Label for="email">Email</Label>
            <Input
              type="text"
              name="username"
              value={cred.username}
              onChange={handleInput}
              placeholder="Email"
              autoComplete="off"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              value={cred.password}
              onChange={handleInput}
              placeholder="Password"
              required
            />
            <FormText color="muted">
              Forget Username/Password?{" "}
              <Link to="/forgot" style={{ textDecoration: "underline" }}>
                Click here
              </Link>
            </FormText>
          </FormGroup>
          <Button
            role="submit"
            color="info"
            size="md"
            outline
            style={{ marginLeft: "25%" }}
          >
            Sign in
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
