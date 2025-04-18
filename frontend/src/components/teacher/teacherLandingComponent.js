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
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Progress
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
  FaHistory,
  FaLayerGroup,
  FaBookOpen,
  FaBook,
  FaGraduationCap,
  FaChartBar
} from "react-icons/fa";
import { baseUrl } from "../../url";
import { getAuthHeaders } from "../ActionCreators";
import localStorage from "local-storage";
import classnames from "classnames";

const TeacherLandingComponent = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    papersGenerated: 0,
    totalSubjects: 0,
    unitStats: {
      u1: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
      u2: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
      u3: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
      u4: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
      u5: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 }
    },
    difficultyTotals: {
      easy: 0,
      medium: 0,
      hard: 0,
      mcq: 0
    },
    subjectStats: {}
  });
  const [activeTab, setActiveTab] = useState('overview');
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
            totalSubjects: data.stats.totalSubjects || 0,
            unitStats: data.stats.unitStats || {
              u1: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
              u2: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
              u3: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
              u4: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 },
              u5: { easy: 0, medium: 0, hard: 0, mcq: 0, total: 0 }
            },
            difficultyTotals: data.stats.difficultyTotals || {
              easy: 0,
              medium: 0,
              hard: 0,
              mcq: 0
            },
            subjectStats: data.stats.subjectStats || {}
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

  const difficultyColors = {
    easy: "#28a745",
    medium: "#fd7e14",
    hard: "#dc3545",
    mcq: "#007bff"
  };

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
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
          <div 
            className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center`}
            style={{ 
              width: '70px', 
              height: '70px', 
              background: color === 'primary' ? '#007bff' : 
                        color === 'success' ? '#28a745' : 
                        color === 'info' ? '#17a2b8' : '#6c757d',
              boxShadow: `0 4px 10px rgba(0,0,0,0.15)`,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div className="position-absolute" style={{
              width: '120%',
              height: '120%',
              top: '-10%',
              left: '-10%',
              background: `radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)`
            }}></div>
            <Icon size={30} className="text-white position-relative" />
          </div>
          <div>
            <h3 className="mb-0 fw-bold">{value}</h3>
            <p className="text-muted mb-0">{title}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const DifficultyStatCard = ({ difficulty, count, total }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    const color = difficultyColors[difficulty];
    const title = difficulty === 'mcq' ? 'MCQ' : 
                 difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    return (
      <Col md={3} className="mb-4">
        <Card className="border-0 shadow-sm h-100">
          <CardBody className="d-flex flex-column">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle" style={{ 
                width: '15px', 
                height: '15px', 
                backgroundColor: color,
                marginRight: '10px'
              }}></div>
              <h5 className="mb-0">{title}</h5>
            </div>
            
            <div className="mt-2">
              <h3 className="mb-0">{count}</h3>
              <p className="text-muted small mb-1">Questions</p>
            </div>
            
            <div className="mt-auto pt-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="small">{percentage}%</span>
                <span className="small text-muted">of total</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                  aria-valuenow={percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  };

  // Add Subject Card component
  const SubjectCard = ({ subject }) => {
    const totalByType = subject.byDifficulty;
    const totalByUnit = subject.byUnit;
    
    // Calculate percentages for chart
    const total = subject.totalQuestions;
    const percentages = {
      easy: Math.round((totalByType.easy / total) * 100) || 0,
      medium: Math.round((totalByType.medium / total) * 100) || 0,
      hard: Math.round((totalByType.hard / total) * 100) || 0,
      mcq: Math.round((totalByType.mcq / total) * 100) || 0
    };
    
    return (
      <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0">{subject.name}</h4>
              <p className="text-muted small mb-0">{subject.code}</p>
            </div>
            <Badge color="primary" pill className="px-3 py-2">
              {subject.totalQuestions} Questions
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-1">
              <span className="small">Difficulty Distribution</span>
            </div>
            <div className="progress mb-3" style={{ height: '20px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${percentages.easy}%` }}
                aria-valuenow={percentages.easy} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {totalByType.easy > 0 ? `Easy ${totalByType.easy}` : ''}
              </div>
              <div 
                className="progress-bar bg-warning" 
                role="progressbar" 
                style={{ width: `${percentages.medium}%` }}
                aria-valuenow={percentages.medium} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {totalByType.medium > 0 ? `Medium ${totalByType.medium}` : ''}
              </div>
              <div 
                className="progress-bar bg-danger" 
                role="progressbar" 
                style={{ width: `${percentages.hard}%` }}
                aria-valuenow={percentages.hard} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {totalByType.hard > 0 ? `Hard ${totalByType.hard}` : ''}
              </div>
              <div 
                className="progress-bar bg-primary" 
                role="progressbar" 
                style={{ width: `${percentages.mcq}%` }}
                aria-valuenow={percentages.mcq} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                {totalByType.mcq > 0 ? `MCQ ${totalByType.mcq}` : ''}
              </div>
            </div>
          </div>
          
          <div>
            <div className="d-flex justify-content-between mb-1">
              <span className="small">Unit Distribution</span>
            </div>
            <Row className="g-2">
              {Object.entries(totalByUnit).map(([unit, count]) => (
                <Col xs={6} md={4} lg={2} key={unit}>
                  <Card className="border-0 bg-light mb-1">
                    <CardBody className="p-2 text-center">
                      <div className="small fw-bold">Unit {unit.substring(1)}</div>
                      <div>{count}</div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </CardBody>
      </Card>
    );
  };

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
            <Col md={5} className="text-center">
              {/* Custom SVG Dashboard Illustration */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 500 400" 
                width="100%" 
                height="300"
                style={{ maxHeight: '300px' }}
                role="img"
                aria-label="Dashboard Illustration"
              >
                <defs>
                  <linearGradient id="gradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4"/>
                  </linearGradient>
                  <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e3c72" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#2a5298" stopOpacity="0.9"/>
                  </linearGradient>
                </defs>
                
                {/* Main Device */}
                <rect x="100" y="50" width="300" height="220" rx="10" fill="#ffffff" stroke="#e0e0e0" strokeWidth="2"/>
                <rect x="110" y="70" width="280" height="180" rx="5" fill="#f5f7fb"/>
                
                {/* Screen Elements */}
                <rect x="130" y="90" width="80" height="15" rx="3" fill="url(#gradBlue)"/>
                <rect x="130" y="115" width="240" height="8" rx="2" fill="#e0e0e0"/>
                <rect x="130" y="130" width="200" height="8" rx="2" fill="#e0e0e0"/>
                <rect x="130" y="145" width="220" height="8" rx="2" fill="#e0e0e0"/>
                
                {/* Stats Bars */}
                <rect x="130" y="170" width="50" height="40" rx="5" fill="#007bff"/>
                <rect x="190" y="170" width="50" height="40" rx="5" fill="#28a745"/>
                <rect x="250" y="170" width="50" height="40" rx="5" fill="#17a2b8"/>
                
                {/* Small Decorative Elements */}
                <circle cx="340" cy="100" r="15" fill="#f8d7da"/>
                <circle cx="370" cy="100" r="10" fill="#d1ecf1"/>
                
                {/* Document Icon */}
                <g transform="translate(400, 140) scale(0.8)">
                  <rect x="-30" y="-40" width="60" height="80" rx="5" fill="#ffffff" stroke="#6c757d" strokeWidth="2"/>
                  <line x1="-15" y1="-20" x2="15" y2="-20" stroke="#6c757d" strokeWidth="2"/>
                  <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#6c757d" strokeWidth="2"/>
                  <line x1="-15" y1="10" x2="15" y2="10" stroke="#6c757d" strokeWidth="2"/>
                  <line x1="-15" y1="25" x2="5" y2="25" stroke="#6c757d" strokeWidth="2"/>
                </g>
                
                {/* Stand */}
                <path d="M230,270 L200,330 L300,330 L270,270" fill="#d1d1d1"/>
                <ellipse cx="250" cy="330" rx="60" ry="10" fill="#a0a0a0"/>
                
                {/* Reflection */}
                <rect x="110" y="70" width="280" height="40" rx="5" fill="url(#gradLight)" opacity="0.5"/>
              </svg>
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

        {/* Difficulty Breakdown Section */}
        <Card className="border-0 shadow-sm mb-5">
          <CardBody>
            <div className="d-flex align-items-center mb-4">
              <FaLayerGroup className="text-primary me-2" size={24} />
              <h2 className="mb-0">Question Stats</h2>
            </div>
            
            <Nav tabs className="mb-4">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'overview' })}
                  onClick={() => toggle('overview')}
                  style={{ cursor: 'pointer' }}
                >
                  <FaChartLine className="me-2" size={14} />
                  Overview
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'unitwise' })}
                  onClick={() => toggle('unitwise')}
                  style={{ cursor: 'pointer' }}
                >
                  <FaBookOpen className="me-2" size={14} />
                  Unit-wise
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'subjects' })}
                  onClick={() => toggle('subjects')}
                  style={{ cursor: 'pointer' }}
                >
                  <FaBook className="me-2" size={14} />
                  By Subject
                </NavLink>
              </NavItem>
            </Nav>
            
            <TabContent activeTab={activeTab}>
              <TabPane tabId="overview">
                <Row>
                  <DifficultyStatCard 
                    difficulty="easy" 
                    count={stats.difficultyTotals.easy} 
                    total={stats.totalQuestions} 
                  />
                  <DifficultyStatCard 
                    difficulty="medium" 
                    count={stats.difficultyTotals.medium} 
                    total={stats.totalQuestions} 
                  />
                  <DifficultyStatCard 
                    difficulty="hard" 
                    count={stats.difficultyTotals.hard} 
                    total={stats.totalQuestions} 
                  />
                  <DifficultyStatCard 
                    difficulty="mcq" 
                    count={stats.difficultyTotals.mcq} 
                    total={stats.totalQuestions} 
                  />
                </Row>
              </TabPane>
              
              <TabPane tabId="unitwise">
                <Table responsive className="table-borderless">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th className="text-center">
                        <Badge pill color="success" className="px-3 py-2">Easy</Badge>
                      </th>
                      <th className="text-center">
                        <Badge pill color="warning" className="px-3 py-2">Medium</Badge>
                      </th>
                      <th className="text-center">
                        <Badge pill color="danger" className="px-3 py-2">Hard</Badge>
                      </th>
                      <th className="text-center">
                        <Badge pill color="primary" className="px-3 py-2">MCQ</Badge>
                      </th>
                      <th className="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.unitStats).map(([unit, data]) => (
                      <tr key={unit}>
                        <td className="fw-bold">Unit {unit.substring(1)}</td>
                        <td className="text-center">{data.easy}</td>
                        <td className="text-center">{data.medium}</td>
                        <td className="text-center">{data.hard}</td>
                        <td className="text-center">{data.mcq}</td>
                        <td className="text-center fw-bold">{data.total}</td>
                      </tr>
                    ))}
                    <tr className="bg-light">
                      <td className="fw-bold">Total</td>
                      <td className="text-center fw-bold">{stats.difficultyTotals.easy}</td>
                      <td className="text-center fw-bold">{stats.difficultyTotals.medium}</td>
                      <td className="text-center fw-bold">{stats.difficultyTotals.hard}</td>
                      <td className="text-center fw-bold">{stats.difficultyTotals.mcq}</td>
                      <td className="text-center fw-bold">{stats.totalQuestions}</td>
                    </tr>
                  </tbody>
                </Table>
              </TabPane>
              
              <TabPane tabId="subjects">
                {Object.keys(stats.subjectStats).length > 0 ? (
                  <>
                    {Object.values(stats.subjectStats).map((subject, index) => (
                      <SubjectCard key={index} subject={subject} />
                    ))}
                  </>
                ) : (
                  <div className="text-center p-5 text-muted">
                    <FaGraduationCap size={50} className="mb-3 text-muted opacity-50" />
                    <h5>No subjects assigned yet</h5>
                    <p>Subjects will appear here once you have been assigned subjects and created questions</p>
                  </div>
                )}
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>

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