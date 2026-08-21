const prisma = require("../prisma");

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        performances: {
          include: {
            subject: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        followUps: {
          orderBy: {
            followUpDate: "asc",
          },
        },
      },
    });

    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

// Get single student
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        performances: {
          include: {
            subject: true,
          },
          orderBy: {
            examDate: "desc",
          },
        },
        followUps: {
          orderBy: {
            followUpDate: "asc",
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({
      message: "Failed to fetch student",
    });
  }
};

// Create student
const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      className,
      section,
      rollNumber,
      guardianName,
      guardianPhone,
      address,
    } = req.body;

    if (!studentId || !firstName || !className) {
      return res.status(400).json({
        message: "Student ID, first name and class are required",
      });
    }

    const student = await prisma.student.create({
      data: {
        studentId,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        className,
        section,
        rollNumber,
        guardianName,
        guardianPhone,
        address,
      },
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Create student error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Student ID or email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create student",
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      studentId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      className,
      section,
      rollNumber,
      guardianName,
      guardianPhone,
      address,
    } = req.body;

    const student = await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: {
        studentId,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        className,
        section,
        rollNumber,
        guardianName,
        guardianPhone,
        address,
      },
    });

    res.json(student);
  } catch (error) {
    console.error("Update student error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Student ID or email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update student",
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete student",
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};