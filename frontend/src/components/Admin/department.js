import React, { useState } from 'react';
import {
  UncontrolledCollapse,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { WaveLoading } from 'react-loadingg';
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
        alert('Success');
        setAdd({ dname: '', dvalue: '' });
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

  const removeDepartments = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await removeDepartment(remove);
      const result = await res.json();
      if (result.success) {
        alert('Success');
        setRemove({ dname: '', dvalue: '' });
      } else {
        alert('Cannot find the department with name and value');
      }
    } catch {
      alert('Please Login and Logout');
      localStorage.clear();
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const getDepartments = async (e) => {
    e.preventDefault();

    if (departmentList.length > 0) {
      setDepartmentList([]); // toggle off
      return;
    }

    setIsLoading(true);
    try {
      const res = await getDepartment();
      const result = await res.json();
      if (result.success) {
        setDepartmentList(result.list);
      } else {
        alert('Failure');
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
      {/* Add Department */}
      <div>
        <Button block color="success" id="add" style={{ marginBottom: '1rem' }}>
          Add a new Department
        </Button>
        <UncontrolledCollapse toggler="#add">
          <Form onSubmit={addDepartments}>
            <FormGroup>
              <Label for="dname">Name</Label>
              <Input
                type="text"
                name="dname"
                id="dname"
                placeholder="Department Name"
                value={add.dname}
                onChange={handleAdd}
                required
              />
              <FormText color="muted">
                Eg: Computer Science and Engineering
              </FormText>
            </FormGroup>
            <FormGroup>
              <Label for="dvalue">Code</Label>
              <Input
                type="text"
                name="dvalue"
                id="dvalue"
                placeholder="Department Code"
                value={add.dvalue}
                onChange={handleAdd}
                required
              />
              <FormText color="muted">Eg: CSE</FormText>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              style={{ marginLeft: '40%', marginBottom: '20px' }}
            >
              Submit
            </Button>
          </Form>
        </UncontrolledCollapse>
      </div>

      {/* Remove Department */}
      <div>
        <Button block id="remove" color="danger" style={{ marginBottom: '1rem' }}>
          Remove a Department
        </Button>
        <UncontrolledCollapse toggler="#remove">
          <Form onSubmit={removeDepartments}>
            <FormGroup>
              <Label for="dname">Name</Label>
              <Input
                type="text"
                name="dname"
                id="dname"
                placeholder="Department Name"
                value={remove.dname}
                onChange={handleRemove}
                required
              />
              <FormText color="muted">
                Eg: Computer Science and Engineering
              </FormText>
            </FormGroup>
            <FormGroup>
              <Label for="dvalue">Code</Label>
              <Input
                type="text"
                name="dvalue"
                id="dvalue"
                placeholder="Department Code"
                value={remove.dvalue}
                onChange={handleRemove}
                required
              />
              <FormText color="muted">Eg: CSE</FormText>
            </FormGroup>
            <Button
              type="submit"
              color="danger"
              style={{ marginLeft: '40%', marginBottom: '20px' }}
            >
              Remove
            </Button>
          </Form>
        </UncontrolledCollapse>
      </div>

      {/* List Departments */}
      <div>
        <Button
          block
          color="info"
          style={{ marginBottom: '1rem' }}
          onClick={getDepartments}
        >
          List all the Departments
        </Button>
        <ListGroup>
          {departmentList.map((dep, index) => (
            <ListGroupItem key={index}>{dep}</ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Department;
