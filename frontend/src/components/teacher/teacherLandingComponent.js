import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaFileAlt,
  FaBrain,
  FaEdit,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaHistory
} from "react-icons/fa";
import { baseUrl } from "../../url";
import { getAuthHeaders } from "../ActionCreators";
import localStorage from "local-storage";
import moment from 'moment';

const TeacherLandingComponent = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    papersGenerated: 0,
    totalSubjects: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.get('user');
        console.log('User from localStorage:', user);

        if (!user || !user.id) {
          console.error('No user ID found in localStorage');
          return;
        }

        // Fetch stats and activities from the new endpoint
        console.log('Fetching stats for user:', user.id);
        const response = await fetch(`${baseUrl}/teacher/stats/${user.id}`, {
          headers: getAuthHeaders(),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok && data.success) {
          console.log('Setting stats:', data.stats);
          console.log('Setting activities:', data.recentActivities);
          setStats({
            totalQuestions: data.stats.totalQuestions || 0,
            papersGenerated: data.stats.papersGenerated || 0,
            totalSubjects: data.stats.totalSubjects || 0
          });
          setActivities(data.recentActivities || []);
        } else {
          console.error('Error in response:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatActivityType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const ActionCard = ({ icon: Icon, title, description, link, color }) => (
    <Card className="h-100 border-0 shadow-sm hover-shadow">
      <CardBody className="d-flex flex-column">
        <div className={`rounded-circle bg-${color} p-3 mb-4 align-self-start`} style={{ width: 'fit-content' }}>
          <Icon size={24} className="text-white" />
        </div>
        <h4 className="mb-3">{title}</h4>
        <p className="text-muted mb-4">{description}</p>
        <Button
          tag={Link}
          to={link}
          color={color}
          className="mt-auto d-flex align-items-center justify-content-center"
          style={{ gap: '0.5rem' }}
        >
          Get Started <FaArrowRight />
        </Button>
      </CardBody>
    </Card>
  );

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card className="border-0 shadow-sm mb-4">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className={`rounded-circle bg-${color} bg-opacity-10 p-3 me-3`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
          <div>
            <h3 className="mb-0 fw-bold">{value}</h3>
            <p className="text-muted mb-0">{title}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div 
        className="py-5 mb-5 text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-4">Welcome to Your Dashboard</h1>
              <p className="lead mb-4">
                Manage your question papers, generate new questions, and track your progress all in one place.
              </p>
            </Col>
            <Col md={5}>
              <img
                src="/dashboard-illustration.svg"
                alt="Dashboard"
                className="img-fluid"
                style={{ maxHeight: '300px' }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mb-5">
        {/* Stats Section */}
        <Row className="mb-5">
          <Col md={4}>
            <StatCard
              icon={FaFileAlt}
              title="Total Questions"
              value={stats.totalQuestions}
              color="primary"
            />
          </Col>
          <Col md={4}>
            <StatCard
              icon={FaChartLine}
              title="Papers Generated"
              value={stats.papersGenerated}
              color="success"
            />
          </Col>
          <Col md={4}>
            <StatCard
              icon={FaCheckCircle}
              title="Assigned Subjects"
              value={stats.totalSubjects}
              color="info"
            />
          </Col>
        </Row>

        <Row>
          {/* Actions Section */}
          <Col lg={8}>
            <h2 className="mb-4">Quick Actions</h2>
            <Row className="g-4">
              <Col md={6}>
                <ActionCard
                  icon={FaPlus}
                  title="Add Questions"
                  description="Create and add new questions to your question bank"
                  link="/teacher/insert"
                  color="primary"
                />
              </Col>
              <Col md={6}>
                <ActionCard
                  icon={FaFileAlt}
                  title="Generate Paper"
                  description="Create new question papers from your question bank"
                  link="/teacher/generate"
                  color="success"
                />
              </Col>
              <Col md={6}>
                <ActionCard
                  icon={FaBrain}
                  title="AI Questions"
                  description="Generate questions automatically using AI"
                  link="/teacher/generate-questions"
                  color="info"
                />
              </Col>
              <Col md={6}>
                <ActionCard
                  icon={FaEdit}
                  title="Manage Questions"
                  description="Edit or remove existing questions"
                  link="/teacher/edit"
                  color="warning"
                />
              </Col>
            </Row>
          </Col>

          {/* Recent Activity Section */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex align-items-center mb-4">
                  <FaHistory className="text-primary me-2" size={24} />
                  <h2 className="mb-0">Recent Activity</h2>
                </div>
                <ListGroup flush>
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <ListGroupItem key={index} className="border-0 px-0 py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">{activity.description}</p>
                            <small className="text-muted">
                              {new Date(activity.timestamp).toLocaleString()}
                            </small>
                          </div>
                          <Badge 
                            color={
                              activity.type.includes('ERROR') ? 'danger' :
                              activity.type.includes('GENERATED') ? 'success' :
                              'primary'
                            } 
                            pill
                          >
                            {formatActivityType(activity.type)}
                          </Badge>
                        </div>
                      </ListGroupItem>
                    ))
                  ) : (
                    <ListGroupItem className="border-0 px-0 py-2 text-center text-muted">
                      No recent activities
                    </ListGroupItem>
                  )}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TeacherLandingComponent; 