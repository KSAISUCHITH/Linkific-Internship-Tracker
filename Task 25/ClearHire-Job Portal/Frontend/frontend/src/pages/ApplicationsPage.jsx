import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplicationCard from "../components/applications/ApplicationCard";
import { getMyApplications } from "../services/applications";

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-gray-900"
          >
            ClearHire
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/jobs"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Candidate Area
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
            My Applications
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            Keep track of the opportunities you've applied for and monitor
            their current status.
          </p>
        </div>

        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <p className="text-sm text-gray-500">
              Loading your applications...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Once you apply for a job, your applications and their current
              status will appear here.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {applications.length}{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}
              </p>
            </div>

            <div className="grid gap-5">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ApplicationsPage;