const prisma = require("../prisma");

const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(subjects);
  } catch (error) {
    console.error("Get subjects error:", error);

    res.status(500).json({
      message: "Failed to fetch subjects",
    });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const subject = await prisma.subject.create({
      data: {
        name: name.trim(),
      },
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error("Create subject error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Subject already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create subject",
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const subject = await prisma.subject.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name.trim(),
      },
    });

    res.json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    console.error("Update subject error:", error);

    res.status(500).json({
      message: "Failed to update subject",
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.subject.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    res.status(500).json({
      message: "Failed to delete subject",
    });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};