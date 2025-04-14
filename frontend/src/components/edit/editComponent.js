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
  Col,
  Container
} from "reactstrap";

const Edit = ({ isEmpty, questions, removedQuestions, handleInput, removeClick, handleSubmit1, handleCancel }) => {
  if (isEmpty) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <CardBody className="text-center p-5">
            <img 
              src="/img/demo.jpg" 
              alt="Instructions" 
              style={{ 
                maxWidth: "300px", 
                marginBottom: "2rem",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }} 
            />
            <CardTitle tag="h3" className="mb-3" style={{ color: "#333", fontWeight: "600" }}>
              Fill in the Details
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-3 text-muted">
              View the questions which are present in the database
            </CardSubtitle>
            <CardText className="lead" style={{ fontSize: "1.1rem" }}>
              Select Subject, Unit and Difficulty to Access, Modify and Update the Questions as required.
            </CardText>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <CardBody className="text-center p-5">
            <img 
              src="/img/noquestion.png" 
              alt="No Questions" 
              style={{ 
                maxWidth: "300px", 
                marginBottom: "2rem",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }} 
            />
            <CardTitle tag="h3" className="mb-3" style={{ color: "#333", fontWeight: "600" }}>
              No Questions Found
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-3 text-muted">
              Seems Like No question has been inserted in this section.
            </CardSubtitle>
            <CardText className="lead" style={{ fontSize: "1.1rem" }}>
              Go to the Insert option from above and insert the question.
            </CardText>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <CardBody className="p-4">
          <h2 className="text-center mb-4" style={{ color: "#333", fontWeight: "600" }}>
            Edit Questions
          </h2>
          
          <Form onSubmit={handleSubmit1}>
            {questions.map((el, i) => (
              <div key={i} className="mb-3">
                <InputGroup className="shadow-sm">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText 
                      style={{ 
                        backgroundColor: "#f8f9fa",
                        borderColor: "#dee2e6",
                        color: "#495057",
                        minWidth: "50px",
                        justifyContent: "center"
                      }}
                    >
                      {i + 1}
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Enter the Question"
                    value={el.name || ""}
                    required
                    onChange={(e) => handleInput(i, e)}
                    disabled={removedQuestions[i]}
                    style={{
                      borderColor: "#dee2e6",
                      padding: "0.75rem",
                      fontSize: "1rem"
                    }}
                    className={removedQuestions[i] ? "bg-light" : ""}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      size="sm"
                      onClick={() => removeClick(i)}
                      color={removedQuestions[i] ? "success" : "danger"}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "1rem",
                        borderRadius: "0 4px 4px 0"
                      }}
                    >
                      {removedQuestions[i] ? "+" : "×"}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            ))}

            <Row className="mt-4">
              <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                <Button 
                  color="primary" 
                  type="submit" 
                  className="w-100"
                  style={{
                    padding: "0.75rem",
                    fontSize: "1rem",
                    borderRadius: "6px"
                  }}
                >
                  Save Changes
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  color="light"
                  onClick={handleCancel}
                  className="w-100"
                  style={{
                    padding: "0.75rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "1px solid #dee2e6"
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Edit;
