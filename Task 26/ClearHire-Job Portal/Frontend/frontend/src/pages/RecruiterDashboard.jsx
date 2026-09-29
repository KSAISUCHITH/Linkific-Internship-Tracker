import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyJobs } from "../services/jobs";
import { getCompanies } from "../services/companies";

function RecruiterDashboard() {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobsData, companiesData] = await Promise.all([
          getMyJobs(),
          getCompanies(),
        ]);

        setJobs(jobsData);

        const currentCompany = companiesData.find(
          (item) => item.user_id === user?.id
        );

        setCompany(currentCompany || null);
      } catch (err) {
        console.error("Failed to load recruiter dashboard:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load your recruiter dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadDashboard();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading your dashboard...
        </p>
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
            <span className="hidden text-sm text-gray-500 sm:block">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        <section className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Recruiter Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
            Welcome back, {user?.name || "Recruiter"}.
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            Manage your company profile, job openings, and incoming
            applications from one place.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Published Jobs
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {jobs.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Company
            </p>

            <p className="mt-3 truncate text-xl font-semibold text-gray-900">
              {company?.name || "Not configured"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Account
            </p>

            <p className="mt-3 text-xl font-semibold capitalize text-gray-900">
              {user?.role || "Recruiter"}
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Jobs
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage the opportunities published by your company.
                </p>
              </div>

              <Link
                to="/recruiter/jobs"
                className="text-sm font-medium text-gray-900 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <Link
                  key={job.id}
                  to={`/recruiter/jobs/${job.id}/applications`}
                  className="block rounded-xl border border-gray-100 p-4 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {job.location || "Location not specified"}
                      </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {job.employment_type}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-400">
                    Job #{job.id}
                  </p>
                </Link>
              ))}

              {jobs.length === 0 && (
                <div className="rounded-xl bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    You haven't published any jobs yet.
                  </p>

                  <Link
                    to="/recruiter/jobs/create"
                    className="mt-4 inline-block text-sm font-medium text-gray-900 hover:underline"
                  >
                    Create your first job
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Company Profile
              </h2>

              {company ? (
                <>
                  <p className="mt-4 text-base font-medium text-gray-900">
                    {company.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {company.industry || "Industry not specified"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {company.location || "Location not specified"}
                  </p>

                  <Link
                    to="/recruiter/company"
                    className="mt-5 block text-sm font-medium text-gray-900 hover:underline"
                  >
                    Manage company profile →
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Set up your company profile before publishing jobs.
                  </p>

                  <Link
                    to="/recruiter/company"
                    className="mt-5 block rounded-xl bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-700"
                  >
                    Create Company Profile
                  </Link>
                </>
              )}
            </div>

            <div className="rounded-2xl bg-gray-900 p-6 text-white">
              <h2 className="font-semibold">
                Publish a New Job
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                Create a clear job listing and start receiving applications.
              </p>

              <Link
                to="/recruiter/jobs/create"
                className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-gray-900 transition hover:bg-gray-100"
              >
                Create Job
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;