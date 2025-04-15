const express = require('express');
const router = express.Router();
const teachers = require('../../models/teachers');
const authenticate = require('../../authenticate');
const cors = require('../cors');

router.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            // Find all teachers and exclude admin users
            const teachersList = await teachers.find(
                { admin: false },
                'name username admin teachingSubjects'
            ).populate('teachingSubjects');

            if (!teachersList) {
                return res.status(200).json({
                    success: true,
                    list: []
                });
            }

            // Format the response
            const formattedList = teachersList.map(teacher => ({
                _id: teacher._id,
                name: teacher.name || teacher.username, // Fallback to username if name is not set
                username: teacher.username,
                teachingSubjects: teacher.teachingSubjects || []
            }));

            res.status(200).json({
                success: true,
                list: formattedList
            });
        } catch (err) {
            console.error('Error fetching teachers:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching teachers',
                error: err.message
            });
        }
    });

module.exports = router;