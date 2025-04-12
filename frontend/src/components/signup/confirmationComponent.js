import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WaveTopBottomLoading } from "react-loadingg";
import { Container, Alert, Button } from "reactstrap";
import { baseUrl } from "../../url";

const Confirmation = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${baseUrl}/verify/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setVerificationStatus("success");
        } else {
          setVerificationStatus("failed");
          setError("Verification failed. Please try again.");
        }
      } catch (err) {
        setVerificationStatus("error");
        setError("An error occurred during verification. Please try again later.");
      }
    };

    if (userId) {
      verifyEmail();
    }
  }, [userId]);

  if (verificationStatus === "loading") return <WaveTopBottomLoading />;

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
      {verificationStatus === "success" && (
        <>
          <Alert color="success" style={{ fontSize: "1.2rem" }}>
            ✅ Email Verified Successfully
          </Alert>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Your email has been verified successfully. You can now log in to your account.
          </p>
          <Button
            color="primary"
            onClick={() => navigate("/signin")}
            style={{
              marginTop: "2rem",
              padding: "10px 20px",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          >
            Go to Login
          </Button>
        </>
      )}
      {verificationStatus === "failed" && (
        <>
          <Alert color="danger" style={{ fontSize: "1.2rem" }}>
            ❌ Verification Failed
          </Alert>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            {error || "The verification link is invalid or has expired."}
          </p>
          <Button
            color="primary"
            onClick={() => navigate("/signin")}
            style={{
              marginTop: "2rem",
              padding: "10px 20px",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          >
            Go to Login
          </Button>
        </>
      )}
      {verificationStatus === "error" && (
        <>
          <Alert color="warning" style={{ fontSize: "1.2rem" }}>
            ⚠️ An Error Occurred
          </Alert>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            {error || "Please try again later or contact support."}
          </p>
          <Button
            color="primary"
            onClick={() => navigate("/signin")}
            style={{
              marginTop: "2rem",
              padding: "10px 20px",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          >
            Go to Login
          </Button>
        </>
      )}
    </Container>
  );
};

export default Confirmation;