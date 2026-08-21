const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();

    const totalPerformanceRecords = await prisma.performance.count();

    const highRiskStudents = await prisma.performance.count({
      where: {
        riskLevel: "HIGH",
      },
    });

    const pendingFollowUps = await prisma.followUp.count({
      where: {
        status: "PENDING",
      },
    });

    const completedFollowUps = await prisma.followUp.count({
      where: {
        status: "COMPLETED",
      },
    });

    const overdueFollowUps = await prisma.followUp.count({
      where: {
        status: "OVERDUE",
      },
    });

    const recentFollowUps = await prisma.followUp.findMany({
      take: 5,
      orderBy: {
        followUpDate: "desc",
      },
      include: {
        student: true,
      },
    });

    res.json({
      totalStudents,
      totalPerformanceRecords,
      highRiskStudents,
      pendingFollowUps,
      completedFollowUps,
      overdueFollowUps,
      recentFollowUps,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard data",
    });
  }
});

module.exports = router;