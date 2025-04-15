import React, { useState, useEffect } from 'react';
import {
    Box,
    Autocomplete,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Alert,
    CircularProgress,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { baseUrl } from '../../shared/baseUrl';
import localStorage from 'local-storage';

function RemoveTeacherSubjects() {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
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
    }, []);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.get('token')}`
    });

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await fetch(baseUrl + 'admin/teachers', {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                // Filter out admin users and ensure required fields exist
                const validTeachers = data.list.filter(teacher => 
                    !teacher.admin && 
                    (teacher.name || teacher.username) && 
                    teacher._id
                );
                setTeachers(validTeachers);
            } else {
                throw new Error(data.message || 'Failed to fetch teachers');
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setAlert({
                show: true,
                type: 'error',
                message: `Failed to fetch teachers: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSubject = async (subjectId) => {
        if (!selectedTeacher) return;

        setLoading(true);
        try {
            const response = await fetch(baseUrl + 'admin/teachersubjects/remove', {
                method: 'DELETE',
                headers: {
                    ...getAuthHeaders(),
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    teacherId: selectedTeacher._id,
                    subjectId: subjectId.toString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setSelectedTeacher({
                    ...selectedTeacher,
                    teachingSubjects: selectedTeacher.teachingSubjects.filter(
                        s => s._id !== subjectId
                    )
                });
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Subject removed successfully'
                });
            } else {
                throw new Error(data.message || 'Failed to remove subject');
            }
        } catch (error) {
            console.error('Error removing subject:', error);
            setAlert({
                show: true,
                type: 'error',
                message: `Failed to remove subject: ${error.message}`
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
                getOptionLabel={(option) => `${option.name || option.username}${option.username && option.name ? ` (${option.username})` : ''}`}
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                </Box>
            ) : selectedTeacher ? (
                selectedTeacher.teachingSubjects?.length > 0 ? (
                    <List>
                        {selectedTeacher.teachingSubjects.map((subject) => (
                            <ListItem key={subject._id}>
                                <ListItemText
                                    primary={subject.name}
                                    secondary={subject.code}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleRemoveSubject(subject._id)}
                                        disabled={loading}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography color="textSecondary" align="center">
                        This teacher has no assigned subjects
                    </Typography>
                )
            ) : null}
        </Box>
    );
}

export default RemoveTeacherSubjects; 