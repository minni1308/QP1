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

const Custome = ({ subject, handleSchema }) => {
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
    easy: { u1: 0, u2: 0, u3: 0, u4: 0, u5: 0 },
    medium: { u1: 0, u2: 0, u3: 0, u4: 0, u5: 0 },
    hard: { u1: 0, u2: 0, u3: 0, u4: 0, u5: 0 },
  });

  const difficultyMap = { easy: setEasy, medium: setMedium, hard: setHard };

  useEffect(() => {
    const getLengths = async () => {
      setIsloading(true);
      const bearer = "Bearer " + localStorage.get("token");
      try {
        const res = await fetch(baseUrl + "/teacher/schema/" + subject.id, {
          headers: { Authorization: bearer },
        });
        const data = await res.json();
        setSublens(data.sublens);
        setIsloading(false);
      } catch (err) {
        setIsloading(false);
        alert("Cannot Connect to Server!!!, Logging Out...");
        localStorage.clear();
        window.location.reload();
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
    const type = last.type;

    if (
      last.sname === "" ||
      last.marks === "" ||
      (last.u1 === "" && !easy.u1) ||
      (last.u2 === "" && !easy.u2) ||
      (last.u3 === "" && !easy.u3) ||
      (last.u4 === "" && !easy.u4)
    ) {
      alert("Please Enter all details!!!!!");
      return;
    }

    const overLimit = ["u1", "u2", "u3", "u4", "u5"].some(
      (unit) => Number(last[unit]) > sublens[type][unit]
    );

    if (overLimit) {
      alert("You are requesting more questions than available.");
      return;
    }

    setTAddModal(!tAddModal);
  };

  const handleClick = () => {
    const updatedSections = [...sections];
    const ind = updatedSections.length - 1;
    const sec = updatedSections[ind];
    const setDiff = difficultyMap[sec.type];
    const updatedDiff = { ...{ ...easy, ...medium, ...hard }[sec.type] };

    ["u1", "u2", "u3", "u4", "u5"].forEach((unit) => {
      if (!updatedDiff[unit] && sec[unit] !== "0") {
        updatedDiff[unit] = true;
      } else {
        sec[unit] = "";
      }
    });

    sec.done = true;
    updatedSections[ind] = sec;
    setSections([...updatedSections]);

    setDiff(updatedDiff);

    const allUsed = Object.values(easy)
      .concat(Object.values(medium))
      .concat(Object.values(hard))
      .every((val) => val === true);

    if (allUsed) alert("No more sections possible");
    else {
      setSections([
        ...updatedSections,
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
    }

    setTAddModal(false);
  };

  const handleRemove = () => {
    setEasy({ u1: false, u2: false, u3: false, u4: false, u5: false });
    setMedium({ u1: false, u2: false, u3: false, u4: false, u5: false });
    setHard({ u1: false, u2: false, u3: false, u4: false, u5: false });
    setTRemoveModal(false);
    setSections([
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
          const type = q.type;
          return (
            <div key={i}>
              <div style={{ marginLeft: "20vw", fontSize: "1.3em" }}>
                Details for Section {i + 1}
              </div>
              <Row>
                <Col md={12} lg={8}>
                  <FormGroup>
                    <Label>Name of Section</Label>
                    <Input
                      type="text"
                      name="sname"
                      value={q.sname}
                      onChange={(e) => handleInput(i, e)}
                      required
                    />
                    <FormText>Eg: Answer Any Five of the Following</FormText>
                  </FormGroup>
                </Col>
                <Col md={12} lg={4}>
                  <FormGroup>
                    <Label>Marks</Label>
                    <Input
                      type="number"
                      name="marks"
                      value={q.marks}
                      onChange={(e) => handleInput(i, e)}
                      required
                      min={0}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label>Select Difficulty Level</Label>
                    <Input
                      type="select"
                      name="type"
                      onChange={(e) => handleInput(i, e)}
                      disabled={q.done}
                      required
                    >
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
                            {sublens[type][unit]}
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="number"
                          name={unit}
                          onChange={(e) => handleInput(i, e)}
                          value={q[unit]}
                          disabled={eval(type)[unit] || q.done}
                          max={sublens[type][unit]}
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
