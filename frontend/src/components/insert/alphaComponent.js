// alphaComponent.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import Insert from "./insertComponent";
import Details from "./numberComponent";
import { postQuestion, fetchSubjects } from "../ActionCreators";
import localStorage from "local-storage";
import { WaveTopBottomLoading } from "react-loadingg";

const Alpha = () => {
  const [options, setOptions] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [tRemove, setTRemove] = useState(false);
  const [tRemoveAll, setTRemoveAll] = useState(false);
  const [ques, setQues] = useState([
    {
      code: { value: "", id: "" },
      dummySubject: "",
      unit: "",
      marks: "",
      values: [{ value: null }],
    },
  ]);

  // Fetch subjects on mount
  useEffect(() => {
    if (options.length === 0) {
      setIsloading(true);
      fetchSubjects()
        .then((res) => res.json())
        .then((subjects) => {
          const opts = subjects.map((subj) => ({
            id: subj._id,
            label: subj.name,
            value: subj.code,
            depId: subj.department._id,
            depName: subj.department.name,
            year: subj.department.year,
            semester: subj.department.semester,
          }));
          setOptions(opts);
          setIsloading(false);
        })
        .catch(() => {
          setIsloading(false);
          alert("Cannot Connect to Server!!!, Logging Out...");
          localStorage.clear();
          window.location.reload();
        });
    }
  }, [options.length]);

  const addClick = () => {
    setQues((prev) => [
      ...prev,
      {
        code: { value: "", id: "" },
        dummySubject: "",
        unit: "",
        marks: "",
        values: [{ value: null }],
      },
    ]);
  };

  const addFormClick = (ind) => {
    const updated = [...ques];
    updated[ind].values.push({ value: null });
    setQues(updated);
  };

  const formClearAll = (ind) => {
    const updated = [...ques];
    updated[ind].values = [{ value: null }];
    setQues(updated);
  };

  const handleInput = (ind, i, e) => {
    const updated = [...ques];
    if (i === -2) {
      updated[ind].dummySubject = e;
      updated[ind].code.value = e.value;
      updated[ind].code.id = e.id;
    } else if (i === -1) {
      updated[ind] = { ...updated[ind], [e.target.name]: e.target.value };
    } else {
      updated[ind].values[i].value = e.target.value.trimLeft();
    }
    setQues(updated);
  };

  const removeClick = (ind, i) => {
    const updated = [...ques];
    updated[ind].values.splice(i, 1);
    setQues(updated);
  };

  const removeForm = (ind) => {
    if (ques.length === 1) {
      setTRemove(!tRemove);
    } else {
      const updated = [...ques];
      updated.splice(ind, 1);
      setQues(updated);
      setTRemove(!tRemove);
    }
  };

  const removeAllForm = () => {
    setQues([
      {
        code: { value: "", id: "" },
        unit: "",
        marks: "",
        dummySubject: "",
        values: [{ value: null }],
      },
    ]);
    setTRemoveAll(!tRemoveAll);
  };

  const toggleRemove = () => setTRemove(!tRemove);
  const toggleRemoveAll = () => setTRemoveAll(!tRemoveAll);

  const handleSubmit2 = (e) => {
    e.preventDefault();
    const grouped = {};
    ques.forEach((q) => {
      if (!grouped[q.code.id]) {
        grouped[q.code.id] = {
          easy: { u1: [], u2: [], u3: [], u4: [], u5: [] },
          medium: { u1: [], u2: [], u3: [], u4: [], u5: [] },
          hard: { u1: [], u2: [], u3: [], u4: [], u5: [] },
        };
      }
      const level =
        q.marks === "2" ? "easy" : q.marks === "5" ? "medium" : "hard";
      const unitKey = `u${q.unit}`;
      q.values.forEach((val) => {
        grouped[q.code.id][level][unitKey].push({
          name: val.value.trim(),
          teacher: localStorage.get("user").id,
        });
      });
    });

    setIsloading(true);
    postQuestion(grouped)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert("Success");
          setQues([
            {
              code: { value: "", id: "" },
              unit: "",
              marks: "",
              dummySubject: "",
              values: [{ value: null }],
            },
          ]);
          setIsloading(false);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setIsloading(false);
        alert("Cannot Connect to Server!!!, Logging Out...");
        localStorage.clear();
        window.location.reload();
      });
  };

  if (isloading) {
    return <WaveTopBottomLoading />;
  }

  return (
    <Row style={{ margin: "0.5em" }}>
      <Col md={12} lg={3}>
        <Details />
      </Col>
      <Col md={12} lg={9}>
        <form onSubmit={handleSubmit2}>
          {ques.map((el, i) => (
            <Insert
              key={i}
              index={i}
              formd={el}
              toggler={tRemove}
              options={options}
              handleInput={handleInput}
              removeClick={removeClick}
              addFormClick={addFormClick}
              formClearAll={formClearAll}
              removeForm={removeForm}
              toggleRemove={toggleRemove}
            />
          ))}
          <Row style={{ marginTop: "1em" }} xs={12}>
            <Col sm={4}>
              <Button outline color="primary" size="md" onClick={addClick}>
                Add
              </Button>
            </Col>
            <Col sm={4}>
              <Button outline role="submit" size="md" color="success">
                Submit
              </Button>
            </Col>
            <Col sm={4}>
              <Button
                outline
                size="md"
                color="danger"
                onClick={toggleRemoveAll}
                disabled={ques.length === 1}
              >
                Remove All
              </Button>
            </Col>
          </Row>
        </form>

        <Modal isOpen={tRemoveAll} toggle={toggleRemoveAll}>
          <ModalHeader toggle={toggleRemoveAll}>Modal title</ModalHeader>
          <ModalBody>Do you want to remove all the Questions?</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleRemoveAll}>
              Cancel
            </Button>
            <Button color="danger" onClick={removeAllForm}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      </Col>
    </Row>
  );
};

export default Alpha;
