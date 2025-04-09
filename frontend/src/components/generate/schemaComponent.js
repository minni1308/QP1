import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import Select from "react-select";
import Custome from "./customeComponent";
import { getSubjectDetails } from "../ActionCreators";
import DatePicker from "react-datepicker";
import { WaveTopBottomLoading } from "react-loadingg";
import localStorage from "local-storage";
import axios from "axios";
import { saveAs } from "file-saver";
import { baseUrl } from "../../url";
import TimePicker from "react-time-picker";
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
    start: "",
    end: "",
  });

  const examOptions = [
    { label: "Mid 1", value: "mid1" },
    { label: "Mid 2", value: "mid2" },
    { label: "Semester", value: "sem" },
    { label: "Custom", value: "custom" },
  ];

  useEffect(() => {
    if (subjects.length === 0) {
      getSubjectDetails()
        .then((res) => res.json())
        .then((res) => {
          const formatted = res.map((el) => ({
            label: el.subject.name,
            value: el.subject.code,
            id: el._id,
            deptYear: el.subject.department.year,
            deptSem: el.subject.department.semester,
          }));
          setSubjects(formatted);
        })
        .catch(() => {
          alert("Cannot Connect to Server!!!, Logging Out...");
          localStorage.clear();
          window.location.reload();
        });
    }
  }, []);

  const handleSubjectChange = (e) => setSelectedSubject(e);
  const handleTypeChange = (e) => {
    setSelectedType(e);
    setExamType(e.value);
  };

  const handleMonth = (date) => setMids({ ...mids, month: date });
  const handleDate = (date) => setMids({ ...mids, date: date });
  const handleStart = (value) => setMids({ ...mids, start: value });
  const handleEnd = (value) => setMids({ ...mids, end: value });
  const handleMonth1 = (date) => setMy(date);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const mer = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour < 10 ? "0" + formattedHour : formattedHour}:${minute} ${mer}`;
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
      start: formatTime(mids.start),
      end: formatTime(mids.end),
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
      start: "",
      end: "",
    });
    setMy(new Date());
  };

  if (isLoading) return <WaveTopBottomLoading />;

  let conditionalForm = <></>;

  if (selectedSubject && selectedType) {
    if (selectedType.value === "sem") {
      conditionalForm = (
        <div style={{ marginTop: "3%" }}>
          <Form onSubmit={handleSubmit1}>
            <FormGroup>
              <Label>Month and Year:</Label>
              <br />
              <DatePicker
                required
                selected={my}
                onChange={handleMonth1}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                minDate={new Date()}
              />
            </FormGroup>
            <Button type="submit" color="primary" style={{ margin: "7px" }}>
              Submit
            </Button>
          </Form>
        </div>
      );
    } else if (selectedType.value === "custom") {
      conditionalForm = (
        <Custome handleSchema={handleSchema} subject={selectedSubject} />
      );
    } else {
      conditionalForm = (
        <div style={{ width: "70%" }}>
          <Form onSubmit={handleSubmit2}>
            <Row md={12}>
              <Col md={12} lg={6}>
                <FormGroup>
                  <Label>Select Month and Year</Label>
                  <DatePicker
                    required
                    selected={mids.month}
                    onChange={handleMonth}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    minDate={new Date()}
                  />
                </FormGroup>
              </Col>
              <Col md={12} lg={6}>
                <FormGroup>
                  <Label>Date of Exam</Label>
                  <DatePicker
                    required
                    selected={mids.date}
                    onChange={handleDate}
                    minDate={new Date()}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row md={12}>
              <Col md={12} lg={6}>
                <FormGroup>
                  <Label>Start Time</Label>
                  <TimePicker
                    onChange={handleStart}
                    value={mids.start}
                    clockIcon={null}
                    disableClock={true}
                  />
                </FormGroup>
              </Col>
              <Col md={12} lg={6}>
                <FormGroup>
                  <Label>End Time</Label>
                  <TimePicker
                    onChange={handleEnd}
                    value={mids.end}
                    clockIcon={null}
                    disableClock={true}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit" color="primary" style={{ margin: "7px" }}>
              Submit
            </Button>
          </Form>
        </div>
      );
    }
  }

  return (
    <div style={{ width: "80%", margin: "3%" }}>
      <label>Select Subject</label>
      <Select
        name="subject"
        options={subjects}
        onChange={handleSubjectChange}
        value={selectedSubject}
        onMenuOpen={() => setSelectedSubject("")}
      />
      <label>Select Exam Type</label>
      <Select
        name="exam"
        options={examOptions}
        onChange={handleTypeChange}
        value={selectedType}
        onMenuOpen={() => setSelectedType("")}
      />
      {conditionalForm}
    </div>
  );
};

export default Schema;
