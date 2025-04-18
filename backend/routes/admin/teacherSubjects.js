const express = require('express');
const router = express.Router();
const teachers = require('../../models/teachers');
const Subject = require('../../models/subject');
const Activity = require('../../models/activity');
const authenticate = require('../../authenticate');
const cors = require('../cors');

// Helper function to log activity
const logActivity = async (req, description) => {
  try {
    const activity = new Activity({
      description,
      type: 'TEACHER',
      timestamp: new Date(),
      user: req.user._id
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// POST endpoint to add subjects to a teacher
router.route('/add')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { teacherId, subjectIds } = req.body;

            if (!teacherId || !subjectIds || !Array.isArray(subjectIds)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid request parameters'
                });
            }

            // Find the teacher
            const teacher = await teachers.findById(teacherId);
            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }

            // Get subject details for activity logging
            const subjects = await Subject.find({ _id: { $in: subjectIds } });
            const subjectNames = subjects.map(s => `${s.name} (${s.code})`).join(', ');

            // Initialize teachingSubjects array if it doesn't exist
            if (!teacher.teachingSubjects) {
                teacher.teachingSubjects = [];
            }

            // Add new subjects (avoiding duplicates)
            const uniqueSubjects = [...new Set([...teacher.teachingSubjects.map(s => s.toString()), ...subjectIds])];
            teacher.teachingSubjects = uniqueSubjects;

            await teacher.save();
            
            // Log activity
            await logActivity(req, `Assigned subjects [${subjectNames}] to teacher ${teacher.name || teacher.username}`);

            res.status(200).json({
                success: true,
                message: 'Subjects added successfully',
                subjects: teacher.teachingSubjects
            });
        } catch (err) {
            console.error('Error adding subjects:', err);
            res.status(500).json({
                success: false,
                message: 'Error adding subjects',
                error: err.message
            });
        }
    });

// DELETE endpoint to remove subjects from a teacher
router.route('/remove')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { teacherId, subjectId } = req.body;

            if (!teacherId || !subjectId) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid request parameters'
                });
            }

            // Find the teacher and subject
            const teacher = await teachers.findById(teacherId);
            const subject = await Subject.findById(subjectId);

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }

            if (subject) {
                // Log activity before removing
                await logActivity(req, `Removed subject ${subject.name} (${subject.code}) from teacher ${teacher.name || teacher.username}`);
            }

            // Remove the subject
            teacher.teachingSubjects = teacher.teachingSubjects.filter(s => s.toString() !== subjectId);
            await teacher.save();

            res.status(200).json({
                success: true,
                message: 'Subject removed successfully',
                subjects: teacher.teachingSubjects
            });
        } catch (err) {
            console.error('Error removing subject:', err);
            res.status(500).json({
                success: false,
                message: 'Error removing subject',
                error: err.message
            });
        }
    });

// GET endpoint to fetch teacher's subjects
router.route('/:teacherId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
        try {
            console.log('Fetching subjects for teacher:', req.params.teacherId);
            console.log('Requesting user:', req.user._id);
            
            // Check if user is requesting their own subjects or is an admin
            if (!req.user.admin && req.user._id.toString() !== req.params.teacherId) {
                console.log('Authorization failed: User can only view their own subjects');
                return res.status(403).json({
                    success: false,
                    message: 'You can only view your own subjects'
                });
            }

            const teacher = await teachers.findById(req.params.teacherId)
                .populate({
                    path: 'teachingSubjects',
                    populate: { path: 'department' }
                });

            if (!teacher) {
                console.log('Teacher not found:', req.params.teacherId);
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }

            console.log('Found teacher:', teacher.name);
            console.log('Teaching subjects:', teacher.teachingSubjects);

            res.status(200).json({
                success: true,
                subjects: teacher.teachingSubjects || []
            });
        } catch (err) {
            console.error('Error fetching teacher subjects:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching teacher subjects',
                error: err.message
            });
        }
    });

module.exports = router;