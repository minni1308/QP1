import React, { useEffect, useState } from "react";
import { baseUrl } from "../../url";
import { WaveTopBottomLoading } from "react-loadingg";
import { Container, Alert } from "reactstrap";
import { Link } from "react-router-dom";

const Confirmation = ({ url }) => {
  const [status, setStatus] = useState("loading"); // "loading", "success", "failed", "error"

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(baseUrl + url);
        const data = await res.json();
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    check();
  }, [url]);

  if (status === "loading") return <WaveTopBottomLoading />;

  return (
    <Container className="mt-5 text-center">
      <h1>QP Generator</h1>
      {status === "success" && (
        <>
          <Alert color="success">✅ Successfully Verified</Alert>
          <p>You can now log in and start generating question papers.</p>
        </>
      )}
      {status === "failed" && (
        <>
          <Alert color="danger">❌ Verification Failed</Alert>
          <p>Please use the email you registered with.</p>
        </>
      )}
      {status === "error" && (
        <>
          <Alert color="warning">⚠️ An Error Occurred</Alert>
          <p>Please report this to the site administrator.</p>
        </>
      )}
      <p className="mt-4">
        Back to <Link to="/signin">Login</Link> page
      </p>
    </Container>
  );
};

export default Confirmation;
