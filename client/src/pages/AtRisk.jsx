
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AtRisk = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchAtRiskStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/performances/at-risk");

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching at-risk students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  const filteredStudents = students.filter((item) => {
    const student = item.student;
    const searchText = search.toLowerCase();

    const matchesSearch =
      `${student.firstName} ${student.lastName || ""}`
        .toLowerCase()
        .includes(searchText) ||
      student.studentId.toLowerCase().includes(searchText) ||
      item.subject.name.toLowerCase().includes(searchText);

    const matchesRisk =
      filter === "ALL" || item.riskLevel === filter;

    return matchesSearch && matchesRisk;
  });

  const highRiskCount = students.filter(
    (item) => item.riskLevel === "HIGH"
  ).length;

  const mediumRiskCount = students.filter(
    (item) => item.riskLevel === "MEDIUM"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          At-Risk Students
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor students who need academic attention
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total At Risk
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {students.length}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Students requiring attention
          </p>
        </div>

        {/* High Risk */}
        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-600">
            High Risk
          </p>

          <p className="mt-2 text-3xl font-bold text-red-700">
            {highRiskCount}
          </p>

          <p className="mt-1 text-xs text-red-600">
            Below 50% performance
          </p>
        </div>

        {/* Medium Risk */}
        <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-5">
          <p className="text-sm font-medium text-yellow-700">
            Medium Risk
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-700">
            {mediumRiskCount}
          </p>

          <p className="mt-1 text-xs text-yellow-700">
            50% - 70% performance
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Search */}
          <input
            type="text"
            placeholder="Search student, ID or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-96"
          />

          {/* Risk Filters */}
          <div className="flex gap-2">

            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("HIGH")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === "HIGH"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              High Risk
            </button>

            <button
              onClick={() => setFilter("MEDIUM")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === "MEDIUM"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              }`}
            >
              Medium Risk
            </button>

          </div>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Students Requiring Attention
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Students identified based on their latest performance records
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading at-risk students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              ✓
            </div>

            <p className="font-medium text-gray-700">
              No at-risk students found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Try changing your search or filter.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Class
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Subject
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Exam
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Score
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Risk Level
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredStudents.map((item) => {

                  const student = item.student;

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Student */}
                      <td className="px-6 py-4">

                        <div className="font-medium text-gray-900">
                          {student.firstName}{" "}
                          {student.lastName || ""}
                        </div>

                        <div className="mt-0.5 text-xs text-gray-500">
                          {student.studentId}
                        </div>

                      </td>

                      {/* Class */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Class {student.className}

                        {student.section && (
                          <span className="text-gray-400">
                            {" "}
                            • Section {student.section}
                          </span>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {item.subject.name}
                      </td>

                      {/* Exam */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.examName || "-"}
                      </td>

                      {/* Score */}
                      <td className="px-6 py-4">

                        <div className="font-semibold text-gray-900">
                          {item.percentage}%
                        </div>

                        <div className="text-xs text-gray-500">
                          {item.marksObtained} / {item.totalMarks}
                        </div>

                      </td>

                      {/* Risk */}
                      <td className="px-6 py-4">

                        {item.riskLevel === "HIGH" ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            HIGH
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            MEDIUM
                          </span>
                        )}

                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            navigate("/followups", {
                              state: {
                                studentId: student.id,
                                studentName: `${student.firstName} ${
                                  student.lastName || ""
                                }`,
                              },
                            })
                          }
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                          Follow Up
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default AtRisk;

