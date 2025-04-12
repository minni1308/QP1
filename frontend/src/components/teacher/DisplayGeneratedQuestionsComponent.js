import React, { useState } from 'react';
import {
  Container,
  Card,
  CardBody,
  Button,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../url';

const DisplayGeneratedQuestionsComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, subject, difficulty } = location.state || { questions: [], subject: '', difficulty: 'easy' };
  
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (index) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedQuestions(newSelected);
  };

  const handleAddToDatabase = async () => {
    if (selectedQuestions.size === 0) {
      setError('Please select at least one question');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const selectedQuestionsArray = Array.from(selectedQuestions).map(index => ({
      ...questions[index],
      subject: subject,
      difficulty: difficulty,
    }));

    try {
      const response = await fetch(`${baseUrl}/teacher/questions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: selectedQuestionsArray }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Questions successfully added to database!');
        setSelectedQuestions(new Set());
      } else {
        setError(data.message || 'Failed to add questions to database');
      }
    } catch (err) {
      setError('An error occurred while adding questions to database');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = () => {
    navigate('/teacher/generate-questions');
  };

  return (
    <Container className="mt-4 mb-4">
      <h2 className="text-center mb-4">Generated Questions</h2>
      
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <div className="mb-3 d-flex justify-content-between">
        <Button 
          color="primary" 
          onClick={handleAddToDatabase}
          disabled={loading || selectedQuestions.size === 0}
        >
          {loading ? 'Adding...' : 'Add Selected to Database'}
        </Button>
        <Button color="secondary" onClick={handleGenerateMore}>
          Generate More Questions
        </Button>
      </div>

      {questions.map((question, index) => (
        <Card key={index} className="mb-3">
          <CardBody>
            <div className="d-flex align-items-start">
              <FormGroup check className="me-3">
                <Input
                  type="checkbox"
                  checked={selectedQuestions.has(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </FormGroup>
              <div>
                <h5>Question {index + 1}</h5>
                <p>{question.text}</p>
                {question.options && (
                  <div>
                    <p className="mb-2">Options:</p>
                    <ol type="A">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex}>{option}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {question.answer && (
                  <p><strong>Answer:</strong> {question.answer}</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {questions.length === 0 && (
        <Alert color="info">
          No questions generated yet. Please go back and generate some questions.
        </Alert>
      )}
    </Container>
  );
};

export default DisplayGeneratedQuestionsComponent; 