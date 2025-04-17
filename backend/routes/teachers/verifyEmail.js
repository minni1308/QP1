var express = require("express");
var verifyRouter = express.Router();
const cors = require("../cors");
var teacher = require("../../models/teachers");

verifyRouter.use(express.json());

verifyRouter
    .route("/:userId")
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, async (req, res, next) => {
        try {
            const user = await teacher.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Only update the verification status, don't create any session or token
            user.isauth = true;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Email verified successfully"
            });
        } catch (err) {
            console.error("Verification error:", err);
            res.status(500).json({
                success: false,
                message: "An error occurred during verification"
            });
        }
    });

module.exports = verifyRouter; 