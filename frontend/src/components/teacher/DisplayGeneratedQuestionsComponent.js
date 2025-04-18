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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  const [addedQuestions, setAddedQuestions] = useState({
    easy: new Set(),
    medium: new Set(),
    hard: new Set(),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState({
    level: '',
    index: -1,
    text: '',
  });

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
    // Don't allow selection of already added questions
    if (addedQuestions[level].has(index)) {
      return;
    }

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

  const handleEditClick = (level, index) => {
    setEditingQuestion({
      level,
      index,
      text: questions[level][index],
    });
    setEditModal(true);
  };

  const handleEditSave = () => {
    if (!editingQuestion.text.trim()) {
      setError("Question text cannot be empty");
      return;
    }

    // Update the question in the questions state
    const updatedQuestions = { ...questions };
    updatedQuestions[editingQuestion.level][editingQuestion.index] = editingQuestion.text;
    
    // Update the location state
    location.state.questions = updatedQuestions;
    
    setEditModal(false);
    setEditingQuestion({
      level: '',
      index: -1,
      text: '',
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
        
        // Mark the selected questions as added
        setAddedQuestions(prev => {
          const newAdded = { ...prev };
          ['easy', 'medium', 'hard'].forEach(level => {
            selectedQuestions[level].forEach(index => {
              newAdded[level].add(index);
            });
          });
          return newAdded;
        });

        // Clear selections
        setSelectedQuestions({
          easy: new Set(),
          medium: new Set(),
          hard: new Set(),
        });
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
          disabled={loading || Object.values(selectedQuestions).every(set => set.size === 0)}
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
                <div key={index} className="d-flex align-items-start mb-3">
                  <Input
                    type="checkbox"
                    checked={selectedQuestions[level].has(index)}
                    onChange={() => handleCheckboxChange(level, index)}
                    disabled={addedQuestions[level].has(index)}
                    style={{ marginRight: '10px', marginTop: '5px' }}
                  />
                  <div style={{ 
                    flex: 1,
                    opacity: addedQuestions[level].has(index) ? 0.6 : 1 
                  }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5>Question {index + 1}</h5>
                        <p>{question}</p>
                        {addedQuestions[level].has(index) && (
                          <small className="text-success">Added to database</small>
                        )}
                      </div>
                      {!addedQuestions[level].has(index) && (
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => handleEditClick(level, index)}
                          style={{ marginLeft: '10px' }}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
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

      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Question</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              type="textarea"
              value={editingQuestion.text}
              onChange={(e) => setEditingQuestion(prev => ({ ...prev, text: e.target.value }))}
              rows={5}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditSave}>Save</Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default DisplayGeneratedQuestionsComponent;