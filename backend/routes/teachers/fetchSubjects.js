const express = require('express');
const subjectRouter = express.Router();
const authenticate = require('../../authenticate');
const cors = require('../cors');
const Subject = require('../../models/subject');

subjectRouter.use(express.json());

subjectRouter.route('/')
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))

  .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    try {
      const subjects = await Subject.find().populate('department');
      res.status(200).json(subjects);
    } catch (err) {
      next(err);
    }
  })

  .post((_, res) => {
    res.status(405).end('POST operation is not permitted');
  })

  .put((_, res) => {
    res.status(405).end('PUT operation is not permitted');
  })

  .delete((_, res) => {
    res.status(405).end('DELETE operation is not permitted');
  });

module.exports = subjectRouter;
