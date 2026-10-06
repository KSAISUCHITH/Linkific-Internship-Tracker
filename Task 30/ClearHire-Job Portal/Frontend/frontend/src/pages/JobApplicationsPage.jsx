import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJob } from "../services/jobs";
import {
  getJobApplications,
  updateApplication,
} from "../services/applications";
import ScheduleInterviewForm from "../components/interviews/ScheduleInterviewForm";

const STATUS_OPTIONS = [
  "applied",
  "under_review",
  "shortlisted",
  "interview",
  "rejected",
  "offer",
];

const STATUS_STYLES = {
  applied: "bg-blue-50 text-blue-700",
  under_review: "bg-yellow-50 text-yellow-700",
  shortlisted: "bg-green-50 text-green-700",
  interview: "bg-purple-50 text-purple-700",
  rejected: "bg-red-50 text-red-700",
  offer: "bg-emerald-50 text-emerald-700",
};

function JobApplicationsPage() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobData, applicationsData] = await Promise.all([
          getJob(jobId),
          getJobApplications(jobId),
        ]);

        setJob(jobData);
        setApplications(applicationsData);
      } catch (err) {
        console.error(
          "Failed to load job applications:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Unable to load this job or its applications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      setUpdateError("");

      const updatedApplication = await updateApplication(
        applicationId,
        {
          status: newStatus,
        }
      );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? updatedApplication
            : application
        )
      );
    } catch (err) {
      console.error(
        "Failed to update application:",
        err
      );

      setUpdateError(
        err.response?.data?.detail ||
          "Unable to update the application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading applications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <Link
            to="/recruiter/jobs"
            className="mt-5 inline-block rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-gray-900"
          >
            ClearHire
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/recruiter/dashboard"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Dashboard
            </Link>

            <Link
              to="/recruiter/jobs"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              My Jobs
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <Link
            to="/recruiter/jobs"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to My Jobs
          </Link>

          <div className="mt-5">
            <p className="text-sm font-medium text-gray-500">
              Applications
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
              {job?.title}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Review candidates and keep application statuses up to date.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Total Applications
            </p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {applications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Under Review
            </p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "under_review"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Interviews
            </p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {
                applications.filter(
                  (application) =>
                    application.status === "interview"
                ).length
              }
            </p>
          </div>
        </div>

        {updateError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {updateError}
            </p>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Candidates who apply for this position will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => {
              const statusClass =
                STATUS_STYLES[application.status] ||
                "bg-gray-100 text-gray-700";

              return (
                <article
                  key={application.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Application #{application.id}
                      </p>

                      <h2 className="mt-2 text-xl font-semibold text-gray-900">
                        Candidate #{application.candidate_id}
                      </h2>

                      <div className="mt-3 space-y-1 text-sm text-gray-500">
                        <p>
                          Applied on{" "}
                          {formatDate(application.applied_at)}
                        </p>

                        <p>
                          Expected response:{" "}
                          {application.expected_response_days
                            ? `${application.expected_response_days} days`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-64">
                      <label
                        htmlFor={`status-${application.id}`}
                        className="block text-xs font-medium uppercase tracking-wide text-gray-400"
                      >
                        Application Status
                      </label>

                      <select
                        id={`status-${application.id}`}
                        value={application.status}
                        disabled={
                          updatingId === application.id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            application.id,
                            event.target.value
                          )
                        }
                        className={`mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-gray-400 ${statusClass}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>

                      {updatingId === application.id && (
                        <p className="mt-2 text-xs text-gray-400">
                          Updating status...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Candidate ID
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        #{application.candidate_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Job ID
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        #{application.job_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Current Status
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass}`}
                      >
                        {application.status?.replace(
                          "_",
                          " "
                        )}
                      </span>
                    </div>
                  </div>

                  <ScheduleInterviewForm
                    applicationId={application.id}
                  />
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default JobApplicationsPage;