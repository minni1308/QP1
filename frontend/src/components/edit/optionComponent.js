import React, { useState, useEffect } from "react";
import {
  getSubjectDetails,
  getQuestions,
  editQuestions,
} from "../ActionCreators";
import { Col, Row, Button, Form, FormGroup } from "reactstrap";
import Select from "react-select";
import Edit from "./editComponent";
import { WaveTopBottomLoading } from "react-loadingg";
import localStorage from "local-storage";

const Options = () => {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [removedQuestions, setRemovedQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const difficultyOptions = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
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
      getSubjectDetails()
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((element) => ({
            label: element.subject.name,
            value: element.subject.code,
            id: element._id,
            deptYear: element.subject.department.year,
            deptSem: element.subject.department.semester,
          }));
          setSubjects(formatted);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          alert("Cannot Connect to Server!!!!, Logging out.....");
          localStorage.clear();
          window.location.reload();
        });
    }
  }, []);

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
    
    const remainingQuestions = questions.filter((_, i) => !removedQuestions[i]);
    
    const cleanedQuestions = remainingQuestions.map(q => ({
      name: q.name.trim(),
      teacher: q.teacher,
      _id: q._id,
      timestamp: new Date()
    }));

    console.log('Submitting questions:', cleanedQuestions);

    setIsLoading(true);
    editQuestions(
      cleanedQuestions,
      selectedSubject.id,
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

    getQuestions(
      { id: selectedSubject.id, unit: selectedUnit.value },
      selectedDifficulty.value
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched questions:', data);
        setQuestions(data);
        setRemovedQuestions(new Array(data.length).fill(false));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Cannot Connect to Server!!!, Logging Out...");
        localStorage.clear();
        window.location.reload();
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
              options={difficultyOptions}
              onChange={setSelectedDifficulty}
              placeholder="Select Difficulty"
              value={selectedDifficulty}
              onMenuOpen={() => setSelectedDifficulty("")}
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
        <Edit
          isEmpty={isEmpty}
          questions={questions}
          handleInput={handleInput}
          removeClick={removeClick}
          handleSubmit1={handleSubmit1}
          removedQuestions={removedQuestions}
          handleCancel={handleCancel}
        />
      </Col>
    </Row>
  );
};

export default Options;
