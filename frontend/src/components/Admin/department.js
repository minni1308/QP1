import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Button,
  ListGroup,
  ListGroupItem,
  Alert,
  Spinner,
  Badge,
  Collapse
} from 'reactstrap';
import { FaBuilding, FaPlus, FaTrash, FaList, FaTimes, FaCheck, FaUniversity, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import {
  addDepartment,
  removeDepartment,
  getDepartment,
} from '../ActionCreators';
import localStorage from 'local-storage';

const Department = () => {
  const [add, setAdd] = useState({ dname: '', dvalue: '' });
  const [remove, setRemove] = useState({ dname: '', dvalue: '' });
  const [departmentList, setDepartmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await getDepartment();
        const result = await res.json();
        if (result.success) {
          setDepartmentList(result.list);
        }
      } catch (error) {
        console.error('Failed to load departments:', error);
      }
    };
    
    loadInitialData();
  }, []);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleAdd = (e) => {
    const { name, value } = e.target;
    setAdd((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemove = (e) => {
    const { name, value } = e.target;
    setRemove((prev) => ({ ...prev, [name]: value }));
  };

  const addDepartments = async (e) => {
    e.preventDefault();
    const departments = [];
    for (let year = 1; year <= 4; year++) {
      for (let sem = 1; sem <= 2; sem++) {
        departments.push({
          name: add.dname,
          value: add.dvalue,
          year,
          semester: sem,
        });
      }
    }

    setIsLoading(true);
    try {
      const res = await addDepartment(departments);
      const result = await res.json();
      if (result.success) {
        setAlert({ show: true, message: 'Department added successfully!', type: 'success' });
        setAdd({ dname: '', dvalue: '' });
        setIsAddOpen(false);
      } else {
        setAlert({ show: true, message: 'Failed to add department', type: 'danger' });
      }
    } catch (error) {
      setAlert({ show: true, message: 'Please login again', type: 'danger' });
      localStorage.clear();
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const removeDepartments = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await removeDepartment(remove);
      const result = await res.json();
      if (result.success) {
        setAlert({ show: true, message: 'Department removed successfully!', type: 'success' });
        setRemove({ dname: '', dvalue: '' });
        setIsRemoveOpen(false);
        if (isListOpen) getDepartments(e);
      } else {
        setAlert({ show: true, message: 'Department not found', type: 'warning' });
      }
    } catch (error) {
      setAlert({ show: true, message: 'Please login again', type: 'danger' });
      localStorage.clear();
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const getDepartments = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const res = await getDepartment();
      const result = await res.json();
      if (result.success) {
        setDepartmentList(result.list);
        setIsListOpen(true);
      } else {
        setAlert({ show: true, message: 'Failed to fetch departments', type: 'danger' });
      }
    } catch (error) {
      setAlert({ show: true, message: 'Please login again', type: 'danger' });
      localStorage.clear();
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  // Action button component with improved spacing
  const ActionButton = ({ icon: Icon, text, color, onClick, circle = false }) => (
    <Button 
      color={color} 
      outline
      className={`d-flex align-items-center ${circle ? 'rounded-circle p-0' : 'rounded-3 px-4 py-2'}`}
      style={circle ? { width: '36px', height: '36px', justifyContent: 'center' } : {}}
      onClick={onClick}
    >
      <Icon size={circle ? 14 : 16} className={circle ? '' : 'me-3'} style={{ marginRight: circle ? 0 : '8px' }} />
      {!circle && <span style={{ marginLeft: '4px' }}>{text}</span>}
    </Button>
  );

  // Stat card with centered content
  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card className="border-0 shadow-sm mb-4 h-100">
      <CardBody className="p-4 d-flex flex-column">
        <div className="d-flex flex-column align-items-center text-center mb-3">
          <div className={`rounded-circle bg-${color}-subtle p-3 mb-3`}>
            <Icon size={20} className={`text-${color}`} />
          </div>
          <h6 className="text-muted">{title}</h6>
        </div>
        <div className="text-center flex-grow-1 d-flex align-items-center justify-content-center">
          <h3 className="mb-0 fw-bold display-6">{value}</h3>
        </div>
      </CardBody>
    </Card>
  );

  // Action cards with improved spacing
  const ActionCard = ({ title, icon: Icon, color, isOpen, toggle, children }) => (
    <Card className="shadow-sm mb-4 border-0 bg-white">
      <CardHeader 
        className={`bg-${color}-subtle border-0 d-flex justify-content-between align-items-center py-3 px-4`}
        style={{ cursor: 'pointer' }}
        onClick={toggle}
      >
        <div className="d-flex align-items-center">
          <div className={`rounded-circle bg-white p-2 me-3 shadow-sm d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
            <Icon className={`text-${color}`} size={18} />
          </div>
          <h5 className="mb-0 text-dark">{title}</h5>
        </div>
        <ActionButton
          icon={isOpen ? FaTimes : FaPlus}
          color={color}
          circle={true}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        />
      </CardHeader>
      <Collapse isOpen={isOpen}>
        <CardBody className="bg-light bg-opacity-25 p-4">{children}</CardBody>
      </Collapse>
    </Card>
  );

  return (
    <Container fluid className="py-5 px-5 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4 d-flex align-items-center justify-content-center" 
               style={{ width: '48px', height: '48px' }}>
            <FaBuilding className="text-primary" size={20} />
          </div>
          <h2 className="mb-0">Department Management</h2>
        </div>
        <ActionButton
          icon={FaPlus}
          text="New Department"
          color="primary"
          onClick={() => setIsAddOpen(true)}
        />
      </div>

      {alert.show && (
        <Alert color={alert.type} className="mb-4 shadow-sm border-0">
          {alert.message}
        </Alert>
      )}

      {isLoading && (
        <div className="text-center my-4">
          <Spinner color="primary" />
        </div>
      )}

      <Row className="mb-5 gx-4">
        <Col md={4}>
          <StatCard
            icon={FaUniversity}
            title="Total Departments"
            value={departmentList.length}
            color="primary"
          />
        </Col>
        <Col md={4}>
          <StatCard
            icon={FaGraduationCap}
            title="Total Programs"
            value={departmentList.length * 4}
            color="success"
          />
        </Col>
        <Col md={4}>
          <StatCard
            icon={FaChalkboardTeacher}
            title="Academic Years"
            value="4 Years"
            color="info"
          />
        </Col>
      </Row>

      <Row className="gx-4">
        <Col lg={8}>
          <ActionCard
            title="Add New Department"
            icon={FaPlus}
            color="success"
            isOpen={isAddOpen}
            toggle={() => setIsAddOpen(!isAddOpen)}
          >
            <Form onSubmit={addDepartments} className="p-2">
              <FormGroup className="mb-4">
                <Label for="dname" className="fw-bold mb-2">Department Name</Label>
                <Input
                  type="text"
                  name="dname"
                  id="dname"
                  placeholder="e.g., Computer Science and Engineering"
                  value={add.dname}
                  onChange={handleAdd}
                  required
                  className="mb-2 border-0 shadow-sm py-2 px-3"
                />
                <FormText color="muted">
                  Enter the full name of the department
                </FormText>
              </FormGroup>
              <FormGroup className="mb-4">
                <Label for="dvalue" className="fw-bold mb-2">Department Code</Label>
                <Input
                  type="text"
                  name="dvalue"
                  id="dvalue"
                  placeholder="e.g., CSE"
                  value={add.dvalue}
                  onChange={handleAdd}
                  required
                  className="mb-2 border-0 shadow-sm py-2 px-3"
                />
                <FormText color="muted">
                  Enter a short code for the department
                </FormText>
              </FormGroup>
              <div className="text-end mt-4">
                <Button type="button" color="light" className="me-3 px-4" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="success" className="px-4" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : (
                    <div className="d-flex align-items-center">
                      <FaCheck size={14} style={{ marginRight: '12px' }} />
                      <span>Add Department</span>
                    </div>
                  )}
                </Button>
              </div>
            </Form>
          </ActionCard>

          <ActionCard
            title="Remove Department"
            icon={FaTrash}
            color="danger"
            isOpen={isRemoveOpen}
            toggle={() => setIsRemoveOpen(!isRemoveOpen)}
          >
            <Form onSubmit={removeDepartments} className="p-2">
              <FormGroup className="mb-4">
                <Label for="dname" className="fw-bold mb-2">Department Name</Label>
                <Input
                  type="text"
                  name="dname"
                  id="dname"
                  placeholder="e.g., Computer Science and Engineering"
                  value={remove.dname}
                  onChange={handleRemove}
                  required
                  className="mb-2 border-0 shadow-sm py-2 px-3"
                />
              </FormGroup>
              <FormGroup className="mb-4">
                <Label for="dvalue" className="fw-bold mb-2">Department Code</Label>
                <Input
                  type="text"
                  name="dvalue"
                  id="dvalue"
                  placeholder="e.g., CSE"
                  value={remove.dvalue}
                  onChange={handleRemove}
                  required
                  className="mb-2 border-0 shadow-sm py-2 px-3"
                />
              </FormGroup>
              <div className="text-end mt-4">
                <Button type="button" color="light" className="me-3 px-4" onClick={() => setIsRemoveOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="danger" className="px-4" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : (
                    <div className="d-flex align-items-center">
                      <FaTrash size={14} style={{ marginRight: '12px' }} />
                      <span>Remove Department</span>
                    </div>
                  )}
                </Button>
              </div>
            </Form>
          </ActionCard>
        </Col>

        <Col lg={4}>
          <ActionCard
            title="Department List"
            icon={FaList}
            color="primary"
            isOpen={isListOpen}
            toggle={() => {
              if (!isListOpen) {
                getDepartments();
              } else {
                setIsListOpen(false);
              }
            }}
          >
            {departmentList.length > 0 ? (
              <ListGroup flush>
                {departmentList.map((dep, index) => (
                  <ListGroupItem 
                    key={index}
                    className="d-flex justify-content-between align-items-center border-0 border-bottom py-3 px-2"
                  >
                    <div>
                      <div className="fw-bold text-dark mb-1">{dep}</div>
                      <div className="text-muted d-flex align-items-center">
                        <FaGraduationCap size={12} style={{ marginRight: '12px' }} />
                        <span>Years: 1-4 | Semesters: 1-2</span>
                      </div>
                    </div>
                    <Badge color="primary" pill className="bg-primary-subtle text-primary-emphasis px-3 py-2">
                      Active
                    </Badge>
                  </ListGroupItem>
                ))}
              </ListGroup>
            ) : (
              <div className="text-center py-5">
                <div className="bg-white rounded-circle p-4 d-inline-flex mb-3 shadow-sm">
                  <FaUniversity size={40} className="text-primary opacity-75" />
                </div>
                <p className="text-muted mb-3">No departments found</p>
                <Button color="primary" className="px-4 py-2" outline onClick={() => setIsAddOpen(true)}>
                  <div className="d-flex align-items-center">
                    <FaPlus size={12} style={{ marginRight: '12px' }} />
                    <span>Add Your First Department</span>
                  </div>
                </Button>
              </div>
            )}
          </ActionCard>
        </Col>
      </Row>
    </Container>
  );
};

export default Department;
