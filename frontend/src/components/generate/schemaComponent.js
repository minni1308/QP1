import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Container,
  Card,
  CardBody,
  Input,
} from "reactstrap";
import Select from "react-select";
import Custome from "./customeComponent";
import { getAuthHeaders } from "../ActionCreators";
import DatePicker from "react-datepicker";
import { WaveTopBottomLoading } from "react-loadingg";
import localStorage from "local-storage";
import axios from "axios";
import { saveAs } from "file-saver";
import { baseUrl } from "../../url";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Schema = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [my, setMy] = useState(new Date());
  const [examType, setExamType] = useState("");

  const [mids, setMids] = useState({
    month: new Date(),
    date: new Date(),
    start: {
      hours: "09",
      minutes: "00",
      period: "AM"
    },
    end: {
      hours: "12",
      minutes: "00",
      period: "PM"
    }
  });

  const examOptions = [
    { label: "Mid 1", value: "mid1" },
    { label: "Mid 2", value: "mid2" },
    { label: "Semester", value: "sem" },
    { label: "Custom", value: "custom" },
  ];

  useEffect(() => {
    if (subjects.length === 0) {
      setIsLoading(true);
      const user = localStorage.get('user');
      fetch(`${baseUrl}/admin/teachersubjects/${user.id}`, {
        headers: getAuthHeaders()
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch teacher subjects');
        }
        return res.json();
      })
      .then(data => {
        if (!data.success || !Array.isArray(data.subjects)) {
          console.warn('No subjects found or invalid response format');
          setSubjects([]);
          return;
        }

        const opts = data.subjects
          .filter(subj => subj && subj.name && subj.code) // Filter out invalid subjects
          .map((subj) => ({
            label: subj.name,            
            value: subj.code,
            id: subj._id,
            deptYear: subj.department.year,
            deptSem: subj.department.semester,
          }));
        
        if (opts.length === 0) {
          console.warn('No subjects assigned to this teacher');
        } else {
          console.log('Loaded subjects:', opts);
        }
        
        setSubjects(opts);
        setIsLoading(false);
      })
      .catch((err) => {
        alert("Cannot Connect to Server!!!, Logging Out...");
        console.log(err)
      });
    }
  }, [subjects.length]);

  const handleSubjectChange = (e) => setSelectedSubject(e);
  const handleTypeChange = (e) => {
    setSelectedType(e);
    setExamType(e.value);
  };

  const handleMonth = (date) => setMids({ ...mids, month: date });
  const handleDate = (date) => setMids({ ...mids, date: date });

  const handleMonth1 = (date) => setMy(date);

  const formatTimeForAPI = (timeObj) => {
    let hours = parseInt(timeObj.hours);
    if (timeObj.period === "PM" && hours !== 12) {
      hours += 12;
    } else if (timeObj.period === "AM" && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${timeObj.minutes}`;
  };

  const handleTimeChange = (type, field, value) => {
    setMids(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSchema = (sectionw) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const payload = {
      ...selectedSubject,
      ...sectionw,
      year: sectionw.my.getFullYear(),
      month: months[sectionw.my.getMonth()],
    };
    generateSchema(payload);
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedType) {
      alert("Please Enter Required Details");
      return;
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const payload = {
      ...selectedSubject,
      year: my.getFullYear(),
      month: months[my.getMonth()],
    };
    generatePdf(payload);
  };

  const handleSubmit2 = () => {
    if (!mids.date || !mids.month || !mids.start || !mids.end) {
      alert("Please fill all the details");
      return;
    }

    const fullMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formatted = {
      ...selectedSubject,
      year: mids.month.getFullYear(),
      month: fullMonths[mids.month.getMonth()],
      date: `${mids.date.getDate().toString().padStart(2, "0")}/${
        (mids.date.getMonth() + 1).toString().padStart(2, "0")
      }/${mids.date.getFullYear()}`,
      start: formatTimeForAPI(mids.start),
      end: formatTimeForAPI(mids.end),
    };

    if (examType === "mid1") generateMid("/teacher/mid1", formatted);
    else generateMid("/teacher/mid2", formatted);
  };

  const generateMid = async (url, details) => {
    try {
      setIsLoading(true);
      const bearer = "Bearer " + localStorage.get("token");
      const response = await axios.post(`${baseUrl}${url}`, details, {
        headers: { Authorization: bearer },
        responseType: "blob",
        timeout: 5000,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const timestamp = new Date();
      const fileName = `${details.value}_${timestamp.getHours()}_${timestamp.getMinutes()}.pdf`;
      saveAs(blob, fileName);
    } catch {
      alert("Cannot Generate Paper, not enough Questions in Subject");
    } finally {
      setIsLoading(false);
      resetForm();
    }
  };

  const generatePdf = async (details) => {
    try {
      setIsLoading(true);
      const bearer = "Bearer " + localStorage.get("token");
      const response = await axios.post(`${baseUrl}/teacher/semPaper`, details, {
        headers: { Authorization: bearer },
        responseType: "blob",
        timeout: 5000,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const timestamp = new Date();
      const fileName = `${details.value}_${timestamp.getHours()}_${timestamp.getMinutes()}.pdf`;
      saveAs(blob, fileName);
    } catch {
      alert("Cannot Generate Paper, not enough Questions in Subject");
    } finally {
      setIsLoading(false);
      resetForm();
    }
  };

  const generateSchema = async (details) => {
    try {
      setIsLoading(true);
      const bearer = "Bearer " + localStorage.get("token");
      const response = await axios.post(`${baseUrl}/teacher/schema`, details, {
        headers: { Authorization: bearer },
        responseType: "blob",
        timeout: 10000,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const timestamp = new Date();
      const fileName = `${details.value}_${timestamp.getHours()}_${timestamp.getMinutes()}.pdf`;
      saveAs(blob, fileName);
    } catch {
      alert("Cannot Generate Paper, not enough Questions in Subject");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSubject("");
    setSelectedType("");
    setMids({
      month: new Date(),
      date: new Date(),
      start: {
        hours: "09",
        minutes: "00",
        period: "AM"
      },
      end: {
        hours: "12",
        minutes: "00",
        period: "PM"
      }
    });
    setMy(new Date());
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #80bdff",
      },
      padding: "3px",
      marginBottom: "1rem"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#007bff" : state.isFocused ? "#f8f9fa" : "white",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      }
    })
  };

  const datePickerCustomStyles = {
    input: {
      borderRadius: "6px",
      border: "1px solid #ccc",
      padding: "8px 12px",
      width: "100%",
      marginBottom: "1rem"
    }
  };

  if (isLoading) return <WaveTopBottomLoading />;

  let conditionalForm = <></>;

  if (selectedSubject && selectedType) {
    if (selectedType.value === "sem") {
      conditionalForm = (
        <Card className="shadow-sm">
          <CardBody>
            <Form onSubmit={handleSubmit1}>
              <FormGroup>
                <Label className="text-muted mb-2">Month and Year</Label>
                <br />
                <DatePicker
                  required
                  selected={my}
                  onChange={handleMonth1}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  minDate={new Date()}
                  className="form-control"
                  wrapperClassName="w-100"
                />
              </FormGroup>
              <Button 
                type="submit" 
                color="primary" 
                className="w-100"
                style={{
                  borderRadius: "6px",
                  padding: "12px",
                  marginTop: "1rem"
                }}
              >
                Generate Paper
              </Button>
            </Form>
          </CardBody>
        </Card>
      );
    } else if (selectedType.value === "custom") {
      conditionalForm = (
        <Card className="shadow-sm mt-4">
          <CardBody>
            <Custome handleSchema={handleSchema} subject={selectedSubject} />
          </CardBody>
        </Card>
      );
    } else {
      conditionalForm = (
        <Card className="shadow-sm">
          <CardBody>
            <Form onSubmit={handleSubmit2}>
              <Row>
                <Col md={12} lg={6}>
                  <FormGroup>
                    <Label className="text-muted mb-2">Month and Year</Label>
                    <DatePicker
                      required
                      selected={mids.month}
                      onChange={handleMonth}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      minDate={new Date()}
                      className="form-control"
                      wrapperClassName="w-100"
                    />
                  </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                  <FormGroup>
                    <Label className="text-muted mb-2">Exam Date</Label>
                    <DatePicker
                      required
                      selected={mids.date}
                      onChange={handleDate}
                      minDate={new Date()}
                      className="form-control"
                      wrapperClassName="w-100"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={12} lg={6}>
                  <FormGroup>
                    <Label className="text-muted mb-2">Start Time</Label>
                    <div className="d-flex align-items-center time-input-container">
                      <Input
                        type="select"
                        value={mids.start.hours}
                        onChange={(e) => handleTimeChange("start", "hours", e.target.value)}
                        style={{ width: "80px", marginRight: "10px" }}
                        className="form-select"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </Input>
                      <span className="mx-1">:</span>
                      <Input
                        type="select"
                        value={mids.start.minutes}
                        onChange={(e) => handleTimeChange("start", "minutes", e.target.value)}
                        style={{ width: "80px", marginRight: "10px" }}
                        className="form-select"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={String(i * 5).padStart(2, '0')}>
                            {String(i * 5).padStart(2, '0')}
                          </option>
                        ))}
                      </Input>
                      <Input
                        type="select"
                        value={mids.start.period}
                        onChange={(e) => handleTimeChange("start", "period", e.target.value)}
                        style={{ width: "80px" }}
                        className="form-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                  <FormGroup>
                    <Label className="text-muted mb-2">End Time</Label>
                    <div className="d-flex align-items-center time-input-container">
                      <Input
                        type="select"
                        value={mids.end.hours}
                        onChange={(e) => handleTimeChange("end", "hours", e.target.value)}
                        style={{ width: "80px", marginRight: "10px" }}
                        className="form-select"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </Input>
                      <span className="mx-1">:</span>
                      <Input
                        type="select"
                        value={mids.end.minutes}
                        onChange={(e) => handleTimeChange("end", "minutes", e.target.value)}
                        style={{ width: "80px", marginRight: "10px" }}
                        className="form-select"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={String(i * 5).padStart(2, '0')}>
                            {String(i * 5).padStart(2, '0')}
                          </option>
                        ))}
                      </Input>
                      <Input
                        type="select"
                        value={mids.end.period}
                        onChange={(e) => handleTimeChange("end", "period", e.target.value)}
                        style={{ width: "80px" }}
                        className="form-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Button 
                type="submit" 
                color="primary" 
                className="w-100"
                style={{
                  borderRadius: "6px",
                  padding: "12px",
                  marginTop: "1rem"
                }}
              >
                Generate Paper
              </Button>
            </Form>
          </CardBody>
        </Card>
      );
    }
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <CardBody>
          <h2 className="text-center mb-4" style={{ color: "#333", fontWeight: "600" }}>
            Generate Question Paper
          </h2>
          
          <FormGroup>
            <Label className="text-muted mb-2">Subject</Label>
            <Select
              name="subject"
              options={subjects}
              onChange={handleSubjectChange}
              value={selectedSubject}
              onMenuOpen={() => setSelectedSubject("")}
              styles={customSelectStyles}
              placeholder="Select a subject"
              className="mb-4"
            />
          </FormGroup>

          <FormGroup>
            <Label className="text-muted mb-2">Exam Type</Label>
            <Select
              name="exam"
              options={examOptions}
              onChange={handleTypeChange}
              value={selectedType}
              onMenuOpen={() => setSelectedType("")}
              styles={customSelectStyles}
              placeholder="Select exam type"
              className="mb-4"
            />
          </FormGroup>

          {conditionalForm}
        </CardBody>
      </Card>
    </Container>
  );
};

export default Schema;

// Add these styles to your stylesheet
const styles = `
.time-input-container {
  background: white;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #dee2e6;
}

.time-input-container .form-select {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 16px 12px;
}

.time-input-container .form-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.time-input-container span {
  font-size: 1.2rem;
  color: #495057;
}
`;
