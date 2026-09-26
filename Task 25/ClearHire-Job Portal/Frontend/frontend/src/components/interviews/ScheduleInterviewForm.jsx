import { useState } from "react";
import { createInterview } from "../../services/interviews";

function ScheduleInterviewForm({ applicationId, onCreated }) {
  const [formData, setFormData] = useState({
    scheduled_at: "",
    interview_type: "Technical",
    meeting_link: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.scheduled_at) {
        setError("Please select an interview date and time.");
        return;
      }

      const interviewData = {
        application_id: Number(applicationId),
        scheduled_at: new Date(
          formData.scheduled_at
        ).toISOString(),
        interview_type: formData.interview_type,
        meeting_link: formData.meeting_link || null,
        notes: formData.notes || null,
      };

      const createdInterview = await createInterview(
        interviewData
      );

      setSuccess("Interview scheduled successfully.");

      setFormData({
        scheduled_at: "",
        interview_type: "Technical",
        meeting_link: "",
        notes: "",
      });

      if (onCreated) {
        onCreated(createdInterview);
      }
    } catch (err) {
      console.error("Failed to schedule interview:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to schedule the interview. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div>
        <h3 className="font-semibold text-gray-900">
          Schedule Interview
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          Add an interview time and the information the candidate needs.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4"
      >
        <div>
          <label
            htmlFor={`scheduled_at-${applicationId}`}
            className="block text-sm font-medium text-gray-700"
          >
            Date & Time
          </label>

          <input
            id={`scheduled_at-${applicationId}`}
            name="scheduled_at"
            type="datetime-local"
            value={formData.scheduled_at}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor={`interview_type-${applicationId}`}
            className="block text-sm font-medium text-gray-700"
          >
            Interview Type
          </label>

          <select
            id={`interview_type-${applicationId}`}
            name="interview_type"
            value={formData.interview_type}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500"
          >
            <option value="Technical">
              Technical
            </option>

            <option value="HR">
              HR
            </option>

            <option value="Managerial">
              Managerial
            </option>

            <option value="Behavioral">
              Behavioral
            </option>

            <option value="Final">
              Final
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`meeting_link-${applicationId}`}
            className="block text-sm font-medium text-gray-700"
          >
            Meeting Link
          </label>

          <input
            id={`meeting_link-${applicationId}`}
            name="meeting_link"
            type="url"
            value={formData.meeting_link}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor={`notes-${applicationId}`}
            className="block text-sm font-medium text-gray-700"
          >
            Notes
          </label>

          <textarea
            id={`notes-${applicationId}`}
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional instructions or information for the candidate."
            className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">
              {success}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Scheduling..."
            : "Schedule Interview"}
        </button>
      </form>
    </div>
  );
}

export default ScheduleInterviewForm;