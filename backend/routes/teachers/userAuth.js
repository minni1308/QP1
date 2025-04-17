// backend/routes/teachers/userAuth.js

const express = require('express');
const userRouter = express.Router();
const cors = require('../cors');
const Teacher = require('../../models/teachers');

userRouter.use(express.json());

userRouter.route('/:userId')
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get(cors.cors, async (req, res, next) => {
    try {
      const teacher = await Teacher.findById(req.params.userId);
      if (!teacher) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      // Mark teacher as verified
      await Teacher.findByIdAndUpdate(req.params.userId, { isauth: true });
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  })
  .post(cors.corsWithOptions, (_, res) => {
    res.status(403).end("POST operation is not permitted");
  })
  .put(cors.corsWithOptions, (_, res) => {
    res.status(403).end("PUT operation is not permitted");
  })
  .delete(cors.corsWithOptions, (_, res) => {
    res.status(403).end("DELETE operation is not permitted");
  });

module.exports = userRouter;
