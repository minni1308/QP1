const express = require("express");
const subjectRouter = express.Router();
const authenticate = require("../../authenticate");
const cors = require("../cors");
const Subject = require("../../models/subject");
const Department = require("../../models/department");

subjectRouter.use(express.json());

/**
 * Utility to send formatted JSON response
 */
const sendResponse = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

/**
 * GET SUBJECT(S) by:
 * - Department name + year + sem
 * - Department name + year
 * - Subject code
 */
subjectRouter
  .route("/get")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const { name, year, sem, code } = req.body;

      // By department name + year + sem
      if (name && year && sem) {
        const dept = await Department.findOne({ name, year, semester: sem });
        if (!dept) return next(new Error("Cannot find the department"));

        const subs = await Subject.find({ department: dept._id });
        const list = subs.map(sub => ({
          sname: sub.name,
          scode: sub.code,
          dname: dept.value,
          year: dept.year,
          sem: dept.semester
        }));

        return sendResponse(res, 200, { success: true, list });
      }

      // By department name + year (all semesters)
      if (name && year) {
        const departments = await Department.find({ name, year });
        const list = [];

        for (const dept of departments) {
          const subs = await Subject.find({ department: dept._id });
          subs.forEach(sub => {
            list.push({
              sname: sub.name,
              scode: sub.code,
              dname: dept.value,
              year: dept.year,
              sem: dept.semester
            });
          });
        }

        return sendResponse(res, 200, { success: true, list });
      }

      // By subject code
      if (code) {
        const sub = await Subject.findOne({ code });
        if (!sub) return sendResponse(res, 200, { success: false });

        const dept = await Department.findById(sub.department);
        const list = [
          {
            scode: sub.code,
            sname: sub.name,
            dname: dept.value,
            year: dept.year,
            sem: dept.semester
          }
        ];
        return sendResponse(res, 200, { success: true, list });
      }

      // Invalid query
      return sendResponse(res, 200, { success: false });
    } catch (err) {
      next(err);
    }
  });

/**
 * Add / Remove Subjects (CRUD group)
 */
subjectRouter
  .route("/GetandAddandRemove")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))

  // Add new subject
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const { department, year, semester, sname, scode } = req.body;

      const dept = await Department.findOne({
        name: department.value,
        year: year.value,
        semester: semester.value,
      });

      if (!dept) return next(new Error("Cannot find the department"));

      await Subject.insertMany({
        name: sname,
        code: scode,
        department: dept._id
      });

      return sendResponse(res, 200, { success: true });
    } catch (err) {
      next(err);
    }
  })

  // Delete subject by code
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const { id } = req.body;
      const result = await Subject.deleteOne({ code: id });

      return sendResponse(res, 200, {
        success: result.deletedCount > 0
      });
    } catch (err) {
      next(err);
    }
  });

/**
 * SUBJECT BY ID: GET / PUT / DELETE
 */
subjectRouter
  .route("/:subjectId")
  .options(cors.corsWithOptions, (_, res) => res.sendStatus(200))

  .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const subject = await Subject.findById(req.params.subjectId);
      if (!subject) return next(new Error("Cannot find Subject"));

      return sendResponse(res, 200, subject);
    } catch (err) {
      next(err);
    }
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const updated = await Subject.findByIdAndUpdate(
        req.params.subjectId,
        { $set: req.body },
        { new: true }
      );

      if (!updated) return next(new Error("No Subject found"));
      return sendResponse(res, 200, updated);
    } catch (err) {
      next(err);
    }
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const deleted = await Subject.findByIdAndDelete(req.params.subjectId);
      if (!deleted) return next(new Error("Cannot find Subject"));

      return sendResponse(res, 200, deleted);
    } catch (err) {
      next(err);
    }
  });

module.exports = subjectRouter;
