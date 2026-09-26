import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteJob, getMyJobs } from "../services/jobs";

function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load recruiter jobs:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load your jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(jobId);
      setError("");

      await deleteJob(jobId);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== jobId)
      );
    } catch (err) {
      console.error("Failed to delete job:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete this job."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatSalary = (job) => {
    if (job.salary_min == null && job.salary_max == null) {
      return "Salary not specified";
    }

    if (job.salary_min != null && job.salary_max != null) {
      return `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`;
    }

    if (job.salary_min != null) {
      return `From ₹${job.salary_min.toLocaleString()}`;
    }

    return `Up to ₹${job.salary_max.toLocaleString()}`;
  };

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
              to="/recruiter/company"
              className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
            >
              Company
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Recruiter Area
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
              My Jobs
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Manage your published opportunities and review candidate
              applications.
            </p>
          </div>

          <Link
            to="/recruiter/jobs/create"
            className="w-fit rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Create Job
          </Link>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadJobs}
              className="shrink-0 text-sm font-medium text-red-800 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <p className="text-sm text-gray-500">
              Loading your jobs...
            </p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No jobs published yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Create your first job listing to start receiving applications
              from candidates.
            </p>

            <Link
              to="/recruiter/jobs/create"
              className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Create Your First Job
            </Link>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                        {job.title}
                      </h2>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {job.employment_type}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span>
                        {job.location || "Location not specified"}
                      </span>

                      <span>
                        {job.experience_level ||
                          "Experience not specified"}
                      </span>

                      <span>
                        {formatSalary(job)}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-600">
                      {job.description}
                    </p>

                    {job.skills && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills
                          .split(",")
                          .map((skill) => skill.trim())
                          .filter(Boolean)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    )}

                    <p className="mt-5 text-xs text-gray-400">
                      Job #{job.id}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                    <Link
                      to={`/recruiter/jobs/${job.id}/applications`}
                      className="rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                      View Applications
                    </Link>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View Public Listing
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === job.id
                        ? "Deleting..."
                        : "Delete Job"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default RecruiterJobsPage;