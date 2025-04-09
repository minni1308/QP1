const express = require("express");
const questionRouter = express.Router();
const question = require("../../models/questions");
const authenticate = require("../../authenticate");
const cors = require("../cors");

questionRouter.use(express.json());

// 🚀 Utility to merge unit-wise questions dynamically
const mergeQuestions = (target, source) => {
  const difficulties = ["easy", "medium", "hard"];
  const units = ["u1", "u2", "u3", "u4", "u5"];

  for (const diff of difficulties) {
    for (const unit of units) {
      if (source[diff][unit]?.length) {
        target[diff][unit].push(...source[diff][unit]);
      }
    }
  }
};

questionRouter
  .route("/get")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, async (_, res, next) => {
    try {
      const list = await question.find({}, { subject: 1 }).populate({
        path: "subject",
        populate: { path: "department" },
      });

      res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  })
  .post((_, res) => res.status(403).send("POST Operation not permitted"))
  .put((_, res) => res.status(403).send("PUT Operation not permitted"))
  .delete((_, res) => res.status(403).send("DELETE Operation not permitted"));


// 🔄 Insert or update questions for a subject
questionRouter
  .route("/post")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get((_, res) => res.status(403).send("GET not supported"))
  .post((_, res) => res.status(403).send("POST not supported"))
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      for (const subjectId of Object.keys(req.body)) {
        const payload = req.body[subjectId];
        let existing = await question.findOne({ subject: subjectId });

        if (!existing) {
          // Create new question document
          await question.create({
            subject: subjectId,
            easy: payload.easy,
            medium: payload.medium,
            hard: payload.hard,
          });
        } else {
          // Merge into existing document
          mergeQuestions(existing, payload);
          await existing.save();
        }
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Insert question error:", err);
      next(err);
    }
  })
  .delete((_, res) => res.status(403).send("DELETE Operation not permitted"));

module.exports = questionRouter;
