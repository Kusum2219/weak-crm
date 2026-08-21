
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const followUpData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "Completed",
        value: data.completedFollowUps,
      },
      {
        name: "Pending",
        value: data.pendingFollowUps,
      },
      {
        name: "Overdue",
        value: data.overdueFollowUps,
      },
    ];
  }, [data]);

  const performanceData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "Students",
        value: data.totalStudents,
      },
      {
        name: "High Risk",
        value: data.highRiskStudents,
      },
      {
        name: "Performance Records",
        value: data.totalPerformanceRecords,
      },
    ];
  }, [data]);

  const followUpTotal =
    (data?.pendingFollowUps || 0) +
    (data?.completedFollowUps || 0) +
    (data?.overdueFollowUps || 0);

  const riskPercentage =
    data?.totalStudents > 0
      ? Math.round(
          (data.highRiskStudents / data.totalStudents) * 100
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="animate-pulse space-y-6">

          <div className="h-8 w-60 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-200" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="h-96 rounded-2xl bg-white" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-red-600">
            Make sure the backend server is running.
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-semibold text-blue-600">
            Academic Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Keep track of student performance, identify at-risk
            students and manage follow-up activities.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/students")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            View Students
          </button>

          <button
            onClick={() => navigate("/followups")}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
          >
            + Add Follow-Up
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Students */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Students
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {data.totalStudents}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Registered students
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
              👥
            </div>
          </div>
        </div>

        {/* High Risk */}
        <div
          onClick={() => navigate("/at-risk")}
          className="group cursor-pointer rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                High Risk
              </p>

              <p className="mt-3 text-3xl font-bold text-red-600">
                {data.highRiskStudents}
              </p>

              <p className="mt-2 text-xs text-red-500">
                Need immediate attention
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              ⚠
            </div>
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => navigate("/followups")}
          className="group cursor-pointer rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Follow-Ups
              </p>

              <p className="mt-3 text-3xl font-bold text-amber-600">
                {data.pendingFollowUps}
              </p>

              <p className="mt-2 text-xs text-amber-500">
                Awaiting action
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl">
              ◷
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-600">
                {data.completedFollowUps}
              </p>

              <p className="mt-2 text-xs text-emerald-500">
                Successfully completed
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Follow-Up Pie Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Follow-Up Status
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current distribution of follow-up activities
              </p>
            </div>

            <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {followUpTotal} Total
            </span>
          </div>

          <div className="mt-6 h-64">
            {followUpTotal === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-400">
                  No follow-up data available
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={followUpData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 10px 25px rgba(15, 23, 42, 0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-emerald-50 p-3 text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-emerald-500" />

              <p className="text-xs text-slate-500">
                Completed
              </p>

              <p className="mt-1 font-bold text-emerald-600">
                {data.completedFollowUps}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-amber-500" />

              <p className="text-xs text-slate-500">
                Pending
              </p>

              <p className="mt-1 font-bold text-amber-600">
                {data.pendingFollowUps}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-red-500" />

              <p className="text-xs text-slate-500">
                Overdue
              </p>

              <p className="mt-1 font-bold text-red-600">
                {data.overdueFollowUps}
              </p>
            </div>

          </div>
        </div>

        {/* Performance Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                CRM Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Key student and academic metrics
              </p>
            </div>

            <button
              onClick={() => navigate("/performance")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Performance →
            </button>
          </div>

          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 10px 25px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  barSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= RISK + FOLLOW-UP ================= */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Risk Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Risk Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Students requiring attention
              </p>
            </div>

            <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
              {riskPercentage}%
            </span>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                High-risk students
              </span>

              <span className="text-sm font-bold text-red-600">
                {data.highRiskStudents}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-700"
                style={{
                  width: `${Math.min(riskPercentage, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              Attention Required
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              These students have performance below the high-risk
              threshold and may require intervention.
            </p>

            <button
              onClick={() => navigate("/at-risk")}
              className="mt-3 text-xs font-semibold text-red-700 hover:underline"
            >
              Review At-Risk Students →
            </button>
          </div>
        </div>

        {/* Follow-Up Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div>
            <h2 className="font-semibold text-slate-900">
              Follow-Up Progress
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Track how effectively student follow-ups are being handled
            </p>
          </div>

          <div className="mt-7 space-y-6">

            {/* Completed */}
            <div>
              <div className="mb-2 flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm font-medium text-slate-700">
                    Completed
                  </span>
                </div>

                <span className="text-sm font-semibold text-emerald-600">
                  {data.completedFollowUps}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width:
                      followUpTotal === 0
                        ? "0%"
                        : `${
                            (data.completedFollowUps /
                              followUpTotal) *
                            100
                          }%`,
                  }}
                />
              </div>
            </div>

            {/* Pending */}
            <div>
              <div className="mb-2 flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

                  <span className="text-sm font-medium text-slate-700">
                    Pending
                  </span>
                </div>

                <span className="text-sm font-semibold text-amber-600">
                  {data.pendingFollowUps}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{
                    width:
                      followUpTotal === 0
                        ? "0%"
                        : `${
                            (data.pendingFollowUps /
                              followUpTotal) *
                            100
                          }%`,
                  }}
                />
              </div>
            </div>

            {/* Overdue */}
            <div>
              <div className="mb-2 flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                  <span className="text-sm font-medium text-slate-700">
                    Overdue
                  </span>
                </div>

                <span className="text-sm font-semibold text-red-600">
                  {data.overdueFollowUps}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width:
                      followUpTotal === 0
                        ? "0%"
                        : `${
                            (data.overdueFollowUps /
                              followUpTotal) *
                            100
                          }%`,
                  }}
                />
              </div>
            </div>

          </div>

          <div className="mt-7 flex justify-end">
            <button
              onClick={() => navigate("/followups")}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Manage Follow-Ups
            </button>
          </div>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY ================= */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest follow-up activity
            </p>
          </div>

          <button
            onClick={() => navigate("/followups")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All →
          </button>
        </div>

        {data.recentFollowUps.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">
              No recent activity.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.recentFollowUps.map((followUp) => (
              <div
                key={followUp.id}
                className="flex flex-col gap-3 px-6 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {followUp.student?.firstName?.charAt(0)}
                    {followUp.student?.lastName?.charAt(0) || ""}
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">
                      {followUp.student?.firstName}{" "}
                      {followUp.student?.lastName || ""}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {followUp.reason || "Student follow-up"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">

                  <span className="text-xs text-slate-500">
                    {new Date(
                      followUp.followUpDate
                    ).toLocaleDateString()}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      followUp.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700"
                        : followUp.status === "OVERDUE"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {followUp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
