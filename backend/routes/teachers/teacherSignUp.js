const express = require("express");
const teacherRouter = express.Router();
const passport = require("passport");
const cors = require("../cors");
const nodemailer = require("nodemailer");
const Teacher = require("../../models/teachers");

teacherRouter.use(express.json());

teacherRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res) => {
    res.statusCode = 403;
    res.end("GET operation is not permitted");
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    Teacher.register(
      new Teacher({ username: req.body.email }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message: "A user with that email already exists.",
          });
        }

        user.name = req.body.name;
        user.phno = req.body.phno;

        user.save((err, savedUser) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: false,
              message:
                "Failed to save user data. Please contact the administrator.",
            });
          }

          // ✅ Setup mail transporter
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "qpgeneratorbvrit@gmail.com", // Replace with your verified email
              pass: "uamaeefhzwwnlrtq",            // Replace with your Gmail App Password
            },
          });

          const verificationUrl = `http://localhost:3000/user/${savedUser._id}`;

          const mailOptions = {
            from: "no-replyAdmin <qpgeneratorbvrit@gmail.com>",
            to: savedUser.username,
            subject: "Confirm Your Registration",
            text: "Click the link below to complete your registration.",
            html: `<p>To complete the registration process, please click the link below:</p>
                   <a href="${verificationUrl}">Verify Email</a>`,
          };

          // ✅ Send the verification email
          transporter
            .sendMail(mailOptions)
            .then((info) => {
              console.log("✅ Email sent:", info.response);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({
                success: true,
                status: "Registration successful! Please check your email.",
              });
            })
            .catch((err) => {
              console.error("❌ Email sending error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.json({
                success: false,
                message:
                  "Could not send verification email. Please contact admin.",
              });
            });
        });
      }
    );
  })
  .put(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation is not permitted");
  })
  .delete(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end("DELETE operation is not permitted");
  });

module.exports = teacherRouter;
