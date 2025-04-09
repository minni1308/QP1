const express = require("express");
const passport = require("passport");
const nodemailer = require("nodemailer");
const cors = require("../cors");

const teacher = require("../../models/teachers");

const teacherRouter = express.Router();
teacherRouter.use(express.json());

// Environment variables recommended for sensitive data
const MAIL_USER = process.env.MAIL_USER || "qpgeneratorbvrit@gmail.com";
const MAIL_PASS = process.env.MAIL_PASS || "uamaeefhzwwnlrtq"; // ⚠️ move this to .env

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

teacherRouter
  .route("/")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .get(cors.cors, (_, res) => {
    res.status(403).send("GET operation is not permitted");
  })
  .post(cors.corsWithOptions, async (req, res) => {
    const { email, name, phno, password } = req.body;

    teacher.register(new teacher({ username: email }), password, async (err, user) => {
      if (err) {
        return res.status(200).json({
          success: false,
          message: "User with this email already exists.",
        });
      }

      user.name = name;
      user.phno = phno;

      try {
        await user.save();

        const verificationUrl = `http://localhost:3000/user/${user._id}`;
        const mailOptions = {
          from: `"QP Generator" <${MAIL_USER}>`,
          to: user.username,
          subject: "Email Verification - QP Generator",
          html: `
            <p>Hello ${user.name},</p>
            <p>Thanks for registering with QP Generator.</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>If you did not request this, please ignore this email.</p>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent: %s", info.messageId);

        return res.status(200).json({
          success: true,
          status: "Registration successful! Please verify via email.",
        });
      } catch (saveOrEmailErr) {
        console.error("Signup error:", saveOrEmailErr);
        return res.status(200).json({
          success: false,
          message: "Could not create account or send verification email. Please contact admin.",
        });
      }
    });
  })
  .put(cors.corsWithOptions, (_, res) => {
    res.status(403).send("PUT operation is not permitted");
  })
  .delete(cors.corsWithOptions, (_, res) => {
    res.status(403).send("DELETE operation is not permitted");
  });

module.exports = teacherRouter;
