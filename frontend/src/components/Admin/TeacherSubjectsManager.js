import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import AddTeacherSubjects from '../Admin/AddTeacherSubjects';
import RemoveTeacherSubjects from '../Admin/RemoveTeacherSubjects';

function TeacherSubjectsManager() {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Paper sx={{ p: 2, margin: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="Add Subjects to Teachers" />
                    <Tab label="Remove Subjects from Teachers" />
                </Tabs>
            </Box>
            
            {currentTab === 0 && <AddTeacherSubjects />}
            {currentTab === 1 && <RemoveTeacherSubjects />}
        </Paper>
    );
}

export default TeacherSubjectsManager; 