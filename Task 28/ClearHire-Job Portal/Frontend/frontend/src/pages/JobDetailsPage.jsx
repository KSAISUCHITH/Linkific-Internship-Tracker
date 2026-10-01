import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import ApplyJobForm from "../components/applications/ApplyJobForm";
import { getJob } from "../services/jobs";
import { getApiError } from "../utils/errors";
import {
  formatDate,
  formatSalary,
} from "../utils/formatters";


function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJob(
          jobId
        );

        setJob(data);
      } catch (err) {
        console.error(
          "Failed to load job:",
          err
        );

        setError(
          getApiError(
            err,
            "Unable to load this job."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);


  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">

        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />

            <p className="mt-4 text-sm text-zinc-500">
              Loading job details...
            </p>

          </div>

        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-16">

        <div className="mx-auto max-w-3xl">

          <Link
            to="/"
            className="text-xl font-semibold tracking-[-0.04em] text-zinc-950"
          >
            ClearHire
          </Link>

          <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-8">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/jobs")
              }
              className="mt-5 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Back to Jobs
            </button>

          </div>

        </div>

      </div>
    );
  }


  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-16">

        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-2xl font-semibold text-zinc-950">
            Job not found
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            This job may have been removed
            or is no longer available.
          </p>

          <Link
            to="/jobs"
            className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to Jobs
          </Link>

        </div>

      </div>
    );
  }


  const skills = job.skills
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];


  return (
    <div className="min-h-screen bg-zinc-50">

      <header className="border-b border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="text-xl font-semibold tracking-[-0.04em] text-zinc-950"
          >
            ClearHire
          </Link>

          <Link
            to="/jobs"
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Back to Jobs
          </Link>

        </div>

      </header>


      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-12">

        <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">

          <div className="border-b border-zinc-100 p-6 sm:p-8 md:p-10">

            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              <div className="min-w-0">

                <p className="mb-3 text-sm font-medium text-zinc-500">
                  Job Opportunity
                </p>

                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
                  {job.title}
                </h1>

                <p className="mt-3 text-base text-zinc-500">
                  {job.location ||
                    "Location not specified"}
                </p>

              </div>

              <span className="w-fit shrink-0 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
                {job.employment_type}
              </span>

            </div>


            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl bg-zinc-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Salary
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {formatSalary(
                    job.salary_min,
                    job.salary_max
                  )}
                </p>

              </div>


              <div className="rounded-2xl bg-zinc-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Experience
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {job.experience_level ||
                    "Not specified"}
                </p>

              </div>


              <div className="rounded-2xl bg-zinc-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Deadline
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {job.application_deadline
                    ? formatDate(
                        job.application_deadline
                      )
                    : "No deadline"}
                </p>

              </div>


              <div className="rounded-2xl bg-zinc-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Job ID
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900">
                  #{job.id}
                </p>

              </div>

            </div>

          </div>


          <div className="grid gap-10 p-6 sm:p-8 md:grid-cols-[1fr_300px] md:p-10">

            <section className="min-w-0">

              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                About the role
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-600">
                {job.description}
              </p>


              {skills.length > 0 && (
                <div className="mt-10">

                  <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                    Skills
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>
              )}


              <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">

                <h3 className="text-sm font-semibold text-zinc-900">
                  ClearHire transparency
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  After applying, you can track
                  your application status and view
                  updates as the recruitment process
                  progresses.
                </p>

              </div>

            </section>


            <aside className="md:sticky md:top-24 md:self-start">

              <ApplyJobForm
                jobId={job.id}
              />

            </aside>

          </div>

        </div>

      </main>

    </div>
  );
}


export default JobDetailsPage;