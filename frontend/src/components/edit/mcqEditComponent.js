// mcqEditComponent.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { getMcqs, editMcqs } from "../ActionCreators";
import { WaveTopBottomLoading } from "react-loadingg";

const McqEdit = ({ subject, unit, selectedType }) => {
  const [questions, setQuestions] = useState([]);
  const [removedQuestions, setRemovedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [questionId, setQuestionId] = useState('');
  

  useEffect(() => {
    if (subject && unit && selectedType === 'mcq') {
      setIsLoading(true);
      setError(null);

      getMcqs({ id: subject.id, unit: unit.value })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.questions)) {
            setQuestionId(data.questionId);
            setQuestions(data.questions);
            setRemovedQuestions(new Array(data.length).fill(false));
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error:", error);
          setError(`Failed to load MCQ questions: ${error.message}`);
          setIsLoading(false);
        });
    }
  }, [subject, unit, selectedType]);

  useEffect(() => {
    if (editingQuestion) {
      console.log('Current editing question:', editingQuestion);
    }
  }, [editingQuestion]);

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setEditingQuestion(null);
      setEditingIndex(null);
    }
  };

  const handleEdit = (question, index) => {
    console.log('Editing question:', question); // Debug log
    setEditingQuestion(question);
    setEditingIndex(index);
    setModal(true);
  };

  const removeClick = (index) => {
    const updated = [...removedQuestions];
    updated[index] = !updated[index];
    setRemovedQuestions(updated);
  };

  const handleQuestionChange = (value) => {
    setEditingQuestion({ ...editingQuestion, name: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedQuestion = { ...editingQuestion };
    updatedQuestion.options[index] = value;
    setEditingQuestion(updatedQuestion);
  };

  const handleSave = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex] = editingQuestion;
    setQuestions(updatedQuestions);

    // Update backend
    editMcqs(updatedQuestions, questionId, unit.value)
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          toggle();
        } else {
          throw new Error('Failed to update questions');
        }
      })
      .catch(error => {
        console.error("Error:", error);
        // Revert changes if update fails
        getMcqs({ id: subject.id, unit: unit.value })
          .then(response => response.json())
          .then(data => {
            if (Array.isArray(data.questions)) {
              setQuestionId(data.questionId);
              setQuestions(data.questions);
              setRemovedQuestions(new Array(data.length).fill(false));
            }
            setIsLoading(false);
          });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const remainingQuestions = questions.filter((_, i) => !removedQuestions[i]);
    
    if (remainingQuestions.length === 0) {
      alert("Please keep at least one question");
      return;
    }

    setIsLoading(true);
    editMcqs(remainingQuestions, questionId, unit.value)
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          alert("Successfully Updated MCQs!");
          window.location.reload();
        } else {
          throw new Error('Failed to update questions');
        }
      })
      .catch(error => {
        console.error("Error:", error);
        setError(`Failed to update MCQs: ${error.message}`);
        setIsLoading(false);
      });
  };

  if (isLoading) return <WaveTopBottomLoading />;

  return (
    <Form onSubmit={handleSubmit}>
      {questions.map((question, index) => (
        <div key={index} className="mb-3">
          <div className={`p-3 border rounded ${removedQuestions[index] ? 'bg-light' : 'bg-white'}`}>
            <div className="d-flex">
              <div className="mr-3">
                <div className="question-number">
                  {index + 1}
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="mb-2">
                  <strong>Question:</strong> {question.name}
                </div>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="ml-4 mb-1">
                    {String.fromCharCode(97 + optIndex)}) {option}
                  </div>
                ))}
                <div className="mt-3">
                  <Button
                    color="primary"
                    onClick={() => handleEdit(question, index)}
                    className="mr-2"
                    disabled={removedQuestions[index]}
                  >
                    Edit
                  </Button>
                  <Button
                    color={removedQuestions[index] ? "success" : "danger"}
                    onClick={() => removeClick(index)}
                  >
                    {removedQuestions[index] ? "Undo" : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {questions.length > 0 && (
        <div className="text-center mt-4 mb-4">
          <Button 
            color="primary" 
            type="submit" 
            size="lg"
          >
            Save Changes
          </Button>
        </div>
      )}

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit MCQ</ModalHeader>
        <ModalBody>
          <Form>
            <div className="mb-4">
              <Label>Question:</Label>
              <Input
                type="text"
                defaultValue={editingQuestion?.name}
                onChange={(e) => handleQuestionChange(e.target.value)}
                className="form-control"
              />
            </div>
            
            <div className="mt-3">
              <Label>Options:</Label>
              {editingQuestion?.options.map((option, index) => (
                <div key={index} className="mb-3">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        {String.fromCharCode(97 + index)})
                      </span>
                    </div>
                    <Input
                      type="text"
                      defaultValue={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            Save Changes
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Form>
  );
};

export default McqEdit; 