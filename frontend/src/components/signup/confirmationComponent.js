import React, { useEffect, useState } from "react";
import { baseUrl } from "../../url";
import { WaveTopBottomLoading } from "react-loadingg";
import { Container, Alert, Button } from "reactstrap";
import { Link } from "react-router-dom";

const Confirmation = ({ url }) => {
  const [status, setStatus] = useState("loading"); // "loading", "success", "failed", "error"

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(baseUrl + url);
        // Check if the HTTP response is OK
        if (!res.ok) {
          console.error("HTTP error:", res.status, res.statusText);
          return setStatus("error");
        }
        const data = await res.json();
        console.log("Verification response:", data);
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setStatus("error");
      }
    };

    check();
  }, [url]);

  if (status === "loading") return <WaveTopBottomLoading />;

  return (
    <Container
      style={{
        maxWidth: "500px",
        margin: "auto",
        marginTop: "5rem",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "1rem", fontSize: "2rem", color: "#007bff" }}>
        QP Generator
      </h1>
      {status === "success" && (
        <>
          <Alert color="success" style={{ fontSize: "1.2rem" }}>
            ✅ Successfully Verified
          </Alert>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            You can now log in and start generating question papers.
          </p>
        </>
      )}
      {status === "failed" && (
        <>
          <Alert color="danger" style={{ fontSize: "1.2rem" }}>
            ❌ Verification Failed
          </Alert>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Please use the email you registered with.
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <Alert color="warning" style={{ fontSize: "1.2rem" }}>
            ⚠️ An Error Occurred
          </Alert>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Please report this to the site administrator.
          </p>
        </>
      )}
      <Button
        tag={Link}
        to="/signin"
        color="primary"
        style={{
          marginTop: "2rem",
          padding: "10px 20px",
          borderRadius: "4px",
          fontSize: "1rem",
        }}
      >
        Back to Login
      </Button>
    </Container>
  );
};

export default Confirmation;