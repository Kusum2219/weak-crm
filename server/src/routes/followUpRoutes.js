const express = require("express");

const {
  getFollowUps,
  getStudentFollowUps,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
} = require("../controllers/followUpController");

const router = express.Router();

// Get all follow-ups
router.get("/", getFollowUps);

// Get follow-ups of a particular student
router.get("/student/:studentId", getStudentFollowUps);

// Create a follow-up
router.post("/", createFollowUp);

// Update a follow-up
router.put("/:id", updateFollowUp);

// Delete a follow-up
router.delete("/:id", deleteFollowUp);

module.exports = router;