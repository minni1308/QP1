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
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        try {
            const { id, unit } = req.body; // id = subject document ID, unit = u1, u2, etc.
            if (!id || !unit || ![`u1`, `u2`, `u3`, `u4`, `u5`].includes(unit)) {
                return response.status(400).json({ success: false, message: 'Invalid request body' });
            }

            const mcqField = `mcq.${unit}`;
            const projection = { [mcqField]: 1, _id: 0 }; // Select only the MCQ field

            console.log(`[DEBUG] Fetching MCQs for subject ID: ${id}, unit: ${unit}`); // Log input
            const questionsDoc = await question.findById(id, projection);
            console.log(`[DEBUG] Mongoose query result:`, questionsDoc); // Log query result

            if (!questionsDoc || !questionsDoc.mcq || !questionsDoc.mcq[unit]) {
                console.log(`[DEBUG] No MCQs found in document for unit ${unit}.`); // Log not found
                return response.status(200).json([]); 
            }

            const allMcqsInUnit = questionsDoc.mcq[unit];
            console.log(`[DEBUG] All MCQs found in unit ${unit}:`, allMcqsInUnit); // Log all questions found

            // Filter MCQs to only those created by the logged-in teacher
            const teacherQuestions = allMcqsInUnit.filter((data) => {
                return data && data.teacher && data.teacher.equals(req.user._id);
            });
            console.log(`[DEBUG] MCQs filtered for teacher ${req.user._id}:`, teacherQuestions); // Log filtered questions

            response.status(200).json(teacherQuestions);

        } catch (err) {
            console.error("Error fetching MCQs:", err);
            next(err);
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
            const { id, unit, mcq: updatedQuestions } = req.body; // id = subject document ID, unit = u1..u5, mcq = array of updated MCQ objects

            if (!id || !unit || ![`u1`, `u2`, `u3`, `u4`, `u5`].includes(unit) || !Array.isArray(updatedQuestions)) {
                return response.status(400).json({ success: false, message: 'Invalid request body' });
            }

            const mcqField = `mcq.${unit}`;
            const teacherId = req.user._id;

            // 1. Pull all existing MCQs for this unit added by this teacher
            const pullUpdate = await question.updateOne(
                { _id: id },
                { $pull: { [mcqField]: { teacher: teacherId } } }
            );

            console.log(`Pull result for teacher ${teacherId}, unit ${unit}:`, pullUpdate);

            // 2. Add the new/updated MCQs back
            if (updatedQuestions.length > 0) {
                // Ensure all submitted questions have the teacher ID and are valid
                const questionsToAdd = updatedQuestions
                    .filter(q => q && q.name && Array.isArray(q.options) && q.options.length === 4)
                    .map(q => ({
                        ...q,
                        teacher: teacherId // Ensure teacher ID is set
                    }));

                if (questionsToAdd.length > 0) {
                    const pushUpdate = await question.updateOne(
                        { _id: id },
                        { $push: { [mcqField]: { $each: questionsToAdd } } }
                    );
                    console.log(`Push result for teacher ${teacherId}, unit ${unit}:`, pushUpdate);
                }
            }
            
            response.status(200).json({ success: true });

        } catch (err) {
            console.error("Error updating MCQs:", err);
             if (err.name === 'ValidationError') {
               return response.status(400).json({ success: false, message: err.message });
             }
            next(err);
        }
    })
    .delete((req,res,next)=>{
        res.status(403).end('DELETE Operation is not Performed on /put');
    });

module.exports = mcqEditRouter; 