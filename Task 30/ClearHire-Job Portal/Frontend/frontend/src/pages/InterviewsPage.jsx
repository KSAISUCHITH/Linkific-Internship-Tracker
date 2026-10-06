import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../services/applications";
import { getApplicationInterviews } from "../services/interviews";

function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const applications = await getMyApplications();

        const interviewResults = await Promise.all(
          applications.map(async (application) => {
            try {
              const applicationInterviews =
                await getApplicationInterviews(application.id);

              return applicationInterviews.map((interview) => ({
                ...interview,
                application_id: application.id,
                job_id: application.job_id,
              }));
            } catch (err) {
              console.error(
                `Failed to load interviews for application ${application.id}:`,
                err
              );

              return [];
            }
          })
        );

        setInterviews(interviewResults.flat());
      } catch (err) {
        console.error("Failed to load interviews:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load your interviews."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

  const formatDateTime = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading your interviews...
        </p>
      </div>
    );
  }

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
              to="/dashboard"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Dashboard
            </Link>

            <Link
              to="/applications"
              className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
            >
              Applications
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
            Interviews
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            View your scheduled interviews and the information provided by
            recruiters.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {!error && interviews.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No interviews scheduled
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              When a recruiter schedules an interview for one of your
              applications, the details will appear here.
            </p>

            <Link
              to="/applications"
              className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              View Applications
            </Link>
          </div>
        )}

        {!error && interviews.length > 0 && (
          <div className="space-y-5">
            {interviews.map((interview) => (
              <article
                key={interview.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Interview #{interview.id}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-gray-900">
                      {interview.interview_type || "Interview"}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Application #{interview.application_id}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium capitalize text-purple-700">
                    {interview.status || "scheduled"}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Scheduled For
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDateTime(interview.scheduled_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Job
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      Job #{interview.job_id}
                    </p>
                  </div>
                </div>

                {interview.meeting_link && (
                  <div className="mt-5">
                    <a
                      href={interview.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                      Join Interview
                    </a>
                  </div>
                )}

                {interview.notes && (
                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Notes
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {interview.notes}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default InterviewsPage;