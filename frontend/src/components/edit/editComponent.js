import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Form,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Row,
  Col
} from "reactstrap";

const Edit = ({ isEmpty, questions, removedQuestions, handleInput, removeClick, handleSubmit1, handleCancel }) => {
  if (isEmpty) {
    return (
      <Row xs={12}>
        <Card>
          <CardImg top height="615em" src="/img/demo.jpg" alt="Card image cap" />
          <CardBody>
            <CardTitle tag="h5">Fill in the Details</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              View the questions which are present in the database
            </CardSubtitle>
            <CardText>
              Select Subject, Unit and Difficulty to Access, Modify and Update the Questions as required.
            </CardText>
          </CardBody>
        </Card>
      </Row>
    );
  }

  if (questions.length === 0) {
    return (
      <Row xs={12}>
        <Card>
          <CardImg top height="615em" src="/img/noquestion.png" alt="Card image cap" />
          <CardBody>
            <CardTitle tag="h5">No Questions Found</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              Seems Like No question has been inserted in this section.
            </CardSubtitle>
            <CardText>
              Go to the Insert option from above and insert the question.
            </CardText>
          </CardBody>
        </Card>
      </Row>
    );
  }

  return (
    <Form onSubmit={handleSubmit1}>
      {questions.map((el, i) => (
        <div key={i} style={{ paddingTop: "0.8em" }}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>{i + 1}</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Enter the Question"
              value={el.name || ""}
              required
              onChange={(e) => handleInput(i, e)}
              disabled={removedQuestions[i]}
            />
            <InputGroupAddon addonType="append">
              <Button
                size="sm"
                onClick={() => removeClick(i)}
                color={removedQuestions[i] ? "success" : "danger"}
              >
                {removedQuestions[i] ? "+" : "X"}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ))}

      <Row style={{ margin: '0.8em' }}>
        <Col xs={12} sm={6}>
          <Button color="primary" type="submit">Submit</Button>
        </Col>
        <Col xs={12} sm={6}>
          <Button
            color="white"
            style={{ border: '1px solid' }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Edit;
