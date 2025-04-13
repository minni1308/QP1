import React, { useState, useEffect } from 'react';
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
  Badge,
} from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../url';

const DisplayGeneratedQuestionsComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Log the entire location object for debugging
  console.log('Full location object:', location);
  
  const { questions = [], subject = '', chapterNumber = '' } = location.state || {};
  
  console.log('Extracted from location.state:', {
    questions,
    subject,
    chapterNumber
  });
  
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayQuestions, setDisplayQuestions] = useState([]);

  useEffect(() => {
    // Validate the received data
    if (!location.state) {
      console.error('No state received in location');
      setError('No questions data received. Please generate questions first.');
      return;
    }

    if (!Array.isArray(questions)) {
      console.error('Questions is not an array:', questions);
      setError('Invalid questions format received');
      return;
    }

    if (questions.length === 0) {
      console.warn('Empty questions array received');
      setError('No questions were generated');
      return;
    }

    // Process questions for display
    const processedQuestions = questions.map(q => 
      typeof q === 'string' ? q : (q.text || JSON.stringify(q))
    );
    setDisplayQuestions(processedQuestions);

    console.log(`Received ${questions.length} questions for subject ${subject}, chapter ${chapterNumber}`);
    console.log('Processed questions for display:', processedQuestions);
  }, [location.state, questions, subject, chapterNumber]);

  const handleCheckboxChange = (index) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedQuestions(newSelected);
    console.log('Selected questions indices:', Array.from(newSelected));
  };

  const handleAddToDatabase = async () => {
    if (selectedQuestions.size === 0) {
      setError('Please select at least one question');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // Prepare questions for database
    const selectedQuestionsArray = Array.from(selectedQuestions).map(index => ({
      text: questions[index],
      subject: subject,
      chapterNumber: chapterNumber,
      type: 'descriptive'
    }));

    console.log('Sending questions to database:', selectedQuestionsArray);

    try {
      const token = window.localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/teacher/questions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questions: selectedQuestionsArray }),
      });

      const data = await response.json();
      console.log('Database response:', data);

      if (response.ok) {
        setSuccess('Questions successfully added to database!');
        setSelectedQuestions(new Set());
      } else {
        setError(data.message || 'Failed to add questions to database');
      }
    } catch (err) {
      console.error('Error adding questions to database:', err);
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
          {loading ? 'Adding...' : 'Add Selected to Database'}
        </Button>
        <Button color="secondary" onClick={handleGenerateMore}>
          Generate More Questions
        </Button>
      </div>

      {displayQuestions.map((question, index) => (
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
                <p>{question}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {(!displayQuestions || displayQuestions.length === 0) && (
        <Alert color="info">
          No questions generated yet. Please go back and generate some questions.
        </Alert>
      )}
    </Container>
  );
};

export default DisplayGeneratedQuestionsComponent; 