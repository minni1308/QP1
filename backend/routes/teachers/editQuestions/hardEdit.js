const express = require('express');
const hardEditRouter = express.Router();
const authenticate = require('../../../authenticate');
const question = require('../../../models/questions');
const cors = require('../../cors');

hardEditRouter.use(express.json());

/** Utility to extract teacher's hard questions by unit */
async function getHardQuestionsByUnit(id, unit, teacherId) {
  const doc = await question.findById(id, { [`hard.${unit}`]: 1 });
  return doc?.hard?.[unit]?.filter((q) => q.teacher.equals(teacherId)) || [];
}

/** Utility to update teacher's hard questions by unit */
async function updateHardQuestionsByUnit(id, unit, teacherId, newQuestions) {
  await question.updateOne(
    { _id: id },
    { $pull: { [`hard.${unit}`]: { teacher: teacherId } } }
  );

  const doc = await question.findById(id, { [`hard.${unit}`]: 1 });
  doc.hard[unit].push(...newQuestions);
  await doc.save();
}

hardEditRouter
  .route('/get')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((_, res) => res.end('GET operation is not performed'))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const { id, unit } = req.body;
      const questions = await getHardQuestionsByUnit(id, unit, req.user._id);
      res.status(200).json(questions);
    } catch (err) {
      next(err);
    }
  });

hardEditRouter
  .route('/put')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((_, res) => res.end('GET operation is not performed'))
  .post((_, res) => res.end('POST operation is not performed'))
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const { id, unit, hard } = req.body;
      await updateHardQuestionsByUnit(id, unit, req.user._id, hard);
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  });

hardEditRouter
  .route('/')
  .delete((_, res) => res.end('DELETE operation is not performed'))
  .put((_, res) => res.end('PUT operation is not performed'));

module.exports = hardEditRouter;
