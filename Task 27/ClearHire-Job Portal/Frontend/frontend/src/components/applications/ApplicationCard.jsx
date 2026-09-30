function ApplicationCard({ application }) {
  const statusStyles = {
    applied: "bg-blue-50 text-blue-700",
    under_review: "bg-yellow-50 text-yellow-700",
    shortlisted: "bg-green-50 text-green-700",
    interview: "bg-purple-50 text-purple-700",
    rejected: "bg-red-50 text-red-700",
    offer: "bg-emerald-50 text-emerald-700",
  };

  const statusClass =
    statusStyles[application.status?.toLowerCase()] ||
    "bg-gray-100 text-gray-700";

  const formattedDate = application.applied_at
    ? new Date(application.applied_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Application #{application.id}
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Job #{application.job_id}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Applied on {formattedDate}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium capitalize ${statusClass}`}
        >
          {application.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-400">
            Expected response
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {application.expected_response_days
              ? `${application.expected_response_days} days`
              : "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400">
            Candidate
          </p>

          <p className="mt-1 text-sm text-gray-700">
            #{application.candidate_id}
          </p>
        </div>
      </div>
    </article>
  );
}

export default ApplicationCard;