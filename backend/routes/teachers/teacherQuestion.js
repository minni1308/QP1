const express = require("express");
const questionRouter = express.Router();
const question = require("../../models/questions");
const authenticate = require("../../authenticate");
const cors = require("../cors");

questionRouter.use(express.json());

// 🚀 Utility to merge unit-wise questions dynamically
const mergeQuestions = (target, source) => {
  const difficulties = ["easy", "medium", "hard", "mcq"];
  const units = ["u1", "u2", "u3", "u4", "u5"];

  for (const diff of difficulties) {
    if (!target[diff]) target[diff] = {};
    if (!source[diff]) continue;

    for (const unit of units) {
      if (!target[diff][unit]) target[diff][unit] = [];

      if (source[diff][unit]?.length) {
        target[diff][unit].push(...source[diff][unit]);
      }
    }
  }
};

questionRouter
  .route("/get")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const list = await question.find({}, { subject: 1 }).populate({
        path: "subject",
        populate: { path: "department" },
      });

      if (!list) {
        return res.status(200).json([]);
      }

      res.status(200).json(list);
    } catch (err) {
      console.error('Error fetching questions:', err);
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
            easy: payload.easy || { u1: [], u2: [], u3: [], u4: [], u5: [] },
            medium: payload.medium || { u1: [], u2: [], u3: [], u4: [], u5: [] },
            hard: payload.hard || { u1: [], u2: [], u3: [], u4: [], u5: [] },
            mcq: payload.mcq || { u1: [], u2: [], u3: [], u4: [], u5: [] }
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
