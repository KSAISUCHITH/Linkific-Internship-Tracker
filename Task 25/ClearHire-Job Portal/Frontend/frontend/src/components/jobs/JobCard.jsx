import { Link } from "react-router-dom";

function JobCard({ job }) {
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

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            {job.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {job.location || "Location not specified"}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {job.employment_type}
        </span>
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600">
        {job.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {job.experience_level && (
          <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
            {job.experience_level}
          </span>
        )}

        <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
          {formatSalary()}
        </span>
      </div>

      {job.skills && (
        <p className="mb-5 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Skills:</span>{" "}
          {job.skills}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 pt-5">
        <span className="text-xs text-gray-400">
          Job #{job.id}
        </span>

        <Link
          to={`/jobs/${job.id}`}
          className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default JobCard;