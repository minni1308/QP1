import React, { useState, useEffect } from 'react';
import {
  UncontrolledCollapse,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
  Table,
} from 'reactstrap';
import { WaveLoading } from 'react-loadingg';
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
  const [ldept, setLdept] = useState('');
  const [lyear, setLyear] = useState('');
  const [lsem, setLsem] = useState('');
  const [lcode, setLcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (departmentList.length === 0) {
      setIsLoading(true);
      getDepartment()
        .then((resp) => resp.json())
        .then((res) => {
          if (res.success) {
            const formatted = res.list.map((d) => ({
              label: d,
              value: d,
            }));
            setDepartmentList(formatted);
          } else {
            alert('Failure loading departments');
          }
        })
        .catch(() => {
          alert('Please Login and Logout');
          localStorage.clear();
          window.location.reload();
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

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
      alert('Please enter all the details');
      return;
    }

    setIsLoading(true);
    try {
      const res = await addSubject(add);
      const result = await res.json();
      if (result.success) {
        alert('Subject added successfully');
        setAdd({ sname: '', scode: '', year: '', semester: '', department: '' });
      } else {
        alert('Unauthorized');
        localStorage.clear();
        window.location.reload();
      }
    } catch {
      alert('Please Login and Logout');
      localStorage.clear();
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubjects = async (e) => {
    e.preventDefault();
    if (!removeCode) return alert('Please input subject code');

    setIsLoading(true);
    try {
      const res = await removeSubject({ id: removeCode });
      const result = await res.json();
      if (result.success) {
        alert('Removed successfully');
        setRemoveCode('');
      } else {
        alert('Subject not found');
      }
    } catch {
      alert('Please Login and Logout');
      localStorage.clear();
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const listSubjects = async (e) => {
    e.preventDefault();

    if (!ldept && !lyear && !lcode) {
      alert('Please enter Department + Year + Semester or Subject Code');
      return;
    }

    setIsLoading(true);
    try {
      const res = await getSubjects({
        name: ldept?.value,
        year: lyear?.value,
        sem: lsem?.value,
        code: lcode,
      });
      const result = await res.json();
      if (result.success) {
        setSubjectList(result.list);
        setLdept('');
        setLyear('');
        setLsem('');
        setLcode('');
      } else {
        alert('No matching subjects found');
        setSubjectList([]);
      }
    } catch {
      alert('Please Login and Logout');
      localStorage.clear();
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <WaveLoading />;

  return (
    <div style={{ width: '50%', margin: '1em auto' }}>
      {/* Add Subject */}
      <Button block color="success" id="add" style={{ marginBottom: '1rem' }}>
        Add a new Subject
      </Button>
      <UncontrolledCollapse toggler="#add">
        <Form onSubmit={addSubjects}>
          <FormGroup>
            <Label for="sname">Name</Label>
            <Input
              type="text"
              name="sname"
              id="sname"
              placeholder="Subject Name"
              value={add.sname}
              onChange={handleAddChange}
              required
            />
            <FormText>Eg: Mathematics-I</FormText>
          </FormGroup>
          <FormGroup>
            <Label for="scode">Code</Label>
            <Input
              type="text"
              name="scode"
              id="scode"
              placeholder="Subject Code"
              value={add.scode}
              onChange={handleAddChange}
              required
            />
            <FormText>Eg: A21AB</FormText>
          </FormGroup>
          <FormGroup>
            <Label>Select Department</Label>
            <Select
              options={departmentList}
              value={add.department}
              onChange={(e) => handleAddSelect('department', e)}
              placeholder="Select Department"
              onMenuOpen={() => handleAddSelect('department', '')}
            />
          </FormGroup>
          <FormGroup>
            <Label>Select Year</Label>
            <Select
              options={years}
              value={add.year}
              onChange={(e) => handleAddSelect('year', e)}
              placeholder="Select Year"
              onMenuOpen={() => handleAddSelect('year', '')}
            />
          </FormGroup>
          <FormGroup>
            <Label>Select Semester</Label>
            <Select
              options={semesters}
              value={add.semester}
              onChange={(e) => handleAddSelect('semester', e)}
              placeholder="Select Semester"
              onMenuOpen={() => handleAddSelect('semester', '')}
            />
          </FormGroup>
          <Button color="primary" type="submit" style={{ marginLeft: '40%' }}>
            Submit
          </Button>
        </Form>
      </UncontrolledCollapse>

      {/* Remove Subject */}
      <Button block color="danger" id="remove" style={{ marginBottom: '1rem' }}>
        Remove a Subject
      </Button>
      <UncontrolledCollapse toggler="#remove">
        <Form onSubmit={removeSubjects}>
          <FormGroup>
            <Label>Enter Subject Code</Label>
            <Input
              type="text"
              name="scode"
              placeholder="Subject Code"
              value={removeCode}
              onChange={(e) => setRemoveCode(e.target.value)}
              required
            />
            <FormText>Eg: A21AB</FormText>
          </FormGroup>
          <Button color="danger" type="submit" style={{ marginLeft: '40%' }}>
            Remove
          </Button>
        </Form>
      </UncontrolledCollapse>

      {/* List Subjects */}
      <Button block color="info" id="list" style={{ marginBottom: '1rem' }}>
        List all Subjects in Department
      </Button>
      <UncontrolledCollapse toggler="#list">
        <Form onSubmit={listSubjects}>
          <Row>
            <Col>
              <FormGroup>
                <Label>Select Department</Label>
                <Select
                  options={departmentList}
                  value={ldept}
                  onChange={setLdept}
                  placeholder="Select Department"
                  onMenuOpen={() => setLdept('')}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Select Year</Label>
                <Select
                  options={years}
                  value={lyear}
                  onChange={setLyear}
                  placeholder="Select Year"
                  onMenuOpen={() => setLyear('')}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Select Semester</Label>
                <Select
                  options={semesters}
                  value={lsem}
                  onChange={setLsem}
                  placeholder="Select Semester"
                  onMenuOpen={() => setLsem('')}
                />
              </FormGroup>
            </Col>
          </Row>
          <h3 style={{ textAlign: 'center' }}>OR</h3>
          <FormGroup>
            <Label>Code</Label>
            <Input
              type="text"
              name="scode"
              placeholder="Subject Code"
              value={lcode}
              onChange={(e) => setLcode(e.target.value)}
            />
            <FormText>Eg: A21AB</FormText>
          </FormGroup>
          <Button color="info" type="submit" style={{ marginLeft: '40%' }}>
            Submit
          </Button>
        </Form>
        <Table hover>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Code</th>
              <th>Department</th>
              <th>Year</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {subjectList.map((ele, ind) => (
              <tr key={ind}>
                <th>{ind + 1}</th>
                <td>{ele.sname}</td>
                <td>{ele.scode}</td>
                <td>{ele.dname}</td>
                <td>{ele.year}</td>
                <td>{ele.sem}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </UncontrolledCollapse>
    </div>
  );
};

export default Subject;
