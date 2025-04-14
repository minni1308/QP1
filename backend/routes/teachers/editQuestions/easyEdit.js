const express = require('express');
const easyEditRouter = express.Router();
const authenticate = require('../../../authenticate');
const Question = require('../../../models/questions');
const cors = require('../../cors');

easyEditRouter.use(express.json());

// Utility: extract all questions by unit
const getUnitQuestions = (data, unit) => {
  return data?.easy?.[unit] || [];
};

// Utility: update teacher's questions by unit
const updateUnitQuestions = async (unit, id, teacherId, newQuestions) => {
  console.log('Updating easy questions:', { unit, id, teacherId, newQuestions });
  
  try {
    // First, find the document and verify it exists
    const doc = await Question.findById(id);
    if (!doc) {
      throw new Error("Question document not found");
    }

    // Initialize the unit array if it doesn't exist
    if (!doc.easy[unit]) {
      doc.easy[unit] = [];
    }

    // Remove existing questions by this teacher
    doc.easy[unit] = doc.easy[unit].filter(q => !q.teacher.equals(teacherId));

    // Add the new questions with teacher ID
    const questionsWithTeacher = newQuestions.map(q => ({
      ...q,
      teacher: teacherId,
      name: q.name || q.text, // handle both name and text properties
      timestamp: new Date()
    }));

    console.log('Adding new questions:', questionsWithTeacher);

    // Add new questions
    doc.easy[unit].push(...questionsWithTeacher);

    // Save the document
    const savedDoc = await doc.save();
    console.log('Successfully saved document:', savedDoc.easy[unit].length, 'questions in unit');
    
    return savedDoc;
  } catch (error) {
    console.error('Error updating questions:', error);
    throw error;
  }
};

easyEditRouter.route('/get')
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get((_, res) => res.status(405).end('GET operation is not permitted'))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const { id, unit } = req.body;
      const doc = await Question.findById(id, { [`easy.${unit}`]: 1 });
      const questions = getUnitQuestions(doc, unit);
      
      // Add an isEditable flag to each question
      const questionsWithEditFlag = questions.map(q => ({
        ...q.toObject(),
        isEditable: q.teacher.equals(req.user._id)
      }));
      
      res.status(200).json(questionsWithEditFlag);
    } catch (err) {
      next(err);
    }
  })
  .put((_, res) => res.status(405).end('PUT operation is not permitted'))
  .delete((_, res) => res.status(405).end('DELETE operation is not permitted'));

easyEditRouter.route('/put')
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get((_, res) => res.status(405).end('GET operation is not permitted'))
  .post((_, res) => res.status(405).end('POST operation is not permitted'))
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      console.log('Received update request:', req.body);
      const { unit, id, easy } = req.body;
      
      if (!unit || !id || !easy) {
        throw new Error('Missing required fields: unit, id, or questions');
      }

      const result = await updateUnitQuestions(unit, id, req.user._id, easy);
      console.log('Update completed successfully');
      
      res.status(200).json({ 
        success: true,
        message: 'Questions updated successfully',
        questionCount: result.easy[unit].length
      });
    } catch (err) {
      console.error('Error in put route:', err);
      next(err);
    }
  })
  .delete((_, res) => res.status(405).end('DELETE operation is not permitted'));

module.exports = easyEditRouter;
