const prisma = require("../prisma");

// Get all follow-ups
const getFollowUps = async (req, res) => {
  try {
    const followUps = await prisma.followUp.findMany({
      include: {
        student: true,
      },
      orderBy: {
        followUpDate: "asc",
      },
    });

    res.json(followUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({
      message: "Failed to fetch follow-ups",
    });
  }
};

// Get follow-ups for a particular student
const getStudentFollowUps = async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    const followUps = await prisma.followUp.findMany({
      where: {
        studentId,
      },
      orderBy: {
        followUpDate: "asc",
      },
    });

    res.json(followUps);
  } catch (error) {
    console.error("Error fetching student follow-ups:", error);
    res.status(500).json({
      message: "Failed to fetch student follow-ups",
    });
  }
};

// Create follow-up
const createFollowUp = async (req, res) => {
  try {
    const {
      studentId,
      followUpDate,
      reason,
      remarks,
      status,
    } = req.body;

    if (!studentId || !followUpDate || !reason) {
      return res.status(400).json({
        message: "Student, follow-up date and reason are required",
      });
    }

    const followUp = await prisma.followUp.create({
      data: {
        studentId: parseInt(studentId),
        followUpDate: new Date(followUpDate),
        reason,
        remarks: remarks || null,
        status: status || "PENDING",
      },
      include: {
        student: true,
      },
    });

    res.status(201).json(followUp);
  } catch (error) {
    console.error("Error creating follow-up:", error);
    res.status(500).json({
      message: "Failed to create follow-up",
    });
  }
};

// Update follow-up
const updateFollowUp = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const {
      followUpDate,
      reason,
      remarks,
      status,
    } = req.body;

    const data = {};

    if (followUpDate) {
      data.followUpDate = new Date(followUpDate);
    }

    if (reason !== undefined) {
      data.reason = reason;
    }

    if (remarks !== undefined) {
      data.remarks = remarks;
    }

    if (status !== undefined) {
      data.status = status;

      if (status === "COMPLETED") {
        data.completedAt = new Date();
      } else {
        data.completedAt = null;
      }
    }

    const followUp = await prisma.followUp.update({
      where: {
        id,
      },
      data,
      include: {
        student: true,
      },
    });

    res.json(followUp);
  } catch (error) {
    console.error("Error updating follow-up:", error);
    res.status(500).json({
      message: "Failed to update follow-up",
    });
  }
};

// Delete follow-up
const deleteFollowUp = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.followUp.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Follow-up deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting follow-up:", error);
    res.status(500).json({
      message: "Failed to delete follow-up",
    });
  }
};

module.exports = {
  getFollowUps,
  getStudentFollowUps,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
};