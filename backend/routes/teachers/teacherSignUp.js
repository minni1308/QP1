var express = require("express");
var teacherRouter = express.Router();
var passport = require("passport");

const cors = require("../cors");
const nodemailer = require("nodemailer");

var teacher = require("../../models/teachers");

teacherRouter.use(express.json());

teacherRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end("Get operation is not permitted");
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        teacher.register(
            new teacher({ username: req.body.email }),
            req.body.password,
            (err, user) => {
                if (err) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({
                        success: false,
                        message: 'Already User with Email is Present'
                    });
                } else {
                    user.name = req.body.name;
                    user.phno = req.body.phno;
                    user.save((err, user) => {
                        if (err) {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application-json");
                            res.json({
                                success: false,
                                message: 'Cannot Create Account with Given Details, Contact Admin.'
                            });
                        } else {
                            let transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: "qpgeneratorbvrit@gmail.com",
                                    pass: "uamaeefhzwwnlrtq",
                                },
                            });
                            // Use the frontend URL for verification with userId
                            var url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify/${user._id}`;
                            var mailOptions = {
                                from: "no-replyAdmin <qpgeneratorbvrit@gmail.com>",
                                to: user.username,
                                subject: "Confirmation of Registration",
                                text: "You are Successful Registered",
                                html: `<p>To complete the registration process, please click on the link below</p><br><br><a href=${url}>Verify Email</a>`,
                            };
                            transporter
                                .sendMail(mailOptions)
                                .then((info) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json({
                                        success: true,
                                        status: "Registration Successful! Please check your email for verification.",
                                    });
                                })
                                .catch((err) => {
                                    console.error("Email sending error:", err);
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json({
                                        success: false,
                                        message: "Failed to send verification email. Please try again later."
                                    });
                                });
                        }
                    });
                }
            }
        );
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation is not permitted");
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end("DELETE operation is not permitted");
    });
module.exports = teacherRouter;