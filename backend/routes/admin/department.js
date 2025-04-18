// routes/admin/department.js

const express = require('express');
const router = express.Router();
const department = require('../../models/department');
const Activity = require('../../models/activity');
const authenticate = require('../../authenticate');
const cors = require('../cors');

// Middleware
router.use(express.json());

// Helpers
const isAdmin = [cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin];

// Helper function to log activity
const logActivity = async (req, description, type = 'DEPARTMENT') => {
  try {
    const activity = new Activity({
      description,
      type,
      timestamp: new Date(),
      user: req.user._id
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// =========================
//  /admin/department/GetandAddandRemove
// =========================

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
      // Log activity for each department added
      for (const dept of req.body) {
        await logActivity(
          req,
          `Added department ${dept.name} (${dept.value}) for Year ${dept.year} Semester ${dept.semester}`
        );
      }
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
      if (result.deletedCount > 0) {
        await logActivity(
          req,
          `Deleted ${result.deletedCount} departments with name ${req.body.dname} (${req.body.dvalue})`
        );
      }
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
      await logActivity(
        req,
        `Updated department ${updated.name} (${updated.value}) for Year ${updated.year} Semester ${updated.semester}`
      );
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
      await logActivity(
        req,
        `Deleted department ${deleted.name} (${deleted.value}) for Year ${deleted.year} Semester ${deleted.semester}`
      );
      res.status(200).json({ success: true, deleted });
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
