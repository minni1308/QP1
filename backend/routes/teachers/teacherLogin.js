const express = require("express");
const passport = require("passport");
const cors = require("../cors");
const authenticate = require("../../authenticate");

const TeacherRouter = express.Router();
TeacherRouter.use(express.json());

// Helper to send JSON responses
const sendJson = (res, payload, status = 200) => {
  res.status(status).json(payload);
};

TeacherRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res) => {
    res.status(403).type("text").send("GET operation is not permitted");
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return sendJson(res, {
          status: false,
          err: "Username or Password is incorrect!!!",
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return sendJson(res, {
            status: false,
            err: "Username or Password is incorrect!!!",
          });
        }

        if (!user.isauth) {
          return sendJson(res, {
            status: "VERIFY",
            err: "Please complete your sign-in process by verifying your email.",
          });
        }

        const token = authenticate.getToken({ _id: user._id });
        return sendJson(res, {
          token,
          status: true,
          user: {
            user: user.username,
            id: user._id,
            admin: user.admin,
          },
        });
      });
    })(req, res, next);
  })
  .put(cors.corsWithOptions, (req, res) => {
    res.status(403).send("PUT operation not supported");
  })
  .delete(cors.corsWithOptions, (req, res) => {
    res.status(403).send("DELETE operation not supported");
  });

module.exports = TeacherRouter;
