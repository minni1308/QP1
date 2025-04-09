const express = require('express');
const mediumEditRouter = express.Router();
const authenticate = require('../../../authenticate');
const question = require('../../../models/questions');
const cors = require('../../cors');

mediumEditRouter.use(express.json());

/** Utility to extract teacher's medium questions by unit */
async function getMediumQuestionsByUnit(id, unit, teacherId) {
  const doc = await question.findById(id, { [`medium.${unit}`]: 1 });
  return doc?.medium?.[unit]?.filter((q) => q.teacher.equals(teacherId)) || [];
}

/** Utility to update teacher's medium questions by unit */
async function updateMediumQuestionsByUnit(id, unit, teacherId, newQuestions) {
  await question.updateOne(
    { _id: id },
    { $pull: { [`medium.${unit}`]: { teacher: teacherId } } }
  );

  const doc = await question.findById(id, { [`medium.${unit}`]: 1 });
  doc.medium[unit].push(...newQuestions);
  await doc.save();
}

mediumEditRouter
  .route('/get')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((_, res) => res.end('GET operation is not performed'))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const { id, unit } = req.body;
      const questions = await getMediumQuestionsByUnit(id, unit, req.user._id);
      res.status(200).json(questions);
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
      const { id, unit, medium } = req.body;
      await updateMediumQuestionsByUnit(id, unit, req.user._id, medium);
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  });

mediumEditRouter
  .route('/')
  .delete((_, res) => res.end('DELETE operation is not performed'))
  .put((_, res) => res.end('PUT operation is not performed'));

module.exports = mediumEditRouter;
