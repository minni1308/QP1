import React from 'react';
import {
  Button,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
  Form,
  Container,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap";

const McqEditForm = ({ questions, handleInput, removeClick, addFormClick, handleSubmit, handleCancel }) => {

  // Simple check for empty initial state
  if (!questions || questions.length === 0 || (questions.length === 1 && !questions[0].name && questions[0].options.every(o => !o))) {
     return (
         <Container className="py-5">
           <Card className="shadow-sm" style={{ maxWidth: "800px", margin: "0 auto" }}>
             <CardBody className="text-center p-5">
               <img 
                 src="/img/noquestion.png" 
                 alt="No MCQs" 
                 style={{ 
                   maxWidth: "300px", 
                   marginBottom: "2rem",
                   borderRadius: "10px",
                   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                 }} 
               />
               <CardTitle tag="h3" className="mb-3" style={{ color: "#333", fontWeight: "600" }}>
                 No MCQs Found
               </CardTitle>
               <CardSubtitle tag="h6" className="mb-3 text-muted">
                 No MCQs added by you in this section.
               </CardSubtitle>
             </CardBody>
           </Card>
         </Container>
      );
  }

  return (
     <Container className="py-3">
      <Card className="shadow-sm" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <CardBody className="p-4">
           <h2 className="text-center mb-4" style={{ color: "#333", fontWeight: "600" }}>
            Edit MCQs
          </h2>
          <Form onSubmit={handleSubmit}>
              {questions.map((el, i) => (
                  <div key={i} className="mcq-edit-group mb-4 p-3 border rounded bg-light">
                      <Row>
                          <Col md={12}>
                              <FormGroup>
                                  <Label className="font-weight-bold">Question {i + 1}</Label>
                                  <Input
                                      type="textarea"
                                      placeholder="Enter MCQ question text"
                                      value={el.name || ''} // Ensure value is controlled
                                      required
                                      onChange={(e) => handleInput(i, e, 'name')}
                                      className="mb-2"
                                      rows={2}
                                  />
                              </FormGroup>
                          </Col>
                      </Row>
                      <Row>
                          {['A', 'B', 'C', 'D'].map((optLetter, optIndex) => (
                              <Col md={6} key={optLetter}>
                                  <FormGroup>
                                      <Label>Option {optLetter}</Label>
                                      <Input
                                          type="text"
                                          placeholder={`Option ${optLetter}`}
                                          value={el.options ? (el.options[optIndex] || '') : ''} // Ensure value is controlled
                                          required
                                          onChange={(e) => handleInput(i, e, 'option', optIndex)}
                                      />
                                  </FormGroup>
                              </Col>
                          ))}
                      </Row>
                      <Row>
                          <Col className="text-right">
                              <Button color="danger" size="sm" onClick={() => removeClick(i)}>Remove MCQ</Button>
                          </Col>
                      </Row>
                  </div>
              ))}
              <Row className="mt-4">
                  <Col md={4} className="mb-2 mb-md-0">
                      <Button type="button" color="primary" onClick={addFormClick} block>Add Another MCQ</Button>
                  </Col>
                  <Col md={4} className="mb-2 mb-md-0">
                      <Button type="submit" color="success" block>Save Changes</Button>
                  </Col>
                  <Col md={4}>
                      <Button type="button" color="secondary" onClick={handleCancel} block>Cancel</Button>
                  </Col>
              </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default McqEditForm; 