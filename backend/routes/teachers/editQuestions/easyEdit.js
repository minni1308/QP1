const express = require('express');
const easyEditRouter = express.Router();
const authenticate = require('../../../authenticate');
const Question = require('../../../models/questions');
const cors = require('../../cors');

easyEditRouter.use(express.json());

// Utility: extract questions by unit & teacher
const getUnitQuestions = (data, unit, teacherId) => {
  return data?.easy?.[unit]?.filter(q => q.teacher.equals(teacherId)) || [];
};

// Utility: pull teacher's questions from unit and insert new ones
const updateUnitQuestions = async (unit, id, teacherId, newQuestions) => {
  await Question.updateOne(
    { _id: id },
    { $pull: { [`easy.${unit}`]: { teacher: teacherId } } }
  );

  const doc = await Question.findById(id, { [`easy.${unit}`]: 1 });
  if (!doc) throw new Error("Question document not found");

  doc.easy[unit].push(...newQuestions);
  return await doc.save();
};

easyEditRouter.route('/get')
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get((_, res) => res.status(405).end('GET operation is not permitted'))
  .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const { id, unit } = req.body;
      const doc = await Question.findById(id, { [`easy.${unit}`]: 1 });
      const filtered = getUnitQuestions(doc, unit, req.user._id);
      res.status(200).json(filtered);
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
      const { unit, id, easy } = req.body;
      await updateUnitQuestions(unit, id, req.user._id, easy);
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  })
  .delete((_, res) => res.status(405).end('DELETE operation is not permitted'));

module.exports = easyEditRouter;
