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
    <div style={{ border: "1px solid", marginTop: "1em" }}>
      <Row xs={12} style={{ margin: "1em" }}>
        <Col md={12} lg={4}>
          <Label>Subject: </Label>
          <Select
            options={options}
            onChange={(e) => handleInput(index, -2, e)}
            placeholder="Select subject"
            value={formd.dummySubject}
            isSearchable
          />
        </Col>
        <Col md={12} lg={4}>
          <Label>
            Unit:
            <Input
              type="text"
              maxLength="1"
              name="unit"
              value={formd.unit}
              onChange={(e) => handleInput(index, -1, e)}
              pattern="[1-5]+"
              placeholder="Unit"
              required
            />
          </Label>
        </Col>
        <Col md={12} lg={4}>
          <Label>
            Marks:
            <Input
              type="text"
              maxLength="2"
              name="marks"
              value={formd.marks}
              onChange={(e) => handleInput(index, -1, e)}
              pattern="[25]|10"
              placeholder="Marks"
              required
            />
          </Label>
        </Col>
      </Row>

      {formd.values.map((el, i) => (
        <Row xs={12} key={i} style={{ margin: "0.5em" }}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>{i + 1}</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Enter the Question"
              value={el.value || ""}
              required
              onChange={(e) => handleInput(index, i, e)}
            />
            <InputGroupAddon addonType="append">
              <Button onClick={() => removeClick(index, i)}>X</Button>
            </InputGroupAddon>
          </InputGroup>
        </Row>
      ))}

      <Row xs={12} style={{ margin: "1em" }} justifyContent="space-around">
        <Col sm={12} md={8}>
          <Row>
            <Col>
              <Button
                size="md"
                color="primary"
                onClick={() => addFormClick(index)}
              >
                Add Question
              </Button>
            </Col>
            <Col>
              <Button
                color="primary"
                size="md"
                onClick={() => formClearAll(index)}
              >
                Clear All
              </Button>
            </Col>
          </Row>
        </Col>
        <Col sm={12} md={4}>
          <Button color="danger" size="md" onClick={toggleRemove}>
            Remove
          </Button>
        </Col>
      </Row>

      <Modal isOpen={toggler} toggle={toggleRemove}>
        <ModalHeader toggle={toggleRemove}>Modal title</ModalHeader>
        <ModalBody>Do you want to remove the Questions?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleRemove}>
            Cancel
          </Button>
          <Button color="danger" onClick={() => removeForm(index)}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Insert;
