import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJob } from "../services/jobs";
import ApplyJobForm from "../components/applications/ApplyJobForm";

function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJob(jobId);
        setJob(data);
      } catch (err) {
        console.error("Failed to load job:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load this job."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const formatSalary = () => {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading job details...
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

          <button
            onClick={() => navigate("/jobs")}
            className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-gray-900"
          >
            ClearHire
          </Link>

          <Link
            to="/jobs"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Jobs
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
          <div className="border-b border-gray-100 pb-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-3 text-sm font-medium text-gray-500">
                  Job Opportunity
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                  {job.title}
                </h1>

                <p className="mt-3 text-base text-gray-500">
                  {job.location || "Location not specified"}
                </p>
              </div>

              <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {job.employment_type}
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-400">
                  Salary
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatSalary()}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-400">
                  Experience
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {job.experience_level || "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-400">
                  Job ID
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  #{job.id}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 py-10 md:grid-cols-[1fr_280px]">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                About the role
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                {job.description}
              </p>

              {job.skills && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Skills
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.split(",").map((skill) => (
                      <span
                        key={skill.trim()}
                        className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <aside>
              <ApplyJobForm jobId={job.id} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobDetailsPage;