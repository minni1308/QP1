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
  Container,
} from "reactstrap";
import Insert from "./insertComponent";
import Details from "./numberComponent";
import { postQuestion, fetchSubjects } from "../ActionCreators";
import localStorage from "local-storage";
import { WaveTopBottomLoading } from "react-loadingg";
import { baseUrl } from "../../shared/baseUrl";

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

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.get('token')}`
  });

  // Fetch teacher's subjects on mount
  useEffect(() => {
    if (options.length === 0) {
      setIsloading(true);
      const user = localStorage.get('user');
      
      // Fetch teacher's assigned subjects
      fetch(`${baseUrl}admin/teachersubjects/${user.id}`, {
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
          setOptions([]);
          return;
        }

        const opts = data.subjects
          .filter(subj => subj && subj.name && subj.code) // Filter out invalid subjects
          .map((subj) => ({
            id: subj._id,
            label: subj.name,
            value: subj.code,
            depId: subj.department?._id,
            depName: subj.department?.name,
            year: subj.department?.year,
            semester: subj.department?.semester,
          }));
        
        if (opts.length === 0) {
          console.warn('No subjects assigned to this teacher');
        } else {
          console.log('Loaded subjects:', opts);
        }
        
        setOptions(opts);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        alert("Error loading subjects: " + error.message);
      })
      .finally(() => {
        setIsloading(false);
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
          mcq: { u1: [], u2: [], u3: [], u4: [], u5: [] },
        };
      }
      
      let level;
      if (q.marks === "mcq") {
        level = "mcq";
      } else if (q.marks === "2") {
        level = "easy";
      } else if (q.marks === "5") {
        level = "medium";
      } else if (q.marks === "10") {
        level = "hard";
      } else {
        console.warn(`Invalid type/marks value: ${q.marks} for subject ${q.code.value}`);
        return;
      }

      const unitKey = `u${q.unit}`;
      if (!grouped[q.code.id][level][unitKey]) {
        console.warn(`Invalid unit key: ${unitKey} for level ${level}`);
        return;
      }
      
      q.values.forEach((val) => {
        if (val.value && val.value.trim()) {
          grouped[q.code.id][level][unitKey].push({
            name: val.value.trim(),
            teacher: localStorage.get("user").id,
          });
        }
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
    <Container fluid style={{ padding: "2rem" }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "2rem",
        color: "#333",
        fontWeight: "bold"
      }}>
        Insert Questions
      </h2>
      
      <Row>
        <Col md={12} lg={3}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem"
          }}>
            <Details />
          </div>
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
            
            <div style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              marginTop: "1rem"
            }}>
              <Row className="justify-content-center">
                <Col sm={4}>
                  <Button
                    color="primary"
                    onClick={addClick}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      fontSize: "1rem"
                    }}
                  >
                    Add Section
                  </Button>
                </Col>
                <Col sm={4}>
                  <Button
                    type="submit"
                    color="success"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      fontSize: "1rem"
                    }}
                  >
                    Submit All
                  </Button>
                </Col>
                <Col sm={4}>
                  <Button
                    color="danger"
                    onClick={toggleRemoveAll}
                    disabled={ques.length === 1}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      fontSize: "1rem"
                    }}
                  >
                    Remove All
                  </Button>
                </Col>
              </Row>
            </div>
          </form>

          <Modal isOpen={tRemoveAll} toggle={toggleRemoveAll}>
            <ModalHeader toggle={toggleRemoveAll}>Remove All Questions</ModalHeader>
            <ModalBody>Are you sure you want to remove all questions?</ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleRemoveAll}>
                Cancel
              </Button>
              <Button color="danger" onClick={removeAllForm}>
                Remove All
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default Alpha;
