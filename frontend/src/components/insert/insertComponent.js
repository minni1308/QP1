// insertComponent.js
import React from "react";
import Select from "react-select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
  FormGroup,
} from "reactstrap";

const Insert = ({
  options,
  formd,
  handleInput,
  removeClick,
  addFormClick,
  formClearAll,
  toggleRemove,
  removeForm,
  index,
  toggler,
}) => {
  return (
    <div style={{
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      marginTop: "1rem"
    }}>
      <Row className="mb-4">
        <Col md={12} lg={4}>
          <FormGroup>
            <Label style={{
              fontSize: "1rem",
              color: "#333",
              marginBottom: "0.5rem",
              display: "block"
            }}>Subject</Label>
            <Select
              options={options}
              onChange={(e) => handleInput(index, -2, e)}
              placeholder="Select subject"
              value={formd.dummySubject}
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  minHeight: "45px"
                })
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12} lg={4}>
          <FormGroup>
            <Label style={{
              fontSize: "1rem",
              color: "#333",
              marginBottom: "0.5rem",
              display: "block"
            }}>Unit</Label>
            <Input
              type="text"
              maxLength="1"
              name="unit"
              value={formd.unit}
              onChange={(e) => handleInput(index, -1, e)}
              pattern="[1-5]+"
              placeholder="Enter unit (1-5)"
              required
              style={{
                borderRadius: "6px",
                border: "1px solid #ccc",
                padding: "12px",
                fontSize: "1rem"
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12} lg={4}>
          <FormGroup>
            <Label style={{
              fontSize: "1rem",
              color: "#333",
              marginBottom: "0.5rem",
              display: "block"
            }}>Type/Marks</Label>
            <Input
              type="select"
              name="marks"
              value={formd.marks}
              onChange={(e) => handleInput(index, -1, e)}
              required
              style={{
                borderRadius: "6px",
                border: "1px solid #ccc",
                padding: "12px",
                fontSize: "1rem",
                height: "47px"
              }}
            >
              <option value="">Select Type</option>
              <option value="mcq">MCQ</option>
              <option value="2">Easy (2 Marks)</option>
              <option value="5">Medium (5 Marks)</option>
              <option value="10">Hard (10 Marks)</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>

      {formd.values.map((el, i) => (
        <div key={i} className="mb-3">
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText style={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #ccc",
                borderRadius: "6px 0 0 6px"
              }}>{i + 1}</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Enter the Question"
              value={el.value || ""}
              required
              onChange={(e) => handleInput(index, i, e)}
              style={{
                borderRadius: "0 6px 6px 0",
                border: "1px solid #ccc",
                padding: "12px",
                fontSize: "1rem"
              }}
            />
            <InputGroupAddon addonType="append">
              <Button 
                onClick={() => removeClick(index, i)}
                color="danger"
                style={{
                  borderRadius: "6px",
                  marginLeft: "10px"
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ))}

      <Row className="mt-4 mb-3">
        <Col sm={12} md={8}>
          <Row>
            <Col>
              <Button
                color="primary"
                onClick={() => addFormClick(index)}
                style={{
                  borderRadius: "6px",
                  padding: "10px 20px",
                  width: "100%"
                }}
              >
                Add Question
              </Button>
            </Col>
            <Col>
              <Button
                color="secondary"
                onClick={() => formClearAll(index)}
                style={{
                  borderRadius: "6px",
                  padding: "10px 20px",
                  width: "100%"
                }}
              >
                Clear All
              </Button>
            </Col>
          </Row>
        </Col>
        <Col sm={12} md={4} className="mt-3 mt-md-0">
          <Button
            color="danger"
            onClick={toggleRemove}
            style={{
              borderRadius: "6px",
              padding: "10px 20px",
              width: "100%"
            }}
          >
            Remove Section
          </Button>
        </Col>
      </Row>

      <Modal isOpen={toggler} toggle={toggleRemove}>
        <ModalHeader toggle={toggleRemove}>Remove Questions</ModalHeader>
        <ModalBody>Are you sure you want to remove these questions?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleRemove}>
            Cancel
          </Button>
          <Button color="danger" onClick={() => removeForm(index)}>
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Insert;
