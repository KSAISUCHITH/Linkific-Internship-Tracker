import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../components/jobs/JobCard";
import { getJobs } from "../services/jobs";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setError(
          err.response?.data?.detail ||
            "Unable to load jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

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

          <Link
            to="/dashboard"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-gray-500">
            Opportunities
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Find your next opportunity.
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            Explore available jobs and keep your application journey organized
            with ClearHire.
          </p>
        </div>

        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <p className="text-sm text-gray-500">
              Loading available jobs...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No jobs available
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              New opportunities will appear here when recruiters publish jobs.
            </p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default JobsPage;