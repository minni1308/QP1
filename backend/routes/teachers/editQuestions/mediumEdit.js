const express = require('express');
const mediumEditRouter = express.Router();
const authenticate = require('../../../authenticate');
const question = require('../../../models/questions');
const cors = require('../../cors');

mediumEditRouter.use(express.json());

/** Utility to extract all medium questions by unit */
async function getMediumQuestionsByUnit(id, unit) {
  const doc = await question.findById(id, { [`medium.${unit}`]: 1 });
  return doc?.medium?.[unit] || [];
}

/** Utility to update teacher's medium questions by unit */
async function updateMediumQuestionsByUnit(id, unit, teacherId, newQuestions) {
  console.log('Updating medium questions:', { unit, id, teacherId, newQuestions });
  
  try {
    // First, find the document and verify it exists
    const doc = await question.findById(id);
    if (!doc) {
      throw new Error("Question document not found");
    }

    // Initialize the unit array if it doesn't exist
    if (!doc.medium[unit]) {
      doc.medium[unit] = [];
    }

    // Remove existing questions by this teacher
    doc.medium[unit] = doc.medium[unit].filter(q => !q.teacher.equals(teacherId));

    // Add the new questions with teacher ID
    const questionsWithTeacher = newQuestions.map(q => ({
      ...q,
      teacher: teacherId,
      name: q.name || q.text, // handle both name and text properties
      timestamp: new Date()
    }));

    console.log('Adding new questions:', questionsWithTeacher);

    // Add new questions
    doc.medium[unit].push(...questionsWithTeacher);

    // Save the document
    const savedDoc = await doc.save();
    console.log('Successfully saved document:', savedDoc.medium[unit].length, 'questions in unit');
    
    return savedDoc;
  } catch (error) {
    console.error('Error updating questions:', error);
    throw error;
  }
}

mediumEditRouter
  .route('/get')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((_, res) => res.end('GET operation is not performed'))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const { id, unit } = req.body;
      const questions = await getMediumQuestionsByUnit(id, unit);
      
      // Add an isEditable flag to each question
      const questionsWithEditFlag = questions.map(q => ({
        ...q.toObject(),
        isEditable: q.teacher.equals(req.user._id)
      }));
      
      res.status(200).json(questionsWithEditFlag);
    } catch (err) {
      next(err);
    }
  });

mediumEditRouter
  .route('/put')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((_, res) => res.end('GET operation is not performed'))
  .post((_, res) => res.end('POST operation is not performed'))
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      console.log('Received update request:', req.body);
      const { id, unit, medium } = req.body;
      
      if (!unit || !id || !medium) {
        throw new Error('Missing required fields: unit, id, or questions');
      }

      const result = await updateMediumQuestionsByUnit(id, unit, req.user._id, medium);
      console.log('Update completed successfully');
      
      res.status(200).json({ 
        success: true,
        message: 'Questions updated successfully',
        questionCount: result.medium[unit].length
      });
    } catch (err) {
      console.error('Error in put route:', err);
      next(err);
    }
  });

mediumEditRouter
  .route('/')
  .delete((_, res) => res.end('DELETE operation is not performed'))
  .put((_, res) => res.end('PUT operation is not performed'));

module.exports = mediumEditRouter;
