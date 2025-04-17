import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Autocomplete, 
    TextField, 
    Button, 
    Chip,
    Alert,
    CircularProgress 
} from '@mui/material';
import { baseUrl } from '../../shared/baseUrl';
import localStorage from 'local-storage';

function AddTeacherSubjects() {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const token = localStorage.get('token');
        if (!token) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Not authenticated. Please log in.'
            });
            return;
        }
        fetchTeachers();
        fetchSubjects();
    }, []);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.get('token')}`
    });

    const fetchTeachers = async () => {
        try {
            console.log('Fetching teachers...');
            const response = await fetch(baseUrl + 'admin/teachers', {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Teachers response:', data);
            
            if (data.success) {
                // Filter out admin users and ensure required fields exist
                const validTeachers = data.list.filter(teacher => 
                    !teacher.admin && 
                    teacher.name && 
                    teacher._id
                );
                setTeachers(validTeachers);
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: data.message || 'Failed to fetch teachers'
                });
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setAlert({
                show: true,
                type: 'error',
                message: `Failed to fetch teachers: ${error.message}`
            });
        }
    };

    const fetchSubjects = async () => {
        try {
            console.log('Fetching subjects with token:', localStorage.get('token'));
            const response = await fetch(baseUrl + 'admin/subject/all', {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Subjects response:', data);
            
            if (data.success) {
                setSubjects(data.list);
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: data.message || 'Failed to fetch subjects'
                });
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setAlert({
                show: true,
                type: 'error',
                message: `Failed to fetch subjects: ${error.message}`
            });
        }
    };

    const handleSubmit = async () => {
        if (!selectedTeacher || selectedSubjects.length === 0) return;

        setLoading(true);
        try {
            const response = await fetch(baseUrl + 'admin/teachersubjects/add', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    teacherId: selectedTeacher._id,
                    subjectIds: selectedSubjects.map(s => s._id)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Subjects assigned successfully'
                });
                setSelectedSubjects([]);
                setSelectedTeacher(null);
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: data.message || 'Failed to assign subjects'
                });
            }
        } catch (error) {
            console.error('Error assigning subjects:', error);
            setAlert({
                show: true,
                type: 'error',
                message: `Failed to assign subjects: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {alert.show && (
                <Alert severity={alert.type} onClose={() => setAlert({ ...alert, show: false })}>
                    {alert.message}
                </Alert>
            )}

            <Autocomplete
                options={teachers}
                getOptionLabel={(option) => `${option.name}${option.username ? ` (${option.username})` : ''}`}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="Select Teacher" 
                        error={alert.show && alert.type === 'error' && alert.message.includes('teachers')}
                        helperText={alert.show && alert.type === 'error' && alert.message.includes('teachers') ? alert.message : ''}
                    />
                )}
                value={selectedTeacher}
                onChange={(event, newValue) => setSelectedTeacher(newValue)}
                loading={loading}
                loadingText="Loading teachers..."
                noOptionsText="No teachers found"
            />

            <Autocomplete
                multiple
                options={subjects}
                getOptionLabel={(option) => `${option.name || ''} (${option.code || ''})`}
                value={selectedSubjects}
                onChange={(event, newValue) => setSelectedSubjects(newValue)}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            key={option._id}
                            label={`${option.name || ''} (${option.code || ''})`}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="Select Subjects"
                        error={alert.show && alert.type === 'error' && alert.message.includes('subjects')}
                        helperText={alert.show && alert.type === 'error' && alert.message.includes('subjects') ? alert.message : ''}
                    />
                )}
                loading={loading}
                loadingText="Loading subjects..."
                noOptionsText="No subjects found"
            />

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedTeacher || selectedSubjects.length === 0 || loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Assign Subjects'}
            </Button>
        </Box>
    );
}

export default AddTeacherSubjects; 