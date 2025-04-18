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
  Table,
  Alert,
  Spinner,
  Badge,
  Collapse,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import {
  FaBook,
  FaPlus,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCheck,
  FaUniversity,
  FaGraduationCap,
  FaBookOpen,
  FaFilter
} from 'react-icons/fa';
import {
  getDepartment,
  addSubject,
  removeSubject,
  getSubjects,
} from '../ActionCreators';
import localStorage from 'local-storage';
import Select from 'react-select';

const Subject = () => {
  const [add, setAdd] = useState({
    sname: '',
    scode: '',
    year: '',
    semester: '',
    department: '',
  });

  const [removeCode, setRemoveCode] = useState('');
  const [departmentList, setDepartmentList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [ldept, setLdept] = useState('');
  const [lyear, setLyear] = useState('');
  const [lsem, setLsem] = useState('');
  const [lcode, setLcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectsByDepartment, setSubjectsByDepartment] = useState({});

  const years = [
    { label: 'I', value: '1' },
    { label: 'II', value: '2' },
    { label: 'III', value: '3' },
    { label: 'IV', value: '4' },
  ];
  const semesters = [
    { label: 'I', value: '1' },
    { label: 'II', value: '2' },
  ];

  // Load departments and subjects on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load departments
        const deptRes = await getDepartment();
        const deptResult = await deptRes.json();
        if (deptResult.success) {
          const formatted = deptResult.list.map((d) => ({
            label: d,
            value: d,
          }));
          setDepartmentList(formatted);
          
          // Load all subjects
          const subRes = await getSubjects({});
          const subResult = await subRes.json();
          if (subResult.success) {
            const formattedList = subResult.list.map(sub => ({
              sname: sub.name || sub.sname,
              scode: sub.code || sub.scode,
              dname: sub.department?.value || sub.dname,
              year: sub.department?.year || sub.year,
              sem: sub.department?.semester || sub.sem
            }));
            setSubjectList(formattedList);
            setFilteredSubjects(formattedList);
            
            // Group subjects by department for statistics
            const byDept = {};
            formattedList.forEach(sub => {
              if (!byDept[sub.dname]) {
                byDept[sub.dname] = 0;
              }
              byDept[sub.dname]++;
            });
            setSubjectsByDepartment(byDept);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setAlert({
          show: true,
          message: 'Failed to load initial data. Please refresh.',
          type: 'danger'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Filter subjects when search term changes
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = subjectList.filter(
        subject => 
          subject.sname.toLowerCase().includes(lowercaseSearch) ||
          subject.scode.toLowerCase().includes(lowercaseSearch) ||
          subject.dname.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjectList);
    }
  }, [searchTerm, subjectList]);

  // Auto-dismiss alerts
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAdd((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSelect = (name, value) => {
    setAdd((prev) => ({ ...prev, [name]: value }));
  };

  const addSubjects = async (e) => {
    e.preventDefault();
    const { sname, scode, year, semester, department } = add;
    if (!sname || !scode || !year || !semester || !department) {
      setAlert({
        show: true,
        message: 'Please enter all the details',
        type: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await addSubject(add);
      const result = await res.json();
      if (result.success) {
        setAlert({
          show: true,
          message: 'Subject added successfully',
          type: 'success'
        });
        setAdd({ sname: '', scode: '', year: '', semester: '', department: '' });
        setIsAddOpen(false);
        
        // Refresh subject list
        refreshSubjects();
      } else {
        setAlert({
          show: true,
          message: 'Failed to add subject',
          type: 'danger'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error adding subject. Please try again.',
        type: 'danger'
      });
      console.error('Error adding subject:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubjects = async (e) => {
    e.preventDefault();
    if (!removeCode) {
      setAlert({
        show: true,
        message: 'Please input subject code',
        type: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await removeSubject({ id: removeCode });
      const result = await res.json();
      if (result.success) {
        setAlert({
          show: true,
          message: 'Subject removed successfully',
          type: 'success'
        });
        setRemoveCode('');
        setIsRemoveOpen(false);
        
        // Refresh subject list
        refreshSubjects();
      } else {
        setAlert({
          show: true,
          message: 'Subject not found',
          type: 'warning'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error removing subject. Please try again.',
        type: 'danger'
      });
      console.error('Error removing subject:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await getSubjects({});
      const result = await res.json();
      if (result.success) {
        const formattedList = result.list.map(sub => ({
          sname: sub.name || sub.sname,
          scode: sub.code || sub.scode,
          dname: sub.department?.value || sub.dname,
          year: sub.department?.year || sub.year,
          sem: sub.department?.semester || sub.sem
        }));
        setSubjectList(formattedList);
        setFilteredSubjects(formattedList);
        
        // Update department statistics
        const byDept = {};
        formattedList.forEach(sub => {
          if (!byDept[sub.dname]) {
            byDept[sub.dname] = 0;
          }
          byDept[sub.dname]++;
        });
        setSubjectsByDepartment(byDept);
      }
    } catch (error) {
      console.error('Error refreshing subjects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubjects = async (e) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    try {
      const res = await getSubjects({
        name: ldept?.value || '',
        year: lyear?.value || '',
        sem: lsem?.value || '',
        code: lcode || '',
      });

      const result = await res.json();
      if (result.success) {
        const formattedList = result.list.map(sub => ({
          sname: sub.name || sub.sname,
          scode: sub.code || sub.scode,
          dname: sub.department?.value || sub.dname,
          year: sub.department?.year || sub.year,
          sem: sub.department?.semester || sub.sem
        }));
        setFilteredSubjects(formattedList);
      } else {
        setFilteredSubjects([]);
        setAlert({
          show: true,
          message: 'No matching subjects found',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('Error filtering subjects:', error);
      setAlert({
        show: true,
        message: 'Error filtering subjects. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setLdept('');
    setLyear('');
    setLsem('');
    setLcode('');
    setFilteredSubjects(subjectList);
  };

  // Action button component
  const ActionButton = ({ icon: Icon, text, color, onClick, circle = false }) => (
    <Button 
      color={color} 
      outline
      className={`d-flex align-items-center ${circle ? 'rounded-circle p-0' : 'rounded-3 px-4 py-2'}`}
      style={circle ? { width: '36px', height: '36px', justifyContent: 'center' } : {}}
      onClick={onClick}
    >
      <Icon size={circle ? 14 : 16} style={{ marginRight: circle ? 0 : '12px' }} />
      {!circle && <span>{text}</span>}
    </Button>
  );

  // Stat card component
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

  // Action card component
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
            <FaBook className="text-primary" size={20} />
          </div>
          <h2 className="mb-0">Subject Management</h2>
        </div>
        <ActionButton
          icon={FaPlus}
          text="New Subject"
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
            icon={FaBookOpen}
            title="Total Subjects"
            value={subjectList.length}
            color="primary"
          />
        </Col>
        <Col md={4}>
          <StatCard
            icon={FaUniversity}
            title="Departments Covered"
            value={Object.keys(subjectsByDepartment).length}
            color="success"
          />
        </Col>
        <Col md={4}>
          <StatCard
            icon={FaGraduationCap}
            title="Most Subjects In"
            value={Object.entries(subjectsByDepartment).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
            color="info"
          />
        </Col>
      </Row>

      <Row className="gx-4">
        <Col lg={7}>
          <ActionCard
            title="Subject List"
            icon={FaBookOpen}
            color="primary"
            isOpen={true}
            toggle={() => {}}
          >
            <div className="mb-4">
              <Row className="mb-3 align-items-end">
                <Col md={6}>
                  <div className="position-relative">
                    <Input
                      type="text"
                      placeholder="Search subjects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pe-5 border-0 shadow-sm py-2 px-3"
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                      <FaSearch className="text-muted" />
                    </div>
                  </div>
                </Col>
                <Col md={6} className="text-end">
                  <Button 
                    color="primary" 
                    outline 
                    size="sm" 
                    onClick={() => setIsListOpen(!isListOpen)}
                    className="px-3"
                  >
                    <div className="d-flex align-items-center">
                      <FaFilter style={{ marginRight: '8px' }} size={14} />
                      <span>Advanced Filter</span>
                    </div>
                  </Button>
                </Col>
              </Row>
              
              <Collapse isOpen={isListOpen}>
                <Card className="mb-3 border-0 shadow-sm">
                  <CardBody>
                    <Form onSubmit={filterSubjects}>
                      <Row className="mb-3">
                        <Col md={4}>
                          <FormGroup>
                            <Label className="fw-bold mb-2">Department</Label>
                            <Select
                              options={departmentList}
                              value={ldept}
                              onChange={(value) => {
                                setLdept(value);
                                setLcode('');
                              }}
                              placeholder="Select Department"
                              isClearable
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label className="fw-bold mb-2">Year</Label>
                            <Select
                              options={years}
                              value={lyear}
                              onChange={(value) => {
                                setLyear(value);
                                setLcode('');
                              }}
                              placeholder="Select Year"
                              isClearable
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label className="fw-bold mb-2">Semester</Label>
                            <Select
                              options={semesters}
                              value={lsem}
                              onChange={(value) => {
                                setLsem(value);
                                setLcode('');
                              }}
                              placeholder="Select Semester"
                              isClearable
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="align-items-end">
                        <Col md={6}>
                          <FormGroup>
                            <Label className="fw-bold mb-2">Subject Code</Label>
                            <Input
                              type="text"
                              placeholder="e.g., A21AB"
                              value={lcode}
                              onChange={(e) => {
                                setLcode(e.target.value);
                                setLdept('');
                                setLyear('');
                                setLsem('');
                              }}
                              className="border-0 shadow-sm py-2 px-3"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6} className="d-flex justify-content-end">
                          <Button 
                            color="light" 
                            outline 
                            onClick={clearFilters} 
                            className="me-2"
                          >
                            Clear
                          </Button>
                          <Button 
                            color="primary" 
                            type="submit"
                          >
                            Apply Filters
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Collapse>
            </div>
            
            {filteredSubjects.length > 0 ? (
              <div className="table-responsive">
                <Table hover className="shadow-sm bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3" width="5%">#</th>
                      <th className="py-3" width="30%">Name</th>
                      <th className="py-3" width="15%">Code</th>
                      <th className="py-3" width="25%">Department</th>
                      <th className="py-3" width="10%">Year</th>
                      <th className="py-3" width="15%">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.map((subject, idx) => (
                      <tr key={idx}>
                        <td className="py-3">{idx + 1}</td>
                        <td className="py-3 fw-medium">{subject.sname}</td>
                        <td className="py-3">
                          <Badge 
                            color="primary" 
                            pill 
                            className="bg-primary-subtle text-primary-emphasis px-3 py-2"
                          >
                            {subject.scode}
                          </Badge>
                        </td>
                        <td className="py-3">{subject.dname}</td>
                        <td className="py-3">{subject.year}</td>
                        <td className="py-3">{subject.sem}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                <div className="bg-light rounded-circle p-4 d-inline-flex mb-3">
                  <FaBookOpen size={40} className="text-secondary opacity-50" />
                </div>
                <p className="text-muted mb-3">No subjects found</p>
                <Button color="primary" className="px-4" outline onClick={() => setIsAddOpen(true)}>
                  <div className="d-flex align-items-center">
                    <FaPlus size={12} style={{ marginRight: '12px' }} />
                    <span>Add Your First Subject</span>
                  </div>
                </Button>
              </div>
            )}
          </ActionCard>
        </Col>

        <Col lg={5}>
          <ActionCard
            title="Add New Subject"
            icon={FaPlus}
            color="success"
            isOpen={isAddOpen}
            toggle={() => setIsAddOpen(!isAddOpen)}
          >
            <Form onSubmit={addSubjects} className="p-2">
              <FormGroup className="mb-4">
                <Label for="sname" className="fw-bold mb-2">Subject Name</Label>
                <Input
                  type="text"
                  name="sname"
                  id="sname"
                  placeholder="e.g., Mathematics-I"
                  value={add.sname}
                  onChange={handleAddChange}
                  required
                  className="mb-2 border-0 shadow-sm py-2 px-3"
                />
                <FormText color="muted">
                  Enter the full name of the subject
                </FormText>
              </FormGroup>
              <FormGroup className="mb-4">
                <Label for="scode" className="fw-bold mb-2">Subject Code</Label>
                <Input
                  type="text"
                  name="scode"
                  id="scode"
                  placeholder="e.g., A21AB"
                  value={add.scode}
                  onChange={handleAddChange}
                  required
                  className="mb-2 border-0 shadow-sm py-2 px-3"
                />
                <FormText color="muted">
                  Enter the unique code for the subject
                </FormText>
              </FormGroup>
              <FormGroup className="mb-4">
                <Label className="fw-bold mb-2">Department</Label>
                <Select
                  options={departmentList}
                  value={add.department}
                  onChange={(e) => handleAddSelect('department', e)}
                  placeholder="Select Department"
                  className="mb-2"
                />
              </FormGroup>
              <Row>
                <Col md={6}>
                  <FormGroup className="mb-4">
                    <Label className="fw-bold mb-2">Year</Label>
                    <Select
                      options={years}
                      value={add.year}
                      onChange={(e) => handleAddSelect('year', e)}
                      placeholder="Select Year"
                      className="mb-2"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-4">
                    <Label className="fw-bold mb-2">Semester</Label>
                    <Select
                      options={semesters}
                      value={add.semester}
                      onChange={(e) => handleAddSelect('semester', e)}
                      placeholder="Select Semester"
                      className="mb-2"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-end mt-4">
                <Button type="button" color="light" className="me-3 px-4" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="success" className="px-4" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : (
                    <div className="d-flex align-items-center">
                      <FaCheck size={14} style={{ marginRight: '12px' }} />
                      <span>Add Subject</span>
                    </div>
                  )}
                </Button>
              </div>
            </Form>
          </ActionCard>

          <ActionCard
            title="Remove Subject"
            icon={FaTrash}
            color="danger"
            isOpen={isRemoveOpen}
            toggle={() => setIsRemoveOpen(!isRemoveOpen)}
          >
            <Form onSubmit={removeSubjects} className="p-2">
              <FormGroup className="mb-4">
                <Label for="removeCode" className="fw-bold mb-2">Subject Code</Label>
                <Input
                  type="text"
                  id="removeCode"
                  placeholder="e.g., A21AB"
                  value={removeCode}
                  onChange={(e) => setRemoveCode(e.target.value)}
                  required
                  className="mb-2 border-0 shadow-sm py-2 px-3"
                />
                <FormText color="muted">
                  Enter the exact code of the subject you want to remove
                </FormText>
              </FormGroup>
              <div className="text-end mt-4">
                <Button type="button" color="light" className="me-3 px-4" onClick={() => setIsRemoveOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="danger" className="px-4" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : (
                    <div className="d-flex align-items-center">
                      <FaTrash size={14} style={{ marginRight: '12px' }} />
                      <span>Remove Subject</span>
                    </div>
                  )}
                </Button>
              </div>
            </Form>
          </ActionCard>

          {departmentList.length > 0 && (
            <Card className="shadow-sm mb-4 border-0 bg-white">
              <CardHeader className="bg-info-subtle border-0 d-flex align-items-center py-3 px-4">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-white p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <FaUniversity className="text-info" size={18} />
                  </div>
                  <h5 className="mb-0 text-dark">Subjects by Department</h5>
                </div>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  {Object.entries(subjectsByDepartment)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dept, count], idx) => (
                      <ListGroupItem 
                        key={idx}
                        className="d-flex justify-content-between align-items-center border-0 border-bottom py-3"
                      >
                        <div className="d-flex align-items-center">
                          <div className="me-3 bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                            <FaGraduationCap className="text-primary" size={16} />
                          </div>
                          <div>
                            <div className="fw-bold">{dept}</div>
                            <small className="text-muted">Department</small>
                          </div>
                        </div>
                        <Badge color="primary" pill className="bg-primary-subtle text-primary-emphasis px-3 py-2">
                          {count} subjects
                        </Badge>
                      </ListGroupItem>
                    ))}
                </ListGroup>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Subject;
