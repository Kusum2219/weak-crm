import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  studentId: "",
  subjectId: "",
  examName: "",
  examDate: "",
  marksObtained: "",
  totalMarks: "100",
  remarks: "",
};

function Performance() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [performances, setPerformances] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // FETCH STUDENTS
  // -------------------------
  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch students");
    }
  };

  // -------------------------
  // FETCH SUBJECTS
  // -------------------------
  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to fetch subjects"
      );
    }
  };

  // -------------------------
  // FETCH PERFORMANCES
  // -------------------------
  const fetchPerformances = async () => {
    try {
      setLoading(true);

      const response = await api.get("/performances");

      setPerformances(response.data);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch performances"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
    fetchPerformances();
  }, []);

  // -------------------------
  // HANDLE INPUT
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------
  // OPEN FORM
  // -------------------------
  const handleAdd = () => {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  // -------------------------
  // SUBMIT PERFORMANCE
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.studentId ||
      !form.subjectId ||
      form.marksObtained === "" ||
      form.totalMarks === ""
    ) {
      setError(
        "Student, Subject, Marks Obtained and Total Marks are required."
      );
      return;
    }

    const obtained = Number(form.marksObtained);
    const total = Number(form.totalMarks);

    if (total <= 0) {
      setError("Total marks must be greater than 0.");
      return;
    }

    if (obtained < 0 || obtained > total) {
      setError(
        "Marks obtained must be between 0 and total marks."
      );
      return;
    }

    try {
      setSaving(true);

      await api.post("/performances", {
        studentId: Number(form.studentId),
        subjectId: Number(form.subjectId),
        examName: form.examName || null,
        examDate: form.examDate || null,
        marksObtained: obtained,
        totalMarks: total,
        remarks: form.remarks || null,
      });

      setForm(emptyForm);
      setShowForm(false);

      await fetchPerformances();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create performance"
      );
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // RISK BADGE
  // -------------------------
  const getRiskClass = (risk) => {
    if (risk === "HIGH") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "MEDIUM") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Performance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track marks and identify weak students
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Performance
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the student's exam marks
              </p>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="text-2xl text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {/* STUDENT */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Student *
                </label>

                <select
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.firstName}{" "}
                      {student.lastName || ""} —{" "}
                      {student.studentId}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBJECT */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Subject *
                </label>

                <select
                  name="subjectId"
                  value={form.subjectId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select subject
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* EXAM NAME */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Exam Name
                </label>

                <input
                  name="examName"
                  value={form.examName}
                  onChange={handleChange}
                  placeholder="Unit Test 1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              {/* EXAM DATE */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Exam Date
                </label>

                <input
                  type="date"
                  name="examDate"
                  value={form.examDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              {/* MARKS */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Marks Obtained *
                </label>

                <input
                  type="number"
                  name="marksObtained"
                  value={form.marksObtained}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="35"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              {/* TOTAL MARKS */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Total Marks *
                </label>

                <input
                  type="number"
                  name="totalMarks"
                  value={form.totalMarks}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* REMARKS */}
            <div className="mt-5">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Remarks
              </label>

              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Enter teacher remarks..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-5">

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Performance"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* PERFORMANCE TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Performance Records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            All recorded exam performances
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="border-b bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Subject
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Exam
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Marks
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Percentage
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Risk
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Loading performances...
                  </td>
                </tr>

              ) : performances.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >
                    <div className="text-4xl">
                      📊
                    </div>

                    <p className="mt-3 font-medium text-gray-700">
                      No performance records
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add marks to start tracking student performance.
                    </p>
                  </td>
                </tr>

              ) : (

                performances.map((performance) => (

                  <tr
                    key={performance.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >

                    {/* STUDENT */}
                    <td className="px-6 py-4">

                      <div className="font-medium text-gray-900">
                        {performance.student?.firstName}{" "}
                        {performance.student?.lastName || ""}
                      </div>

                      <div className="text-sm text-gray-500">
                        {performance.student?.studentId}
                      </div>

                    </td>

                    {/* SUBJECT */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {performance.subject?.name || "-"}
                    </td>

                    {/* EXAM */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {performance.examName || "-"}
                    </td>

                    {/* MARKS */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {performance.marksObtained} /{" "}
                      {performance.totalMarks}
                    </td>

                    {/* PERCENTAGE */}
                    <td className="px-6 py-4">

                      <span className="font-semibold text-gray-900">
                        {performance.percentage}%
                      </span>

                    </td>

                    {/* RISK */}
                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRiskClass(
                          performance.riskLevel
                        )}`}
                      >
                        {performance.riskLevel}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Performance;