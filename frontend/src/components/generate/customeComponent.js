// customeComponent.js
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  FormText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { WaveTopBottomLoading } from "react-loadingg";
import localStorage from "local-storage";
import DatePicker from "react-datepicker";
import { baseUrl } from "../../url";
import { getAuthHeaders, getSubjectDetails } from '../ActionCreators';

const Custome = ({ subject, handleSchema }) => {
  const [mcq, setMcq] = useState({ u1: false, u2: false, u3: false, u4: false, u5: false });
  const [easy, setEasy] = useState({ u1: false, u2: false, u3: false, u4: false, u5: false });
  const [medium, setMedium] = useState({ u1: false, u2: false, u3: false, u4: false, u5: false });
  const [hard, setHard] = useState({ u1: false, u2: false, u3: false, u4: false, u5: false });

  const [sections, setSections] = useState([
    {
      sname: "",
      marks: "",
      type: "easy",
      u1: "",
      u2: "",
      u3: "",
      u4: "",
      u5: "",
      done: false,
    },
  ]);

  const [tAddModal, setTAddModal] = useState(false);
  const [tRemoveModal, setTRemoveModal] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [my, setMy] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [maxMarks, setMaxMarks] = useState("");

  const [sublens, setSublens] = useState({
    mcq: { u1: 5, u2: 3, u3: 2, u4: 1, u5: 0 },
    easy: { u1: 0, u2: 0, u3: 0, u4: 0, u5: 0 },
    medium: { u1: 0, u2: 0, u3: 0, u4: 0, u5: 0 },
    hard: { u1: 0, u2: 0, u3: 0, u4: 0, u5: 0 }
  });

  const difficultyMap = { mcq: setMcq, easy: setEasy, medium: setMedium, hard: setHard };

  useEffect(() => {
    const getLengths = async () => {
      setIsloading(true);
      // const bearer = "Bearer " + localStorage.get("token");
      try {
        const questions = await getSubjectDetails(subject.id)
        const data = await questions.json()
        const subjectQuestionsID = data[0]._id
        const res = await fetch(baseUrl + "/teacher/schema/" + subjectQuestionsID, {
          headers: getAuthHeaders(),
        });
        const questionLengths = await res.json()
        // console.log("Fetched sublens:", questionLengths.sublens);
        setSublens(questionLengths.sublens);
        setIsloading(false);
      } catch (err) {
        console.log(err);
        setIsloading(false);
        alert("Cannot Connect to Server!!!, Please contact administrator");
      }
    };

    getLengths();
  }, [subject]);
  const handleInput = (ind, e) => {
    const updated = [...sections];
    updated[ind][e.target.name] = e.target.value;
    setSections(updated);
  };

  const handleMonth = (date) => setMy(date);
  const handleDet = (e) => {
    const { name, value } = e.target;
    if (name === "duration") setDuration(value);
    else if (name === "maxMarks") setMaxMarks(value);
  };

  const removehandleToggle = () => setTRemoveModal(!tRemoveModal);
  const addhandleToggle = () => {
    const last = sections[sections.length - 1];
    
    if (!last.type || !(last.type in sublens)) {
        alert("Invalid question type selected");
        return;
    }

    if (
        last.sname === "" ||
        last.marks === "" ||
        ["u1", "u2", "u3", "u4", "u5"].some(unit => 
            last[unit] === "" || 
            (Number(last[unit]) > (sublens[last.type]?.[unit] || 0))
        )
    ) {
        alert("Please Enter valid details for all fields!");
        return;
    }

    setTAddModal(!tAddModal);
  };

  const handleClick = () => {
    const updatedSections = [...sections];
    const ind = updatedSections.length - 1;
    const sec = updatedSections[ind];
    const setDiff = difficultyMap[sec.type];
    
    if (!setDiff) {
        console.error("Invalid question type:", sec.type);
        return;
    }

    const currentState = sec.type === 'mcq' ? mcq :
                        sec.type === 'easy' ? easy :
                        sec.type === 'medium' ? medium : hard;
    
    const updatedDiff = { ...currentState };

    ["u1", "u2", "u3", "u4", "u5"].forEach((unit) => {
        if (!updatedDiff[unit] && sec[unit] !== "0") {
            updatedDiff[unit] = true;
        }
    });

    sec.done = true;
    updatedSections[ind] = sec;
    setSections([...updatedSections]);
    setDiff(updatedDiff);

    const allUsed = Object.values(mcq)
        .concat(Object.values(easy))
        .concat(Object.values(medium))
        .concat(Object.values(hard))
        .every((val) => val === true);

    if (allUsed) {
        alert("No more sections possible");
    } else {
        setSections([
            ...updatedSections,
            {
                sname: "",
                marks: "",
                type: "mcq",  // Set default to MCQ
                u1: "",
                u2: "",
                u3: "",
                u4: "",
                u5: "",
                done: false,
            },
        ]);
    }

    setTAddModal(false);
  };

  const handleRemove = () => {
    setMcq({ u1: false, u2: false, u3: false, u4: false, u5: false });
    setEasy({ u1: false, u2: false, u3: false, u4: false, u5: false });
    setMedium({ u1: false, u2: false, u3: false, u4: false, u5: false });
    setHard({ u1: false, u2: false, u3: false, u4: false, u5: false });
    setTRemoveModal(false);
    setSections([
        {
            sname: "",
            marks: "",
            type: "mcq",  // Set default to MCQ
            u1: "",
            u2: "",
            u3: "",
            u4: "",
            u5: "",
            done: false,
        },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSchema({
      sections,
      my,
      maxMarks,
      duration,
    });
    handleRemove();
  };
  if (isloading) return <WaveTopBottomLoading />;

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Row style={{ marginTop: "3%" }} xs={12}>
            <Col md={12} lg={4}>
              <Label for="my">Month and Year</Label>
              <DatePicker
                required
                selected={my}
                onChange={handleMonth}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                minDate={new Date()}
              />
            </Col>
            <Col md={12} lg={4}>
              <Label for="maxMarks">Max Marks</Label>
              <Input
                type="number"
                name="maxMarks"
                value={maxMarks}
                onChange={handleDet}
                min={0}
                required
              />
            </Col>
            <Col md={12} lg={4}>
              <Label for="duration">Duration:</Label>
              <Input
                type="number"
                name="duration"
                value={duration}
                onChange={handleDet}
                min={0}
                required
              />
            </Col>
          </Row>
        </FormGroup>

        {sections.map((q, i) => {
          return (
            <div key={i}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Section Name</Label>
                    <Input
                      type="text"
                      name="sname"
                      value={q.sname}
                      onChange={(e) => handleInput(i, e)}
                      disabled={q.done}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Max Marks for this Section</Label>
                    <Input
                      type="number"
                      name="marks"
                      value={q.marks}
                      onChange={(e) => handleInput(i, e)}
                      disabled={q.done}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Question Type</Label>
                    <Input
                      type="select"
                      name="type"
                      value={q.type}
                      onChange={(e) => handleInput(i, e)}
                      disabled={q.done}
                    >
                      <option value="mcq">MCQ</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                {["u1", "u2", "u3", "u4", "u5"].map((unit) => (
                  <Col md={12} lg="auto" key={unit}>
                    <FormGroup>
                      <Label>Questions from Unit-{unit.slice(-1)}</Label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            {sublens[q.type]?.[unit] || 0}
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="number"
                          name={unit}
                          onChange={(e) => handleInput(i, e)}
                          value={q[unit]}
                          disabled={q.done}
                          max={sublens[q.type]?.[unit] || 0}
                          min={0}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                ))}
              </Row>
              <FormText color="muted">
                *If no question required keep 0
                <br />
                *Each difficulty level has limited questions. Limits are shown.
              </FormText>
            </div>
          );
        })}

        <Row style={{ margin: "2%" }}>
          <Col md={4}>
            <Button onClick={addhandleToggle} color="primary">
              Add more
            </Button>
          </Col>
          <Col md={4}>
            <Button role="submit" color="success">
              Submit
            </Button>
          </Col>
          <Col md={4}>
            <Button onClick={removehandleToggle} color="danger">
              Remove all
            </Button>
          </Col>
        </Row>

        <Modal isOpen={tAddModal} toggle={addhandleToggle}>
          <ModalHeader toggle={addhandleToggle}>Adding New Form</ModalHeader>
          <ModalBody>
            Do you really want to add a new form? After confirmation, this
            section becomes read-only.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleClick}>
              Yes
            </Button>
            <Button color="secondary" onClick={addhandleToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={tRemoveModal} toggle={removehandleToggle}>
          <ModalHeader toggle={removehandleToggle}>
            Removing All Forms
          </ModalHeader>
          <ModalBody>
            Do you really want to remove all sections? This cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleRemove}>
              Yes
            </Button>
            <Button color="secondary" onClick={removehandleToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Form>
    </div>
  );
};

export default Custome;
