import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../url";
import { fetchSubjects } from "../ActionCreators";

const GenerateQuestionsComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    chapterNumber: "",
    numberOfQuestions: 5,
    content: "",
    difficulty: "medium"
  });
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch subjects when component mounts
  useEffect(() => {
    if (subjects.length === 0) {
      setIsLoading(true);
      fetchSubjects()
        .then((res) => res.json())
        .then((subjectsData) => {
          const subjectList = subjectsData.map((subj) => ({
            id: subj._id,
            name: subj.name,
            code: subj.code,
            department: subj.department
          }));
          setSubjects(subjectList);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setError("Cannot Connect to Server!");
          window.localStorage.clear();
          window.location.reload();
        });
    }
  }, [subjects.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected file:", selectedFile);
    
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
      setFile(selectedFile);
      setError("");

      // Create preview URL for PDF files
      if (selectedFile.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(fileUrl);
        console.log("Created PDF preview URL:", fileUrl);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setError("File size should not exceed 5MB");
      setFile(null);
      setPreviewUrl(null);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Debug log the form data
    console.log("Form Data:", formData);
    console.log("File:", file);

    // Validate required fields
    if (!formData.subject) {
      setError("Please select a subject");
      setIsProcessing(false);
      return;
    }

    if (!formData.chapterNumber) {
      setError("Please enter a chapter number");
      setIsProcessing(false);
      return;
    }

    if (!formData.numberOfQuestions) {
      setError("Please enter number of questions");
      setIsProcessing(false);
      return;
    }

    // Validate content or file
    if (!formData.content && !file) {
      setError("Please either upload a file or paste content");
      setIsProcessing(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("chapterNumber", formData.chapterNumber);
    formDataToSend.append("numberOfQuestions", formData.numberOfQuestions.toString());
    formDataToSend.append("difficulty", formData.difficulty);
    
    if (formData.content) {
      formDataToSend.append("content", formData.content);
    }
    
    if (file) {
      formDataToSend.append("file", file);
    }

    // Debug log the API endpoint and request data
    console.log("API Endpoint:", `${baseUrl}/teacher/generate`);
    console.log("FormData entries:");
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      console.log("Sending request to generate questions...");
      const token = window.localStorage.getItem('token');
      console.log("Token present:", !!token);

      const response = await fetch(`${baseUrl}/teacher/generate`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || "Failed to generate questions");
      }

      const data = await response.json();
      console.log('Raw response data:', data);

      // Check if we have questions in the response
      if (!data || !data.questions) {
        throw new Error("No questions received from server");
      }

      // Convert questions object/array to the format we need
      let processedQuestions;
      if (Array.isArray(data.questions)) {
        processedQuestions = data.questions;
      } else if (typeof data.questions === 'object') {
        // If questions come as an object with text property
        processedQuestions = data.questions.map(q => q.text || q);
      } else {
        throw new Error("Invalid questions format received");
      }

      console.log('Processed questions:', processedQuestions);
      
      // Store the questions in state
      setGeneratedQuestions(processedQuestions);
      
      // Navigate to display page with the questions
      const navigationState = {
        questions: processedQuestions,
        subject: formData.subject,
        chapterNumber: formData.chapterNumber
      };
      console.log('Navigating with state:', navigationState);
      
      navigate('/teacher/display-generated-questions', {
        state: navigationState
      });
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(err.message || "An error occurred while generating questions");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container
      style={{
        maxWidth: "800px",
        margin: "auto",
        marginTop: "2rem",
        marginBottom: "2rem",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Generate Questions
      </h2>

      {error && <Alert color="danger">{error}</Alert>}
      {success && (
        <Alert color="success">
          Questions generated successfully!
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <FormGroup>
              <Label for="subject">Subject *</Label>
              <Input
                type="select"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.code}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="chapterNumber">Chapter Number *</Label>
              <Input
                type="number"
                name="chapterNumber"
                id="chapterNumber"
                value={formData.chapterNumber}
                onChange={handleInputChange}
                min="1"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="numberOfQuestions">Number of Questions *</Label>
              <Input
                type="number"
                name="numberOfQuestions"
                id="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleInputChange}
                min="1"
                max="20"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="difficulty">Difficulty Level *</Label>
              <Input
                type="select"
                name="difficulty"
                id="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Input>
            </FormGroup>
          </div>

          <div className="col-md-6">
            <FormGroup>
              <Label>Upload File (5MB max) {!formData.content && <span className="text-danger">*</span>}</Label>
              <div
                style={{
                  border: "2px dashed #ccc",
                  borderRadius: "4px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".doc,.docx,.html,.pdf,.txt"
                />
                <div>
                  <i className="fas fa-cloud-upload-alt fa-2x mb-2"></i>
                  <p>Drop file here or click to upload</p>
                  <p className="text-muted">(DOC, DOCX, HTML, PDF, or TXT)</p>
                </div>
              </div>
              {file && <p className="text-success">File selected: {file.name}</p>}
            </FormGroup>

            {previewUrl && (
              <div style={{ marginBottom: "1rem" }}>
                <Label>PDF Preview</Label>
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    border: "1px solid #ddd",
                  }}
                >
                  <iframe
                    src={previewUrl}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="PDF Preview"
                  />
                </div>
              </div>
            )}

            <FormGroup>
              <Label for="content">Or Paste Content Here {!file && <span className="text-danger">*</span>}</Label>
              <Input
                type="textarea"
                name="content"
                id="content"
                value={formData.content}
                onChange={handleInputChange}
                style={{ height: "200px", marginBottom: "1rem" }}
                placeholder="Paste your content here..."
              />
            </FormGroup>
          </div>
        </div>

        <Button
          color="primary"
          type="submit"
          disabled={isProcessing || (!file && !formData.content)}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isProcessing ? "Generating..." : "Generate Questions"}
        </Button>
      </Form>

      {isProcessing && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Processing...</span>
          </div>
          <p className="mt-2">
            Generating questions... This may take a few moments.
          </p>
        </div>
      )}

      {generatedQuestions.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Generated Questions:</h3>
          <div style={{ marginTop: "1rem" }}>
            {generatedQuestions.map((question, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                }}
              >
                <p>
                  <strong>Q{index + 1}:</strong> {question.text}
                </p>
                {question.options && (
                  <ul>
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default GenerateQuestionsComponent;
