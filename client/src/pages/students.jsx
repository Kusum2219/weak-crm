import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  studentId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  className: "",
  section: "",
  rollNumber: "",
  guardianName: "",
  guardianPhone: "",
  address: "",
};

const emptyPerformanceForm = {
  subjectId: "",
  examName: "",
  examDate: "",
  marksObtained: "",
  totalMarks: "100",
  remarks: "",
};

function Students() {
  // =========================
  // STUDENTS
  // =========================

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // SUBJECTS
  // =========================

  const [subjects, setSubjects] = useState([]);

  // =========================
  // ADD PERFORMANCE
  // =========================

  const [showPerformanceForm, setShowPerformanceForm] =
    useState(false);

  const [performanceStudent, setPerformanceStudent] =
    useState(null);

  const [performanceForm, setPerformanceForm] = useState(
    emptyPerformanceForm
  );

  const [performanceSaving, setPerformanceSaving] =
    useState(false);

  // =========================
  // VIEW PERFORMANCE
  // =========================

  const [showPerformance, setShowPerformance] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [performances, setPerformances] = useState([]);

  const [performanceLoading, setPerformanceLoading] =
    useState(false);

  // =========================
  // EDIT PERFORMANCE
  // =========================

  const [editingPerformanceId, setEditingPerformanceId] =
    useState(null);

  const [editPerformanceForm, setEditPerformanceForm] =
    useState(emptyPerformanceForm);

  const [editPerformanceSaving, setEditPerformanceSaving] =
    useState(false);

  // =========================
  // FETCH STUDENTS
  // =========================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/students");

      setStudents(response.data);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch students"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH SUBJECTS
  // =========================

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");

      setSubjects(response.data);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  // =========================
  // STUDENT INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PERFORMANCE INPUT
  // =========================

  const handlePerformanceChange = (e) => {
    const { name, value } = e.target;

    setPerformanceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // ADD STUDENT
  // =========================

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");

    setShowForm(true);

    setShowPerformanceForm(false);
    setPerformanceStudent(null);
  };

  // =========================
  // EDIT STUDENT
  // =========================

  const handleEdit = (student) => {
    setEditingId(student.id);

    setForm({
      studentId: student.studentId || "",
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.split("T")[0]
        : "",
      gender: student.gender || "",
      className: student.className || "",
      section: student.section || "",
      rollNumber: student.rollNumber || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      address: student.address || "",
    });

    setError("");
    setShowForm(true);

    setShowPerformanceForm(false);
    setPerformanceStudent(null);
  };

  // =========================
  // SAVE STUDENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.studentId ||
      !form.firstName ||
      !form.className
    ) {
      setError(
        "Student ID, First Name and Class are required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await api.put(`/students/${editingId}`, form);
      } else {
        await api.post("/students", form);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await fetchStudents();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save student"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/students/${id}`);

      await fetchStudents();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete student"
      );
    }
  };

  // =========================
  // ADD PERFORMANCE
  // =========================

  const handleAddPerformance = (student) => {
    setPerformanceStudent(student);

    setPerformanceForm(emptyPerformanceForm);

    setError("");

    setShowForm(false);
    setEditingId(null);

    setShowPerformance(false);
    setSelectedStudent(null);

    setShowPerformanceForm(true);
  };

  // =========================
  // SAVE PERFORMANCE
  // =========================

  const handlePerformanceSubmit = async (e) => {
    e.preventDefault();

    if (
      !performanceForm.subjectId ||
      performanceForm.marksObtained === "" ||
      performanceForm.totalMarks === ""
    ) {
      setError(
        "Subject, Marks Obtained and Total Marks are required."
      );
      return;
    }

    const obtained = Number(
      performanceForm.marksObtained
    );

    const total = Number(
      performanceForm.totalMarks
    );

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
      setPerformanceSaving(true);
      setError("");

      await api.post("/performances", {
        studentId: performanceStudent.id,
        subjectId: Number(performanceForm.subjectId),
        examName: performanceForm.examName || null,
        examDate: performanceForm.examDate || null,
        marksObtained: obtained,
        totalMarks: total,
        remarks: performanceForm.remarks || null,
      });

      setShowPerformanceForm(false);
      setPerformanceStudent(null);
      setPerformanceForm(emptyPerformanceForm);

      alert("Performance added successfully!");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create performance"
      );
    } finally {
      setPerformanceSaving(false);
    }
  };

  // =========================
  // VIEW PERFORMANCE
  // =========================

  const handleViewPerformance = async (student) => {
    try {
      setSelectedStudent(student);
      setShowPerformance(true);
      setPerformanceLoading(true);
      setError("");
      setEditingPerformanceId(null);

      const response = await api.get(
        `/performances/student/${student.id}`
      );

      setPerformances(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch performance"
      );
    } finally {
      setPerformanceLoading(false);
    }
  };

  // =========================
  // EDIT PERFORMANCE
  // =========================

  const handleEditPerformance = (performance) => {
    setEditingPerformanceId(performance.id);

    setEditPerformanceForm({
      subjectId: String(performance.subjectId || ""),
      examName: performance.examName || "",
      examDate: performance.examDate
        ? performance.examDate.split("T")[0]
        : "",
      marksObtained: String(
        performance.marksObtained ?? ""
      ),
      totalMarks: String(
        performance.totalMarks ?? "100"
      ),
      remarks: performance.remarks || "",
    });

    setError("");
  };

  // =========================
  // EDIT PERFORMANCE INPUT
  // =========================

  const handleEditPerformanceChange = (e) => {
    const { name, value } = e.target;

    setEditPerformanceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PERFORMANCE
  // =========================

  const handleUpdatePerformance = async (e) => {
    e.preventDefault();

    if (
      !editPerformanceForm.subjectId ||
      editPerformanceForm.marksObtained === "" ||
      editPerformanceForm.totalMarks === ""
    ) {
      setError(
        "Subject, Marks Obtained and Total Marks are required."
      );
      return;
    }

    const obtained = Number(
      editPerformanceForm.marksObtained
    );

    const total = Number(
      editPerformanceForm.totalMarks
    );

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
      setEditPerformanceSaving(true);
      setError("");

      await api.put(
        `/performances/${editingPerformanceId}`,
        {
          subjectId: Number(
            editPerformanceForm.subjectId
          ),
          examName:
            editPerformanceForm.examName || null,
          examDate:
            editPerformanceForm.examDate || null,
          marksObtained: obtained,
          totalMarks: total,
          remarks:
            editPerformanceForm.remarks || null,
        }
      );

      const response = await api.get(
        `/performances/student/${selectedStudent.id}`
      );

      setPerformances(response.data);

      setEditingPerformanceId(null);
      setEditPerformanceForm(emptyPerformanceForm);

      alert("Performance updated successfully!");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update performance"
      );
    } finally {
      setEditPerformanceSaving(false);
    }
  };

  // =========================
  // DELETE PERFORMANCE
  // =========================

  const handleDeletePerformance = async (
    performanceId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this performance?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/performances/${performanceId}`
      );

      setPerformances((prev) =>
        prev.filter(
          (performance) =>
            performance.id !== performanceId
        )
      );

      if (
        editingPerformanceId === performanceId
      ) {
        setEditingPerformanceId(null);
      }

      alert("Performance deleted successfully!");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete performance"
      );
    }
  };

  // =========================
  // CLOSE PERFORMANCE
  // =========================

  const closePerformance = () => {
    setShowPerformance(false);
    setSelectedStudent(null);
    setPerformances([]);
    setEditingPerformanceId(null);
    setEditPerformanceForm(emptyPerformanceForm);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Students
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage student information and records
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Student
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          ADD / EDIT STUDENT FORM
      ===================================================== */}

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId
                  ? "Edit Student"
                  : "Add New Student"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the student's details below
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-2xl text-gray-400 hover:text-gray-700"
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            {/* BASIC */}

            <div className="mb-8">

              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Basic Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Student ID *
                  </label>

                  <input
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    placeholder="STU001"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name *
                  </label>

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="MALE">
                      Male
                    </option>

                    <option value="FEMALE">
                      Female
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </div>

              </div>
            </div>

            {/* ACADEMIC */}

            <div className="mb-8">

              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Academic Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Class *
                  </label>

                  <input
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Section
                  </label>

                  <input
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    placeholder="A"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Roll Number
                  </label>

                  <input
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={handleChange}
                    placeholder="21"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* GUARDIAN */}

            <div className="mb-8">

              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                Guardian Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Guardian Name
                  </label>

                  <input
                    name="guardianName"
                    value={form.guardianName}
                    onChange={handleChange}
                    placeholder="Parent / Guardian name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Guardian Phone
                  </label>

                  <input
                    name="guardianPhone"
                    value={form.guardianPhone}
                    onChange={handleChange}
                    placeholder="Guardian phone"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* ADDRESS */}

            <div className="mb-8">

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                placeholder="Student address"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 border-t pt-5">

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
                className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Student"
                  : "Save Student"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* =====================================================
          ADD PERFORMANCE FORM
      ===================================================== */}

      {showPerformanceForm &&
        performanceStudent && (
          <div className="mb-8 rounded-xl border border-green-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Performance
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add marks for{" "}
                  <span className="font-medium text-gray-800">
                    {performanceStudent.firstName}{" "}
                    {performanceStudent.lastName || ""}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPerformanceForm(false);
                  setPerformanceStudent(null);
                }}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <form onSubmit={handlePerformanceSubmit}>

              <div className="mb-8">

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Exam Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Subject *
                    </label>

                    <select
                      name="subjectId"
                      value={performanceForm.subjectId}
                      onChange={handlePerformanceChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
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

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Exam Name
                    </label>

                    <input
                      name="examName"
                      value={performanceForm.examName}
                      onChange={handlePerformanceChange}
                      placeholder="Unit Test 1"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Exam Date
                    </label>

                    <input
                      type="date"
                      name="examDate"
                      value={performanceForm.examDate}
                      onChange={handlePerformanceChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500"
                    />
                  </div>

                </div>
              </div>

              <div className="mb-8">

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Marks & Performance
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Marks Obtained *
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="marksObtained"
                      value={performanceForm.marksObtained}
                      onChange={handlePerformanceChange}
                      placeholder="35"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Total Marks *
                    </label>

                    <input
                      type="number"
                      min="1"
                      name="totalMarks"
                      value={performanceForm.totalMarks}
                      onChange={handlePerformanceChange}
                      placeholder="100"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500"
                    />
                  </div>

                </div>

                {performanceForm.marksObtained !== "" &&
                  Number(performanceForm.totalMarks) > 0 && (
                    <div className="mt-4 rounded-lg bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">
                        Calculated Percentage
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        {(
                          (Number(
                            performanceForm.marksObtained
                          ) /
                            Number(
                              performanceForm.totalMarks
                            )) *
                          100
                        ).toFixed(2)}
                        %
                      </p>

                    </div>
                  )}

              </div>

              <div className="mb-8">

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={performanceForm.remarks}
                  onChange={handlePerformanceChange}
                  rows="3"
                  placeholder="Add remarks..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500"
                />

              </div>

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={() => {
                    setShowPerformanceForm(false);
                    setPerformanceStudent(null);
                  }}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={performanceSaving}
                  className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {performanceSaving
                    ? "Saving..."
                    : "Save Performance"}
                </button>

              </div>

            </form>
          </div>
        )}

      {/* =====================================================
          STUDENTS TABLE
      ===================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b px-6 py-5">

          <h2 className="text-xl font-semibold text-gray-900">
            Student Records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage all students
          </p>

        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center">

            <div className="text-4xl">
              👨‍🎓
            </div>

            <p className="mt-3 font-medium text-gray-700">
              No students found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first student to get started.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead className="border-b bg-gray-50">

                <tr>

                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                    Student ID
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                    Student Name
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                    Class
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                    Section
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                    Roll No.
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {students.map((student) => (

                  <tr
                    key={student.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >

                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {student.studentId}
                    </td>

                    <td className="px-5 py-4">

                      <div className="font-medium text-gray-900">
                        {student.firstName}{" "}
                        {student.lastName || ""}
                      </div>

                      {student.email && (
                        <div className="text-xs text-gray-500">
                          {student.email}
                        </div>
                      )}

                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {student.className || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {student.section || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {student.rollNumber || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {student.phone || "-"}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex flex-wrap gap-2">

                        {/* VIEW PERFORMANCE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewPerformance(student)
                          }
                          className="rounded-md border border-purple-200 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
                        >
                          View Performance
                        </button>

                        {/* ADD PERFORMANCE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleAddPerformance(student)
                          }
                          className="rounded-md border border-green-200 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50"
                        >
                          + Performance
                        </button>

                        {/* EDIT STUDENT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(student)
                          }
                          className="rounded-md border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        {/* DELETE STUDENT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(student.id)
                          }
                          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================================
          PERFORMANCE MODAL
      ===================================================== */}

      {showPerformance &&
        selectedStudent && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b px-6 py-5">

                <div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Student Performance
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">

                    {selectedStudent.firstName}{" "}
                    {selectedStudent.lastName || ""}

                    {" • "}

                    {selectedStudent.studentId}

                  </p>

                </div>

                <button
                  type="button"
                  onClick={closePerformance}
                  className="text-2xl text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                {performanceLoading ? (

                  <div className="py-12 text-center text-gray-500">
                    Loading performance...
                  </div>

                ) : performances.length === 0 ? (

                  <div className="rounded-lg bg-gray-50 py-12 text-center">

                    <div className="text-4xl">
                      📊
                    </div>

                    <p className="mt-3 font-medium text-gray-700">
                      No performance records found
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        closePerformance();
                        handleAddPerformance(
                          selectedStudent
                        );
                      }}
                      className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      + Add Performance
                    </button>

                  </div>

                ) : (

                  <div className="overflow-x-auto rounded-lg border">

                    <table className="w-full min-w-[1000px]">

                      <thead className="bg-gray-50">

                        <tr>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Subject
                          </th>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Exam
                          </th>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Date
                          </th>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Marks
                          </th>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Percentage
                          </th>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Risk
                          </th>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Remarks
                          </th>

                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {performances.map(
                          (performance) => (

                            <tr
                              key={performance.id}
                              className="border-t hover:bg-gray-50"
                            >

                              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                {performance.subject?.name ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4 text-sm text-gray-600">
                                {performance.examName ||
                                  "-"}
                              </td>

                              <td className="px-4 py-4 text-sm text-gray-600">
                                {performance.examDate
                                  ? new Date(
                                      performance.examDate
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>

                              <td className="px-4 py-4 text-sm text-gray-600">
                                {performance.marksObtained}{" "}
                                /{" "}
                                {performance.totalMarks}
                              </td>

                              <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                {performance.percentage}%
                              </td>

                              <td className="px-4 py-4">

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    performance.riskLevel ===
                                    "HIGH"
                                      ? "bg-red-100 text-red-700"
                                      : performance.riskLevel ===
                                        "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {performance.riskLevel ||
                                    "LOW"}
                                </span>

                              </td>

                              <td className="max-w-[180px] px-4 py-4 text-sm text-gray-600">
                                {performance.remarks ||
                                  "-"}
                              </td>

                              {/* PERFORMANCE ACTIONS */}

                              <td className="px-4 py-4">

                                <div className="flex gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditPerformance(
                                        performance
                                      )
                                    }
                                    className="rounded-md border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeletePerformance(
                                        performance.id
                                      )
                                    }
                                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

                {/* =================================================
                    EDIT PERFORMANCE FORM
                ================================================= */}

                {editingPerformanceId && (

                  <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                    <div className="mb-5 flex items-center justify-between">

                      <div>

                        <h3 className="text-lg font-semibold text-gray-900">
                          Edit Performance
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Update marks and exam details.
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingPerformanceId(null)
                        }
                        className="text-xl text-gray-400 hover:text-gray-700"
                      >
                        ×
                      </button>

                    </div>

                    <form
                      onSubmit={
                        handleUpdatePerformance
                      }
                    >

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                        {/* SUBJECT */}

                        <div>

                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Subject *
                          </label>

                          <select
                            name="subjectId"
                            value={
                              editPerformanceForm.subjectId
                            }
                            onChange={
                              handleEditPerformanceChange
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                          >

                            <option value="">
                              Select subject
                            </option>

                            {subjects.map(
                              (subject) => (

                                <option
                                  key={subject.id}
                                  value={subject.id}
                                >
                                  {subject.name}
                                </option>

                              )
                            )}

                          </select>

                        </div>

                        {/* EXAM */}

                        <div>

                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Exam Name
                          </label>

                          <input
                            name="examName"
                            value={
                              editPerformanceForm.examName
                            }
                            onChange={
                              handleEditPerformanceChange
                            }
                            placeholder="Unit Test 1"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                          />

                        </div>

                        {/* DATE */}

                        <div>

                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Exam Date
                          </label>

                          <input
                            type="date"
                            name="examDate"
                            value={
                              editPerformanceForm.examDate
                            }
                            onChange={
                              handleEditPerformanceChange
                            }
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
                            min="0"
                            name="marksObtained"
                            value={
                              editPerformanceForm.marksObtained
                            }
                            onChange={
                              handleEditPerformanceChange
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                          />

                        </div>

                        {/* TOTAL */}

                        <div>

                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Total Marks *
                          </label>

                          <input
                            type="number"
                            min="1"
                            name="totalMarks"
                            value={
                              editPerformanceForm.totalMarks
                            }
                            onChange={
                              handleEditPerformanceChange
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                          />

                        </div>

                      </div>

                      {/* REMARKS */}

                      <div className="mt-4">

                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Remarks
                        </label>

                        <textarea
                          name="remarks"
                          rows="3"
                          value={
                            editPerformanceForm.remarks
                          }
                          onChange={
                            handleEditPerformanceChange
                          }
                          placeholder="Remarks..."
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                        />

                      </div>

                      {/* EDIT BUTTONS */}

                      <div className="mt-5 flex justify-end gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            setEditingPerformanceId(
                              null
                            )
                          }
                          className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-white"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          disabled={
                            editPerformanceSaving
                          }
                          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          {editPerformanceSaving
                            ? "Updating..."
                            : "Update Performance"}
                        </button>

                      </div>

                    </form>

                  </div>

                )}

              </div>

              {/* FOOTER */}

              <div className="flex justify-end border-t px-6 py-4">

                <button
                  type="button"
                  onClick={closePerformance}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default Students;