import React, { useState, useEffect } from "react";
import {
  getSubjectDetails,
  getQuestions,
  editQuestions,
  getAuthHeaders
} from "../ActionCreators";
import { Col, Row, Button, Form, FormGroup } from "reactstrap";
import Select from "react-select";
import Edit from "./editComponent";
import { WaveTopBottomLoading } from "react-loadingg";
import localStorage from "local-storage";
import McqEdit from "./mcqEditComponent";
import { baseUrl } from "../../url";

const Options = () => {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [removedQuestions, setRemovedQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [questionId, setQuestionId] = useState('');

  const options = [
    { value: "mcq", label: "MCQ Questions" },
    { value: "easy", label: "Easy Questions" },
    { value: "medium", label: "Medium Questions" },
    { value: "hard", label: "Hard Questions" },
  ];

  const unitOptions = [
    { label: "Unit 1", value: "u1" },
    { label: "Unit 2", value: "u2" },
    { label: "Unit 3", value: "u3" },
    { label: "Unit 4", value: "u4" },
    { label: "Unit 5", value: "u5" },
  ];

  useEffect(() => {
    if (subjects.length === 0) {
      setIsLoading(true);
      const user = localStorage.get('user');
      fetch(`${baseUrl}/admin/teachersubjects/${user.id}`, {
        headers: getAuthHeaders()
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch teacher subjects');
        }
        return res.json();
      })
      .then(data => {
        if (!data.success || !Array.isArray(data.subjects)) {
          console.warn('No subjects found or invalid response format');
          setSubjects([]);
          return;
        }

        const opts = data.subjects
          .filter(subj => subj && subj.name && subj.code) // Filter out invalid subjects
          .map((subj) => ({
            id: subj._id,
            label: subj.name,
            value: subj.code,
            deptSem: subj.department.semester,
            deptYear: subj.department.year
          }));
        
        if (opts.length === 0) {
          console.warn('No subjects assigned to this teacher');
        } else {
          console.log('Loaded subjects:', opts);
        }
        
        setSubjects(opts);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Cannot Connect to Server!!!!");
        // localStorage.clear();
        // window.location.reload();
      });
    }
  }, [subjects.length]);

  const handleInput = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      name: e.target.value.trimLeft()
    };
    setQuestions(updatedQuestions);
  };

  const removeClick = (index) => {
    const updated = [...removedQuestions];
    updated[index] = !updated[index];
    setRemovedQuestions(updated);
  };

  const handleCancel = () => {
    setSelectedSubject("");
    setSelectedDifficulty("");
    setSelectedUnit("");
    setQuestions([]);
    setRemovedQuestions([]);
    setIsEmpty(true);
    setIsLoading(false);
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    
    const remainingQuestions = questions.filter((q, i) => !removedQuestions[i]);
    
    const cleanedQuestions = remainingQuestions.map(q => ({
      name: q.name.trim(),
      teacher: q.teacher,
      _id: q._id,
      timestamp: new Date()
    }));

    console.log('Submitting questions:', {
      totalQuestions: questions.length,
      remainingQuestions: remainingQuestions.length,
      deletedQuestions: questions.length - remainingQuestions.length,
      cleanedQuestions
    });

    if (remainingQuestions.length === 0) {
      alert("Please keep at least one question");
      return;
    }

    setIsLoading(true);
    editQuestions(
      cleanedQuestions,
      questionId,
      selectedDifficulty.value,
      selectedUnit.value
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert("Successfully Edited!!!");
          handleCancel();
        } else {
          alert("Failed to Edit: " + (res.message || "Unknown error"));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error updating questions:', error);
        setIsLoading(false);
        alert("Cannot Connect to Server!!!, Logging Out...");
        localStorage.clear();
        window.location.reload();
      });
  };

  const handleQuestionFetch = (e) => {
    e.preventDefault();

    if (!selectedSubject || !selectedDifficulty || !selectedUnit) {
      alert("Fill in the Details");
      return;
    }

    setIsLoading(true);
    setIsEmpty(false);

    if (selectedDifficulty.value === 'mcq') {
      setIsLoading(false);
      return;
    }

    getQuestions(
      { id: selectedSubject.id, unit: selectedUnit.value },
      selectedDifficulty.value
    )
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setQuestionId(data.questionId);
        setRemovedQuestions(new Array(data.length).fill(false));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Cannot Connect to Server!!!,");
      });
  };

  if (isLoading) return <WaveTopBottomLoading />;

  return (
    <Row style={{ margin: "0.5em" }}>
      <Col md={12} lg={4}>
        <Form>
          <FormGroup style={{ margin: "5%" }}>
            <Select
              options={subjects}
              onChange={setSelectedSubject}
              placeholder="Select Subject"
              value={selectedSubject}
              onMenuOpen={() => setSelectedSubject("")}
              isDisabled={questions.length > 0}
            />
          </FormGroup>
          <FormGroup style={{ margin: "5%" }}>
            <Select
              options={options}
              onChange={(option) => {
                setSelectedDifficulty(option);
                setSelectedType(option.value);
              }}
              placeholder="Select Question Type"
              value={selectedDifficulty}
              onMenuOpen={() => {
                setSelectedDifficulty("");
                setSelectedType("");
              }}
              isDisabled={questions.length > 0}
            />
          </FormGroup>
          <FormGroup style={{ margin: "5%" }}>
            <Select
              options={unitOptions}
              onChange={setSelectedUnit}
              placeholder="Select Unit"
              value={selectedUnit}
              onMenuOpen={() => setSelectedUnit("")}
              isDisabled={questions.length > 0}
            />
          </FormGroup>
          <FormGroup style={{ margin: "5%", marginLeft: "30%" }}>
            <Button
              color="primary"
              onClick={handleQuestionFetch}
              disabled={questions.length > 0}
            >
              Submit
            </Button>
          </FormGroup>
        </Form>
      </Col>
      <Col md={12} lg={8}>
        {selectedType !== 'mcq' && !isEmpty && (
          <Edit
            isEmpty={isEmpty}
            questions={questions}
            handleInput={handleInput}
            removeClick={removeClick}
            handleSubmit1={handleSubmit1}
            removedQuestions={removedQuestions}
            handleCancel={handleCancel}
          />
        )}
        {selectedType === 'mcq' && (
          <McqEdit 
            subject={selectedSubject}
            unit={selectedUnit}
            selectedType={selectedType}
          />
        )}
      </Col>
    </Row>
  );
};

export default Options;
