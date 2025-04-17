const express = require('express');
const mcqRouter = express.Router();
const authenticate = require('../../authenticate');
const Questions = require('../../models/questions');
const cors = require('../cors');
const { ObjectId } = require('mongodb');

mcqRouter.use(express.json());

mcqRouter.route('/get')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const { id, unit } = req.body;
        const subjectId = ObjectId(id);
        Questions.findOne({subject: subjectId})
            .then((doc) => {
                if (!doc || !doc.mcq || !doc.mcq[unit]) {
                    return res.json([]);
                }
                // Filter questions for current teacher
                const questions = doc.mcq[unit].filter(q => 
                    q.teacher && q.teacher.equals(req.user._id)
                );
                console.log(doc._id)
                res.json({
                    questionId: doc._id,
                    questions: questions
                });
            })
            .catch((err) => next(err));
    });

mcqRouter.route('/put')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const { id, unit, mcq } = req.body;

        Questions.findById(id)
            .then((doc) => {
                if (!doc) {
                    res.status(404).json({ success: false, message: "Document not found" });
                    return;
                }

                // Remove existing MCQs for this teacher in this unit
                if (!doc.mcq) doc.mcq = {};
                if (!doc.mcq[unit]) doc.mcq[unit] = [];
                
                doc.mcq[unit] = doc.mcq[unit].filter(q => 
                    !q.teacher || !q.teacher.equals(req.user._id)
                );

                // Add the new MCQs with teacher ID
                const newMcqs = mcq.map(q => ({
                    ...q,
                    teacher: req.user._id
                }));
                
                doc.mcq[unit].push(...newMcqs);

                return doc.save();
            })
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => next(err));
    });

module.exports = mcqRouter; 