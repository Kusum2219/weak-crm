
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
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
  });

  // -----------------------------
  // Fetch Students
  // -----------------------------
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/students");

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // -----------------------------
  // Form handlers
  // -----------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
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
    });

    setEditingStudent(null);
  };

  // -----------------------------
  // Add / Edit Student
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        await api.put(
          `/students/${editingStudent.id}`,
          formData
        );
      } else {
        await api.post("/students", formData);
      }

      await fetchStudents();

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving student:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save student"
      );
    }
  };

  // -----------------------------
  // Edit
  // -----------------------------
  const handleEdit = (student) => {
    setEditingStudent(student);

    setFormData({
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

    setShowForm(true);
  };

  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/students/${id}`);

      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);

      alert("Failed to delete student");
    }
  };

  // -----------------------------
  // Filters
  // -----------------------------
  const classes = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) => student.className)
          .filter(Boolean)
      ),
    ];
  }, [students]);

  const sections = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) => student.section)
          .filter(Boolean)
      ),
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName =
        `${student.firstName || ""} ${
          student.lastName || ""
        }`.toLowerCase();

      const searchValue = search.toLowerCase();

      const matchesSearch =
        fullName.includes(searchValue) ||
        student.studentId
          ?.toLowerCase()
          .includes(searchValue) ||
        student.email
          ?.toLowerCase()
          .includes(searchValue) ||
        student.phone?.includes(searchValue);

      const matchesClass =
        classFilter === "ALL" ||
        student.className === classFilter;

      const matchesSection =
        sectionFilter === "ALL" ||
        student.section === sectionFilter;

      return (
        matchesSearch &&
        matchesClass &&
        matchesSection
      );
    });
  }, [
    students,
    search,
    classFilter,
    sectionFilter,
  ]);

  // -----------------------------
  // Risk helper
  // -----------------------------
  const getRiskLevel = (student) => {
    const performances = student.performances || [];

    if (performances.length === 0) {
      return "NO DATA";
    }

    const hasHigh = performances.some(
      (item) => item.riskLevel === "HIGH"
    );

    const hasMedium = performances.some(
      (item) => item.riskLevel === "MEDIUM"
    );

    if (hasHigh) return "HIGH";
    if (hasMedium) return "MEDIUM";

    return "LOW";
  };

  const getRiskStyle = (risk) => {
    if (risk === "HIGH") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "MEDIUM") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (risk === "LOW") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Students
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage students and monitor their academic status
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          + Add Student
        </button>
      </div>

      {/* -------------------------------- */}
      {/* Summary Cards */}
      {/* -------------------------------- */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Students
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {students.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            High Risk
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {
              students.filter(
                (student) =>
                  getRiskLevel(student) === "HIGH"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Medium Risk
          </p>

          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {
              students.filter(
                (student) =>
                  getRiskLevel(student) === "MEDIUM"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            No Performance Data
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-600">
            {
              students.filter(
                (student) =>
                  getRiskLevel(student) === "NO DATA"
              ).length
            }
          </p>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* Add/Edit Form */}
      {/* -------------------------------- */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingStudent
                  ? "Edit Student"
                  : "Add New Student"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter student information below
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Student ID
                </label>

                <input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  placeholder="STU001"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  First Name
                </label>

                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
                  value={formData.dateOfBirth}
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
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select Gender
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

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Class
                </label>

                <input
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
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
                  value={formData.section}
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
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Guardian Name
                </label>

                <input
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Guardian Phone
                </label>

                <input
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingStudent
                  ? "Update Student"
                  : "Save Student"}
              </button>

            </div>
          </form>
        </div>
      )}

      {/* -------------------------------- */}
      {/* Filters + Table */}
      {/* -------------------------------- */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Filter Header */}
        <div className="border-b border-gray-200 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name, ID, email or phone..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <select
                value={classFilter}
                onChange={(e) =>
                  setClassFilter(e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">
                  All Classes
                </option>

                {classes.map((className) => (
                  <option
                    key={className}
                    value={className}
                  >
                    Class {className}
                  </option>
                ))}
              </select>

              <select
                value={sectionFilter}
                onChange={(e) =>
                  setSectionFilter(e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">
                  All Sections
                </option>

                {sections.map((section) => (
                  <option
                    key={section}
                    value={section}
                  >
                    Section {section}
                  </option>
                ))}
              </select>

            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {filteredStudents.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {students.length}
            </span>{" "}
            students
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500">
              Loading students...
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              👨‍🎓
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No students found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left">

              <thead className="bg-gray-50">

                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Class
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Guardian
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Risk
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredStudents.map((student) => {
                  const risk = getRiskLevel(student);

                  return (
                    <tr
                      key={student.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Student */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                            {student.firstName
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {student.firstName}{" "}
                              {student.lastName || ""}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID: {student.studentId}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Class */}
                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-gray-800">
                          Class {student.className}
                        </p>

                        <p className="text-xs text-gray-500">
                          Section{" "}
                          {student.section || "-"}
                          {student.rollNumber
                            ? ` • Roll ${student.rollNumber}`
                            : ""}
                        </p>

                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-700">
                          {student.phone || "-"}
                        </p>

                        <p className="max-w-[180px] truncate text-xs text-gray-500">
                          {student.email || "-"}
                        </p>

                      </td>

                      {/* Guardian */}
                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-700">
                          {student.guardianName || "-"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {student.guardianPhone || "-"}
                        </p>

                      </td>

                      {/* Risk */}
                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getRiskStyle(
                            risk
                          )}`}
                        >
                          {risk}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleEdit(student)
                            }
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(student.id)
                            }
                            className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>

                        </div>

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

export default Students;
