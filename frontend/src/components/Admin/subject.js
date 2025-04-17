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
    e.preventDefault(); // Prevent form submission refresh

    setIsLoading(true);
    try {
      // Only make the API call if either a subject code or all three filters are provided
      const hasAllFilters = ldept?.value && lyear?.value && lsem?.value;
      const hasCode = lcode;

      if (!hasAllFilters && !hasCode) {
        // If no filters, get all subjects
        console.log("Fetching all subjects...");
      }

      const res = await getSubjects({
        name: ldept?.value || '',
        year: lyear?.value || '',
        sem: lsem?.value || '',
        code: lcode || '',
      });

      const result = await res.json();
      console.log("Subjects response:", result);

      if (result.success) {
        const formattedList = result.list.map(sub => ({
          sname: sub.name || sub.sname,
          scode: sub.code || sub.scode,
          dname: sub.department?.value || sub.dname,
          year: sub.department?.year || sub.year,
          sem: sub.department?.semester || sub.sem
        }));
        setSubjectList(formattedList);

        // Only clear filters if the request was successful
        if (result.success) {
          setLdept('');
          setLyear('');
          setLsem('');
          setLcode('');
        }
      } else {
        alert('No matching subjects found');
        setSubjectList([]);
      }
    } catch (error) {
      console.error('Error listing subjects:', error);
      alert('Error fetching subjects. Please try again.');
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
                  onChange={(value) => {
                    setLdept(value);
                    // Clear code when using filters
                    setLcode('');
                  }}
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
                  onChange={(value) => {
                    setLyear(value);
                    // Clear code when using filters
                    setLcode('');
                  }}
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
                  onChange={(value) => {
                    setLsem(value);
                    // Clear code when using filters
                    setLcode('');
                  }}
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
              onChange={(e) => {
                setLcode(e.target.value);
                // Clear filters when using code
                setLdept('');
                setLyear('');
                setLsem('');
              }}
            />
            <FormText>Eg: A21AB</FormText>
          </FormGroup>
          <Button 
            color="info" 
            type="submit" 
            style={{ marginLeft: '40%' }}
            onClick={listSubjects}
          >
            Submit
          </Button>
        </Form>
        {subjectList.length > 0 && (
          <Table hover style={{ marginTop: '20px' }}>
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
        )}
      </UncontrolledCollapse>
    </div>
  );
};

export default Subject;
