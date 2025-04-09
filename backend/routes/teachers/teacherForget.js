const express = require("express");
const nodemailer = require("nodemailer");
const teacher = require("../../models/teachers");
const cors = require("../cors");

const forgetRouter = express.Router();
forgetRouter.use(express.json());

// Load email credentials from environment
const MAIL_USER = process.env.MAIL_USER || "qpgeneratorbvrit@gmail.com";
const MAIL_PASS = process.env.MAIL_PASS || "uamaeefhzwwnlrtq"; // use env var in real code

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

forgetRouter
  .route("/check")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))

  // Send recovery email
  .post(cors.cors, async (req, res, next) => {
    try {
      const user = await teacher.findOne({ username: req.body.email });

      if (!user || !user.isauth) {
        return res.status(200).json({ success: false });
      }

      const resetLink = `http://localhost:3000/forgot/${user._id}`;
      const mailOptions = {
        from: `"QP Generator Admin" <${MAIL_USER}>`,
        to: user.username,
        subject: "Password Recovery",
        html: `
          <p>To reset your password, please click the following link:</p>
          <a href="${resetLink}">${resetLink}</a>
        `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Email sending failed:", err);
      return next(err);
    }
  })

  // Unsupported
  .get((_, res) => res.status(403).send("GET Operation is not supported"))
  .put(cors.corsWithOptions, (_, res) => res.status(403).send("PUT is not supported"))
  .delete(cors.corsWithOptions, (_, res) => res.status(403).send("DELETE is not supported"));


// 🔄 Route: Update password using reset link
forgetRouter
  .route("/change/:userId")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))

  .put(cors.corsWithOptions, async (req, res, next) => {
    try {
      const user = await teacher.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (!req.body.password || req.body.password.length < 8) {
        return res.status(400).json({ success: false, message: "Invalid password" });
      }

      await user.setPassword(req.body.password);
      await user.save();

      return res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  })

  // Unsupported
  .get((_, res) => res.status(403).send("GET is not supported"))
  .post((_, res) => res.status(403).send("POST is not supported"))
  .delete((_, res) => res.status(403).send("DELETE is not supported"));

module.exports = forgetRouter;
