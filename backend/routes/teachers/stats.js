const express = require('express');
const router = express.Router();
const Questions = require('../../models/questions');
const teachers = require('../../models/teachers');
const Activity = require('../../models/activity');
const authenticate = require('../../authenticate');
const cors = require('../cors');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// GET teacher stats
router.route('/:teacherId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
        try {
            const teacherId = req.params.teacherId;
            console.log('Fetching stats for teacher:', teacherId);
            
            // Verify user is requesting their own stats or is admin
            if (!req.user.admin && req.user.id.toString() !== teacherId) {
                console.log('Authorization failed: User can only view their own stats');
                return res.status(403).json({
                    success: false,
                    message: 'You can only view your own stats'
                });
            }

            // Get all questions for subjects assigned to this teacher
            const teacher = await teachers.findById(teacherId).populate('teachingSubjects');
            if (!teacher) {
                console.log('Teacher not found:', teacherId);
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }

            const subjectIds = teacher.teachingSubjects.map(subject => subject._id);
            console.log('Teacher subjects:', subjectIds);

            // Get questions for these subjects
            const questions = await Questions.find({ subject: { $in: subjectIds } }).populate('subject');
            console.log('Found questions for subjects:', questions.length);
            
            // Count total questions added by the teacher
            let totalQuestions = 0;
            const questionTypes = ['mcq', 'easy', 'medium', 'hard'];
            const units = ['u1', 'u2', 'u3', 'u4', 'u5'];
            
            // Initialize unit-wise statistics
            const unitStats = {};
            units.forEach(unit => {
                unitStats[unit] = {
                    easy: 0,
                    medium: 0,
                    hard: 0,
                    mcq: 0,
                    total: 0
                };
            });
            
            // Initialize difficulty totals
            const difficultyTotals = {
                easy: 0,
                medium: 0,
                hard: 0,
                mcq: 0
            };
            
            // Initialize subject-wise statistics
            const subjectStats = {};
            
            // Count questions by type and unit
            questions.forEach(question => {
                const subjectId = question.subject._id.toString();
                const subjectName = question.subject.name;
                const subjectCode = question.subject.code;
                
                // Initialize subject stats if not exists
                if (!subjectStats[subjectId]) {
                    subjectStats[subjectId] = {
                        name: subjectName,
                        code: subjectCode,
                        totalQuestions: 0,
                        byDifficulty: {
                            easy: 0,
                            medium: 0,
                            hard: 0,
                            mcq: 0
                        },
                        byUnit: {
                            u1: 0,
                            u2: 0,
                            u3: 0,
                            u4: 0,
                            u5: 0
                        }
                    };
                }
                
                questionTypes.forEach(type => {
                    units.forEach(unit => {
                        if (question[type] && question[type][unit]) {
                            const teacherQuestions = question[type][unit].filter(q => 
                                q.teacher && q.teacher.equals(ObjectId(teacherId))
                            );
                            const count = teacherQuestions.length;
                            totalQuestions += count;
                            unitStats[unit][type] += count;
                            unitStats[unit].total += count;
                            difficultyTotals[type] += count;
                            
                            // Update subject-specific counts
                            if (count > 0) {
                                subjectStats[subjectId].totalQuestions += count;
                                subjectStats[subjectId].byDifficulty[type] += count;
                                subjectStats[subjectId].byUnit[unit] += count;
                            }
                            
                            console.log(`Found ${count} ${type} questions in unit ${unit} for subject ${subjectName}`);
                        }
                    });
                });
            });

            console.log('Total questions:', totalQuestions);

            // Get total subjects assigned
            const totalSubjects = teacher.teachingSubjects ? teacher.teachingSubjects.length : 0;
            console.log('Total subjects:', totalSubjects);

            // Get papers generated count
            const paperActivities = await Activity.find({
                user: ObjectId(teacherId),
                type: { $in: ['PAPER_GENERATED', 'MID1_GENERATED', 'MID2_GENERATED', 'SEMESTER_GENERATED'] }
            });
            const papersGenerated = paperActivities.length;
            console.log('Papers generated:', papersGenerated);

            // Get recent activities
            const recentActivities = await Activity.find({
                user: ObjectId(teacherId)
            })
            .sort({ timestamp: -1 })
            .limit(5);
            console.log('Recent activities:', recentActivities.length);

            res.status(200).json({
                success: true,
                stats: {
                    totalQuestions,
                    papersGenerated,
                    totalSubjects,
                    unitStats,
                    difficultyTotals,
                    subjectStats
                },
                recentActivities
            });

        } catch (err) {
            console.error('Error fetching teacher stats:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching stats',
                error: err.message
            });
        }
    });

module.exports = router; 