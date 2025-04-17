import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Button,
  Alert,
  FormGroup,
  Input,
  CardHeader,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import localStorage from "local-storage";
import { baseUrl } from '../../url';
import {getAuthHeaders} from '../ActionCreators';

const DisplayGeneratedQuestionsComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Log the entire location object for debugging
  console.log("Full location object:", location);

  const {
    questions = {},
    subject = "",
    chapterNumber = "",
    id = "",
  } = location.state || {};

  const [selectedQuestions, setSelectedQuestions] = useState({
    easy: new Set(),
    medium: new Set(),
    hard: new Set(),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state) {
      console.error("No state received in location");
      setError("No questions data received. Please generate questions first.");
      return;
    }

    if (!questions || !questions.easy || !questions.medium || !questions.hard) {
      console.warn("Invalid questions format received");
      setError("Questions were not generated in the correct format");
      return;
    }
  }, [location.state, questions]);

  const handleCheckboxChange = (level, index) => {
    setSelectedQuestions(prev => {
      const updatedSet = new Set(prev[level]);
      if (updatedSet.has(index)) {
        updatedSet.delete(index);
      } else {
        updatedSet.add(index);
      }
      return {
        ...prev,
        [level]: updatedSet
      };
    });
  };

  const handleAddToDatabase = async () => {
    const totalQuestions =
      selectedQuestions["easy"].size +
      selectedQuestions["medium"].size +
      selectedQuestions["hard"].size;

    if (totalQuestions === 0) {
      setError("Please select at least one question");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      [id]: {
        easy: {
          [chapterNumber]: questions.easy
            .filter((_, index) => selectedQuestions.easy.has(index))
            .map(question => ({
              name: question,
              teacher: localStorage.get("user").id,
            })),
        },
        medium: {
          [chapterNumber]: questions.medium
            .filter((_, index) => selectedQuestions.medium.has(index))
            .map(question => ({
              name: question,
              teacher: localStorage.get("user").id,
            })),
        },
        hard: {
          [chapterNumber]: questions.hard
            .filter((_, index) => selectedQuestions.hard.has(index))
            .map(question => ({
              name: question,
              teacher: localStorage.get("user").id,
            })),
        },
      },
    };

    console.log("Sending questions to database:", payload);

    try {
      const response = await fetch(`${baseUrl}/teacher/question/post`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Database response:', data);

      if (response.ok) {
        setSuccess('Questions successfully added to database!');
        setSelectedQuestions({
          easy: new Set(),
          hard: new Set(),
          medium: new Set(),
        });
        navigate('/teacher/generate-questions');
      } else {
        setError(data.message || 'Failed to add questions to database');
      }
    } catch (err) {
      console.error("Error adding questions to database:", err);
      setError("An error occurred while adding questions to database");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = () => {
    navigate("/teacher/generate-questions");
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Generated Questions</h2>

      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <div className="mb-3">
        <h4>Subject: {subject}</h4>
        <h5>Chapter: {chapterNumber}</h5>
      </div>

      <div className="mb-3 d-flex justify-content-between">
        <Button
          color="primary"
          onClick={handleAddToDatabase}
          disabled={loading || selectedQuestions.size === 0}
        >
          {loading ? "Adding..." : "Add Selected to Database"}
        </Button>
        <Button color="secondary" onClick={handleGenerateMore}>
          Generate More Questions
        </Button>
      </div>

      {Object.keys(questions).map((level, index) => (
        <Card key={index} className="mb-3">
          <CardHeader tag="h2" className="text-center">
            {level.toUpperCase()}
          </CardHeader>
          <CardBody>
          <FormGroup check className="me-3">
            {questions[level].map((question, index) => (
              <div key={index} className="d-flex align-items-start">
                  <Input
                    key={index}
                    type="checkbox"
                    checked={selectedQuestions[level].has(index)===true}
                    onChange={() => handleCheckboxChange(level, index)}
                  />
                <div>
                  <h5>Question {index + 1}</h5>
                  <p>{question}</p>
                </div>
              </div>
            ))}
            </FormGroup>
          </CardBody>
        </Card>
      ))}

      {Object.keys(questions).length === 0 && (
        <Alert color="info">
          No questions generated yet. Please go back and generate some
          questions.
        </Alert>
      )}
    </Container>
  );
};

export default DisplayGeneratedQuestionsComponent;