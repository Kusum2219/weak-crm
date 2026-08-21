const express = require("express");

const {
  createPerformance,
  getAllPerformances,
  getStudentPerformances,
  updatePerformance,
  deletePerformance,
  getAtRiskStudents,
} = require("../controllers/performanceController");

const router = express.Router();

// Create
router.post("/", createPerformance);

// Get all
router.get("/", getAllPerformances);

// Get at-risk students
router.get("/at-risk", getAtRiskStudents);

// Get by student
router.get("/student/:studentId", getStudentPerformances);

// Update
router.put("/:id", updatePerformance);

// Delete
router.delete("/:id", deletePerformance);

module.exports = router;