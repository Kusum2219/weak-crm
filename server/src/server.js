const express = require("express");
const cors = require("cors");

const app = express();
const studentRoutes = require("./routes/studentRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const followUpRoutes = require("./routes/followUpRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/performances", performanceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/followups", followUpRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Weak Student CRM API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});