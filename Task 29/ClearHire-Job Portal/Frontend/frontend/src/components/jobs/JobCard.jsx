import { Link } from "react-router-dom";

import { formatSalary } from "../../utils/formatters";


function JobCard({ job }) {
  const skills = job.skills
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];


  return (
    <article className="group flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <h2 className="truncate text-xl font-semibold tracking-tight text-zinc-950">
            {job.title}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {job.location ||
              "Location not specified"}
          </p>

        </div>

        <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
          {job.employment_type}
        </span>

      </div>


      <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
        {job.description}
      </p>


      <div className="mt-5 flex flex-wrap gap-2">

        {job.experience_level && (
          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
            {job.experience_level}
          </span>
        )}

        <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
          {formatSalary(
            job.salary_min,
            job.salary_max
          )}
        </span>

      </div>


      {skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">

          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-500"
            >
              {skill}
            </span>
          ))}

        </div>
      )}


      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-5">

        <span className="text-xs text-zinc-400">
          Job #{job.id}
        </span>

        <Link
          to={`/jobs/${job.id}`}
          className="rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 group-hover:shadow-md"
        >
          View Details
        </Link>

      </div>

    </article>
  );
}


export default JobCard;