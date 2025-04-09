const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const teacher = require("../../models/teachers");
const authenticate = require("../../authenticate");
const cors = require("../cors");

const updateRouter = express.Router();
updateRouter.use(express.json());

// ENV-based config
const MAIL_USER = process.env.MAIL_USER || "qpgeneratorbvrit@gmail.com";
const MAIL_PASS = process.env.MAIL_PASS || "uamaeefhzwwnlrtq"; // move to .env for real use

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

updateRouter
  .route("/")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))

  // 🔹 Get Profile Info
  .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    try {
      const user = await teacher.findById(req.user._id, { hash: 0, salt: 0 });
      if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  })

  .post(cors.corsWithOptions, (_, res) => {
    res.status(403).send("POST operation is not permitted");
  })

  // 🔹 Update Profile Info
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
      const currentUser = await teacher.findById(req.user._id);
      if (!currentUser) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }

      const isEmailChanged = currentUser.username !== req.body.username;

      if (isEmailChanged) {
        req.body.isauth = false;

        const verificationUrl = `http://localhost:3000/user/${currentUser._id}`;
        const mailOptions = {
          from: `"QP Generator Admin" <${MAIL_USER}>`,
          to: req.body.username,
          subject: "Email Updated - Please Verify",
          html: `
            <p>Your email has been changed. To verify the new address, click below:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
          `,
        };

        await transporter.sendMail(mailOptions);
      }

      const updatedUser = await teacher.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (err) {
      console.error("Update failed:", err);
      return res.status(500).json({
        success: false,
        message: "Could not update user or send verification email.",
      });
    }
  })

  .delete(cors.corsWithOptions, (_, res) => {
    res.status(403).send("DELETE operation is not permitted");
  });

module.exports = updateRouter;
