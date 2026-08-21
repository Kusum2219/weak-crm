
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const FollowUp = () => {
  const location = useLocation();

  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    followUpDate: "",
    reason: "",
    remarks: "",
  });

  // Receive student from At-Risk page
  useEffect(() => {
    if (location.state?.studentId) {
      setFormData((prev) => ({
        ...prev,
        studentId: location.state.studentId,
      }));

      setShowForm(true);
    }
  }, [location.state]);

  // Fetch follow-ups
  const fetchFollowUps = async () => {
    try {
      setLoading(true);

      const response = await api.get("/followups");

      setFollowUps(response.data);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create follow-up
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/followups", {
        studentId: Number(formData.studentId),
        followUpDate: formData.followUpDate,
        reason: formData.reason,
        remarks: formData.remarks,
      });

      setFormData({
        studentId: "",
        followUpDate: "",
        reason: "",
        remarks: "",
      });

      setShowForm(false);

      fetchFollowUps();
    } catch (error) {
      console.error("Error creating follow-up:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create follow-up"
      );
    }
  };

  // Delete follow-up
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this follow-up?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/followups/${id}`);

      fetchFollowUps();
    } catch (error) {
      console.error("Error deleting follow-up:", error);

      alert("Failed to delete follow-up");
    }
  };

  // Mark as completed
  const handleComplete = async (id) => {
    try {
      await api.put(`/followups/${id}`, {
        status: "COMPLETED",
      });

      fetchFollowUps();
    } catch (error) {
      console.error("Error completing follow-up:", error);

      alert("Failed to update follow-up");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Follow-Ups
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track student follow-ups
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Follow-Up
        </button>
      </div>

      {/* Add Follow-Up Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Add Follow-Up
            </h2>

            {location.state?.studentName && (
              <p className="mt-1 text-sm text-blue-600">
                Creating follow-up for{" "}
                <span className="font-semibold">
                  {location.state.studentName}
                </span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Student ID */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Student ID
                </label>

                <input
                  type="number"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Follow-Up Date
                </label>

                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Reason
                </label>

                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="e.g. Low academic performance"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Remarks
                </label>

                <input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Additional remarks"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Follow-Up
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Follow-Up List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Follow-Up Records
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Track pending and completed student follow-ups
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading follow-ups...
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-10 text-center">

            <p className="font-medium text-gray-700">
              No follow-ups found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add a follow-up to get started.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50">
                <tr>

                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Student
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Reason
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Remarks
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {followUps.map((followUp) => (
                  <tr
                    key={followUp.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <div className="font-medium text-gray-900">
                        {followUp.student?.firstName}{" "}
                        {followUp.student?.lastName || ""}
                      </div>

                      <div className="text-xs text-gray-500">
                        {followUp.student?.studentId}
                      </div>

                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(
                        followUp.followUpDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {followUp.reason}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {followUp.remarks || "-"}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          followUp.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : followUp.status === "OVERDUE"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {followUp.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex gap-2">

                        {followUp.status !== "COMPLETED" && (
                          <button
                            onClick={() =>
                              handleComplete(followUp.id)
                            }
                            className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                          >
                            Complete
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(followUp.id)
                          }
                          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
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

    </div>
  );
};

export default FollowUp;

