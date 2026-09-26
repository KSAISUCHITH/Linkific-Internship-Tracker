import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createApplication } from "../../services/applications";

function ApplyJobForm({ jobId }) {
  const { isAuthenticated } = useAuth();

  const [expectedResponseDays, setExpectedResponseDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleApply = async () => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");

      await createApplication({
        job_id: Number(jobId),
        expected_response_days: Number(expectedResponseDays),
      });

      setSuccess("Your application has been submitted successfully.");
    } catch (err) {
      console.error("Failed to submit application:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to submit your application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="font-semibold text-gray-900">
          Interested in this opportunity?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Sign in to your ClearHire account to apply for this position.
        </p>

        <Link
          to="/login"
          className="mt-6 block rounded-xl bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Sign in to Apply
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <h2 className="font-semibold text-gray-900">
        Apply for this position
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        Submit your application and optionally provide an expected response
        period.
      </p>

      <div className="mt-6">
        <label
          htmlFor="expectedResponseDays"
          className="block text-sm font-medium text-gray-700"
        >
          Expected response time
        </label>

        <div className="mt-2 flex items-center gap-3">
          <input
            id="expectedResponseDays"
            type="number"
            min="1"
            value={expectedResponseDays}
            onChange={(event) =>
              setExpectedResponseDays(event.target.value)
            }
            className="w-24 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500"
          />

          <span className="text-sm text-gray-500">
            days
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">
            {success}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleApply}
        disabled={loading || Boolean(success)}
        className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : success
            ? "Application Submitted"
            : "Apply Now"}
      </button>
    </div>
  );
}

export default ApplyJobForm;