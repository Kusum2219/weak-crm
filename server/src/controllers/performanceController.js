const prisma = require("../prisma");

// Calculate percentage
const calculatePercentage = (marksObtained, totalMarks) => {
  if (totalMarks <= 0) return 0;

  return Number(((marksObtained / totalMarks) * 100).toFixed(2));
};

// Risk based on percentage
const calculateRisk = (percentage) => {
  if (percentage < 50) {
    return "HIGH";
  }

  if (percentage <= 70) {
    return "MEDIUM";
  }

  return "LOW";
};

// CREATE PERFORMANCE
const createPerformance = async (req, res) => {
  try {
    const {
      studentId,
      subjectId,
      examName,
      examDate,
      marksObtained,
      totalMarks,
      remarks,
    } = req.body;

    // Validation
    if (
      !studentId ||
      !subjectId ||
      marksObtained === undefined ||
      totalMarks === undefined
    ) {
      return res.status(400).json({
        message:
          "studentId, subjectId, marksObtained and totalMarks are required",
      });
    }

    const obtained = Number(marksObtained);
    const total = Number(totalMarks);

    if (total <= 0) {
      return res.status(400).json({
        message: "Total marks must be greater than 0",
      });
    }

    if (obtained < 0 || obtained > total) {
      return res.status(400).json({
        message: "Marks obtained must be between 0 and total marks",
      });
    }

    // Check student
    const student = await prisma.student.findUnique({
      where: {
        id: Number(studentId),
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check subject
    const subject = await prisma.subject.findUnique({
      where: {
        id: Number(subjectId),
      },
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    const percentage = calculatePercentage(obtained, total);
    const riskLevel = calculateRisk(percentage);

    const performance = await prisma.performance.create({
      data: {
        studentId: Number(studentId),
        subjectId: Number(subjectId),
        examName: examName || null,
        examDate: examDate ? new Date(examDate) : null,
        marksObtained: obtained,
        totalMarks: total,
        percentage,
        riskLevel,
        remarks: remarks || null,
      },
      include: {
        student: true,
        subject: true,
      },
    });

    return res.status(201).json({
      message: "Performance created successfully",
      performance,
    });
  } catch (error) {
    console.error("Create performance error:", error);

    return res.status(500).json({
      message: "Failed to create performance",
    });
  }
};

// GET ALL PERFORMANCES
const getAllPerformances = async (req, res) => {
  try {
    const performances = await prisma.performance.findMany({
      include: {
        student: true,
        subject: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(performances);
  } catch (error) {
    console.error("Get performances error:", error);

    return res.status(500).json({
      message: "Failed to fetch performances",
    });
  }
};

// GET PERFORMANCES BY STUDENT
const getStudentPerformances = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    if (!studentId || Number.isNaN(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const performances = await prisma.performance.findMany({
      where: {
        studentId,
      },
      include: {
        subject: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(performances);
  } catch (error) {
    console.error("Get student performances error:", error);

    return res.status(500).json({
      message: "Failed to fetch student performances",
    });
  }
};

// UPDATE PERFORMANCE
const updatePerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      subjectId,
      examName,
      examDate,
      marksObtained,
      totalMarks,
      remarks,
    } = req.body;

    const existing = await prisma.performance.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Performance not found",
      });
    }

    const obtained =
      marksObtained !== undefined
        ? Number(marksObtained)
        : existing.marksObtained;

    const total =
      totalMarks !== undefined
        ? Number(totalMarks)
        : existing.totalMarks;

    if (total <= 0) {
      return res.status(400).json({
        message: "Total marks must be greater than 0",
      });
    }

    if (obtained < 0 || obtained > total) {
      return res.status(400).json({
        message: "Marks obtained must be between 0 and total marks",
      });
    }

    const percentage = calculatePercentage(obtained, total);
    const riskLevel = calculateRisk(percentage);

    const performance = await prisma.performance.update({
      where: {
        id: Number(id),
      },
      data: {
        subjectId:
          subjectId !== undefined
            ? Number(subjectId)
            : existing.subjectId,

        examName:
          examName !== undefined
            ? examName
            : existing.examName,

        examDate:
          examDate !== undefined
            ? examDate
              ? new Date(examDate)
              : null
            : existing.examDate,

        marksObtained: obtained,
        totalMarks: total,
        percentage,
        riskLevel,

        remarks:
          remarks !== undefined
            ? remarks
            : existing.remarks,
      },
      include: {
        student: true,
        subject: true,
      },
    });

    return res.status(200).json({
      message: "Performance updated successfully",
      performance,
    });
  } catch (error) {
    console.error("Update performance error:", error);

    return res.status(500).json({
      message: "Failed to update performance",
    });
  }
};

// DELETE PERFORMANCE
const deletePerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.performance.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Performance not found",
      });
    }

    await prisma.performance.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Performance deleted successfully",
    });
  } catch (error) {
    console.error("Delete performance error:", error);

    return res.status(500).json({
      message: "Failed to delete performance",
    });
  }
};

// GET AT-RISK STUDENTS
const getAtRiskStudents = async (req, res) => {
  try {
    const performances = await prisma.performance.findMany({
      where: {
        riskLevel: {
          in: ["HIGH", "MEDIUM"],
        },
      },
      include: {
        student: true,
        subject: true,
      },
      orderBy: [
        {
          riskLevel: "asc",
        },
        {
          percentage: "asc",
        },
      ],
    });

    return res.status(200).json(performances);
  } catch (error) {
    console.error("Get at-risk students error:", error);

    return res.status(500).json({
      message: "Failed to fetch at-risk students",
    });
  }
};

module.exports = {
  createPerformance,
  getAllPerformances,
  getStudentPerformances,
  updatePerformance,
  deletePerformance,
  getAtRiskStudents,
};