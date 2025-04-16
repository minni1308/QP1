const express = require('express');
const mcqEditRouter = express.Router();
const authenticate = require('../../../authenticate');
const question = require('../../../models/questions'); // Correct path to models
const cors = require('../../cors');

mcqEditRouter.use(express.json());

// Route to GET MCQs for a specific subject and unit (filtered by teacher)
mcqEditRouter.route('/get')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get((req, res, next) => {
        // GET not typically used like this, should use POST for fetching with body params
        res.status(405).end('GET operation is not appropriate here, use POST'); 
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
        try {
            console.log('Received MCQ fetch request:', req.body); // Debug log
            const { id, unit } = req.body;
            
            if (!id || !unit) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Missing required fields: id or unit' 
                });
            }

            const mcqField = `mcq.${unit}`;
            const projection = { [mcqField]: 1, _id: 0 };

            const questionsDoc = await question.findById(id, projection);
            
            if (!questionsDoc || !questionsDoc.mcq || !questionsDoc.mcq[unit]) {
                return res.status(200).json([]); 
            }

            const allMcqsInUnit = questionsDoc.mcq[unit];
            const teacherQuestions = allMcqsInUnit.filter(q => 
                q && q.teacher && q.teacher.equals(req.user._id)
            );

            res.status(200).json(teacherQuestions);
        } catch (error) {
            console.error('MCQ fetch error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    })
    .put((req, res, next) => {
        res.status(403).end('PUT operation is not performed on /get');
    })
    .delete((req, res, next) => {
        res.status(403).end('DELETE Operation is not Performed on /get');
    });

// Route to PUT (update) MCQs for a specific subject and unit
mcqEditRouter.route('/put')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get((req,res,next)=>{
        res.status(403).end('GET operation is not performed on /put');
    })
    .post((req,res,next)=>{
        res.status(403).end('POST operation is not performed on /put');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        try {
            const { id, unit, mcq: updatedQuestions } = req.body;

            if (!id || !unit || !Array.isArray(updatedQuestions)) {
                return response.status(400).json({ success: false, message: 'Invalid request body' });
            }

            const mcqField = `mcq.${unit}`;
            const teacherId = req.user._id;

            // Remove existing MCQs for this teacher in this unit
            await question.updateOne(
                { _id: id },
                { $pull: { [mcqField]: { teacher: teacherId } } }
            );

            // Add the updated MCQs
            if (updatedQuestions.length > 0) {
                const questionsToAdd = updatedQuestions.map(q => ({
                    ...q,
                    teacher: teacherId
                }));

                await question.updateOne(
                    { _id: id },
                    { $push: { [mcqField]: { $each: questionsToAdd } } }
                );
            }
            
            response.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    })
    .delete((req,res,next)=>{
        res.status(403).end('DELETE Operation is not Performed on /put');
    });

module.exports = mcqEditRouter; 