// routes/admin/department.js

const express = require('express');
const router = express.Router();
const department = require('../../models/department');
const authenticate = require('../../authenticate');
const cors = require('../cors');

// Middleware
router.use(express.json());

// Helpers
const isAdmin = [cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin];

// =========================
//  /admin/department/GetandAddandRemove
// =========================

// GET: List all unique department names
router.route('/GetandAddandRemove')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(isAdmin, async (req, res, next) => {
    try {
      const departments = await department.distinct('name');
      res.status(200).json({ success: true, list: departments });
    } catch (err) {
      next(err);
    }
  })

  // POST: Add departments (bulk insert)
  .post(isAdmin, async (req, res, next) => {
    try {
      await department.insertMany(req.body);
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  })

  // PUT: Not allowed
  .put(isAdmin, (req, res) => {
    res.status(403).send('PUT Operation is not permitted');
  })

  // DELETE: Delete all entries by name + value
  .delete(isAdmin, async (req, res, next) => {
    try {
      const result = await department.deleteMany({
        name: req.body.dname,
        value: req.body.dvalue,
      });
      res.status(200).json({ success: true, deletedCount: result.deletedCount });
    } catch (err) {
      next(err);
    }
  });


// =========================
//  /admin/department/:departmentId
// =========================

router.route('/:departmentId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  // GET a department by ID
  .get(isAdmin, async (req, res, next) => {
    try {
      const dept = await department.findById(req.params.departmentId);
      if (!dept) {
        return res.status(404).json({ error: 'Department not found' });
      }
      res.status(200).json(dept);
    } catch (err) {
      next(err);
    }
  })

  // POST not allowed
  .post(isAdmin, (req, res) => {
    res.status(403).send('POST Operation is not permitted');
  })

  // PUT update department
  .put(isAdmin, async (req, res, next) => {
    try {
      const updated = await department.findByIdAndUpdate(
        req.params.departmentId,
        { $set: req.body },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Department not found' });
      }
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  })

  // DELETE department by ID
  .delete(isAdmin, async (req, res, next) => {
    try {
      const deleted = await department.findByIdAndDelete(req.params.departmentId);
      if (!deleted) {
        return res.status(404).json({ error: 'Department not found' });
      }
      res.status(200).json({ success: true, deleted });
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
