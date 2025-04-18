import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Badge,
  Alert,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaBook, FaChalkboardTeacher, FaCog } from 'react-icons/fa';
import { getDepartment, getSubjects } from '../ActionCreators';
import localStorage from 'local-storage';
import { baseUrl } from '../../url';
import { getAuthHeaders } from '../ActionCreators';

const AdminHome = () => {
  const [stats, setStats] = useState({
    departments: 0,
    subjects: 0,
    teachers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch departments
        const deptResponse = await getDepartment();
        if (!deptResponse.ok) {
          throw new Error('Failed to fetch departments');
        }
        const deptData = await deptResponse.json();
        console.log('Department data:', deptData);

        // Fetch subjects using getSubjects function
        const subjResponse = await getSubjects({});
        if (!subjResponse.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const subjData = await subjResponse.json();
        console.log('Subject data:', subjData);

        // Fetch teachers
        const teacherResponse = await fetch(`${baseUrl}/admin/teachers`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (!teacherResponse.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const teacherData = await teacherResponse.json();
        console.log('Teacher data:', teacherData);

        // Fetch recent activities
        const activitiesResponse = await fetch(`${baseUrl}/admin/activities`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData.activities || []);
        }

        // Update stats only if we have valid data
        if (deptData.success && subjData.success && teacherData.success) {
          setStats({
            departments: Array.isArray(deptData.list) ? deptData.list.length : 0,
            subjects: Array.isArray(subjData.list) ? subjData.list.length : 0,
            teachers: Array.isArray(teacherData.list) 
              ? teacherData.list.filter(teacher => !teacher.admin).length // Only count non-admin teachers
              : 0,
          });
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error details:', err);
        setError(err.message || 'Failed to load statistics');
        // Set default values in case of error
        setStats({
          departments: 0,
          subjects: 0,
          teachers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const QuickAccessCard = ({ title, description, icon: Icon, link, color }) => (
    <Card className="mb-4 h-100" style={{ border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <CardBody className="d-flex flex-column align-items-center text-center">
        <div className="d-flex flex-column align-items-center">
          <div 
            className={`rounded-circle p-2 bg-${color} text-white mb-3`} 
            style={{ 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            <Icon size={18} />
          </div>
          <CardTitle tag="h5" className="mb-2">{title}</CardTitle>
        </div>
        <CardText className="text-muted mb-4">{description}</CardText>
        <Button
          tag={Link}
          to={link}
          color={color}
          className="mt-auto"
          style={{ width: 'fit-content' }}
        >
          Manage
        </Button>
      </CardBody>
    </Card>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="mb-4" style={{ border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <CardBody className="text-center">
        <div className="d-flex flex-column align-items-center">
          <div 
            className={`rounded-circle p-2 bg-${color} text-white mb-3`} 
            style={{ 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            <Icon size={18} />
          </div>
          <div className="text-center">
            <CardTitle tag="h6" className="mb-2">{title}</CardTitle>
            <CardText className="mb-0" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
              {value}
            </CardText>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <Container className="mt-5">
        <Alert color="info">Loading dashboard...</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert color="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {/* Statistics Section */}
      <Row className="mb-4">
        <Col md={4}>
          <StatCard
            title="Departments"
            value={stats.departments}
            icon={FaUsers}
            color="primary"
          />
        </Col>
        <Col md={4}>
          <StatCard
            title="Subjects"
            value={stats.subjects}
            icon={FaBook}
            color="success"
          />
        </Col>
        <Col md={4}>
          <StatCard
            title="Teachers"
            value={stats.teachers}
            icon={FaChalkboardTeacher}
            color="info"
          />
        </Col>
      </Row>

      {/* Quick Access Section */}
      <h4 className="mb-3">Quick Access</h4>
      <Row>
        <Col md={6} lg={3}>
          <QuickAccessCard
            title="Departments"
            description="Manage academic departments and their configurations"
            icon={FaUsers}
            link="/admin/department"
            color="primary"
          />
        </Col>
        <Col md={6} lg={3}>
          <QuickAccessCard
            title="Subjects"
            description="Add, remove, and manage subjects across departments"
            icon={FaBook}
            link="/admin/subject"
            color="success"
          />
        </Col>
        <Col md={6} lg={3}>
          <QuickAccessCard
            title="Teacher Subjects"
            description="Assign and manage subjects for teachers"
            icon={FaChalkboardTeacher}
            link="/admin/teacher-subjects"
            color="info"
          />
        </Col>
        <Col md={6} lg={3}>
          <QuickAccessCard
            title="Settings"
            description="Configure system settings and preferences"
            icon={FaCog}
            link="/admin/profile"
            color="secondary"
          />
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <Row className="mt-4">
        <Col>
          <Card style={{ border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <CardBody>
              <CardTitle tag="h5" className="mb-4">Recent Activity</CardTitle>
              {recentActivities.length > 0 ? (
                <div>
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={activity._id || index} 
                      className="d-flex align-items-center mb-3 p-2"
                      style={{ 
                        borderLeft: '3px solid #007bff',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}
                    >
                      <div className="ms-3">
                        <p className="mb-1" style={{ fontWeight: '500' }}>{activity.description}</p>
                        <small className="text-muted">
                          {new Date(activity.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">
                  <p>No recent activity to display</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;