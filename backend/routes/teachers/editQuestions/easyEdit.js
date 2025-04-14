var express = require('express');
var easyEditRouter = express.Router();
var authenticate = require('../../../authenticate');
var question = require('../../../models/questions');
var cors = require('../../cors');

easyEditRouter.use(express.json());
easyEditRouter.route('/get')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get((req, res, next) => {
        res.end('GET operation is not Performed');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        try {
            if (req.body.unit === 'u1') {
                var questions = await question.findById(req.body.id, { "easy.u1": 1 })
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(questions.easy.u1);
            } else if (req.body.unit === 'u2') {
                var questions = await question.findById(req.body.id, { "easy.u2": 1 })
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(questions.easy.u2);
            } else if (req.body.unit === 'u3') {
                var questions = await question.findById(req.body.id, { "easy.u3": 1 })
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(questions.easy.u3);
            } else if (req.body.unit === 'u4') {
                var questions = await question.findById(req.body.id, { "easy.u4": 1 })
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(questions.easy.u4);
            } else {
                var questions = await question.findById(req.body.id, { "easy.u5": 1 })
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(questions.easy.u5);
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    })
    .put((req, res, next) => {
        res.end('PUT operation is not perfromed');
    })
    .delete((req, res, next) => {
        res.end('DELETE Operation is not Performed');
    })
easyEditRouter.route('/put')
    .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
    .get((req, res, next) => {
        res.end('GET operation is not performed');
    })
    .post((req, res, next) => {
        res.end('POST operation is not performed');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        try {
            const { id, unit, easy } = req.body; // Destructure the request body

            // Validate input
            if (!id || !unit || !easy) {
                response.statusCode = 400;
                return response.json({ 
                    success: false, 
                    message: 'Missing required fields' 
                });
            }

            // Create the update path based on the unit
            const updatePath = `easy.${unit}`;

            // First, remove the existing questions for this unit
            await question.findByIdAndUpdate(
                id,
                { $set: { [updatePath]: [] } },
                { new: true }
            );

            // Then add the new/updated questions
            const updatedDoc = await question.findByIdAndUpdate(
                id,
                { 
                    $set: { 
                        [updatePath]: easy.map(q => ({
                            name: q.name,
                            teacher: req.user._id
                        }))
                    } 
                },
                { new: true }
            );

            if (!updatedDoc) {
                response.statusCode = 404;
                return response.json({ 
                    success: false, 
                    message: 'Question not found' 
                });
            }

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json({ 
                success: true,
                message: 'Questions updated successfully',
                data: updatedDoc[updatePath]
            });

        } catch (err) {
            console.error('Error updating questions:', err);
            response.statusCode = 500;
            response.json({ 
                success: false, 
                message: 'Failed to update questions',
                error: err.message 
            });
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, async (req, response, next) => {
        try {
            const { id, unit, questionIds } = req.body;

            if (!id || !unit || !questionIds) {
                response.statusCode = 400;
                return response.json({ 
                    success: false, 
                    message: 'Missing required fields' 
                });
            }

            const updatePath = `easy.${unit}`;

            // Remove specific questions by their IDs
            const updatedDoc = await question.findByIdAndUpdate(
                id,
                { 
                    $pull: { 
                        [updatePath]: { 
                            _id: { $in: questionIds } 
                        } 
                    } 
                },
                { new: true }
            );

            if (!updatedDoc) {
                response.statusCode = 404;
                return response.json({ 
                    success: false, 
                    message: 'Question not found' 
                });
            }

            response.statusCode = 200;
            response.json({ 
                success: true,
                message: 'Questions deleted successfully',
                data: updatedDoc[updatePath]
            });

        } catch (err) {
            console.error('Error deleting questions:', err);
            response.statusCode = 500;
            response.json({ 
                success: false, 
                message: 'Failed to delete questions',
                error: err.message 
            });
        }
    });
module.exports = easyEditRouter;