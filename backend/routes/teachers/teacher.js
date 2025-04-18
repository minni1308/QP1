const express = require('express');
const router = express.Router();
const teachers = require('../../models/teachers');
const authenticate = require('../../authenticate');
const cors = require('../cors');

// GET teacher profile
router.route('/profile')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
        try {
            const teacher = await teachers.findById(req.user._id)
                .select('-password')
                .populate('teachingSubjects');

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }

            res.status(200).json({
                success: true,
                teacher
            });
        } catch (err) {
            console.error('Error fetching teacher profile:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching profile',
                error: err.message
            });
        }
    });

module.exports = router; 