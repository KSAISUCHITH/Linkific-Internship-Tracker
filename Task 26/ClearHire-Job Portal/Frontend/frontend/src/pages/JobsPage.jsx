import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import JobCard from "../components/jobs/JobCard";
import { getJobs } from "../services/jobs";
import { getApiError } from "../utils/errors";


function JobsPage() {
  const [jobs, setJobs] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    employment_type: "",
    experience_level: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs();
    }, 300);

    return () =>
      clearTimeout(timer);
  }, [
    filters.search,
    filters.location,
    filters.employment_type,
    filters.experience_level,
  ]);


  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs(
        filters
      );

      setJobs(data);
    } catch (err) {
      console.error(
        "Failed to load jobs:",
        err
      );

      setError(
        getApiError(
          err,
          "Unable to load jobs. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };


  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      employment_type: "",
      experience_level: "",
    });
  };


  const hasFilters =
    Object.values(filters).some(
      Boolean
    );


  return (
    <div className="min-h-screen bg-zinc-50">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <section className="max-w-3xl">

          <p className="text-sm font-medium text-zinc-500">
            Opportunities
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl">
            Find your next opportunity.
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-500">
            Search jobs, compare opportunities,
            and keep your application journey
            organized with ClearHire.
          </p>

        </section>


        <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">

            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-400"
              >
                Search
              </label>

              <input
                id="search"
                name="search"
                type="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Job title, skill, keyword..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
              />
            </div>


            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-400"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Bengaluru, Remote..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
              />
            </div>


            <div>
              <label
                htmlFor="employment_type"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-400"
              >
                Employment
              </label>

              <select
                id="employment_type"
                name="employment_type"
                value={filters.employment_type}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
              >
                <option value="">
                  All types
                </option>
                <option value="Full-time">
                  Full-time
                </option>
                <option value="Part-time">
                  Part-time
                </option>
                <option value="Contract">
                  Contract
                </option>
                <option value="Internship">
                  Internship
                </option>
                <option value="Freelance">
                  Freelance
                </option>
              </select>
            </div>


            <div>
              <label
                htmlFor="experience_level"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-400"
              >
                Experience
              </label>

              <select
                id="experience_level"
                name="experience_level"
                value={filters.experience_level}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
              >
                <option value="">
                  All levels
                </option>
                <option value="Entry-level">
                  Entry-level
                </option>
                <option value="Mid-level">
                  Mid-level
                </option>
                <option value="Senior-level">
                  Senior-level
                </option>
                <option value="Lead">
                  Lead
                </option>
              </select>
            </div>

          </div>


          {hasFilters && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
              >
                Clear filters
              </button>
            </div>
          )}

        </section>


        <section className="mt-8">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-zinc-500">
              {loading
                ? "Searching opportunities..."
                : `${jobs.length} ${
                    jobs.length === 1
                      ? "job"
                      : "jobs"
                  } found`}
            </p>

            <Link
              to="/"
              className="text-sm font-medium text-zinc-900 hover:underline"
            >
              Back to ClearHire
            </Link>

          </div>


          {loading && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-3xl border border-zinc-200 bg-white"
                />
              ))}
            </div>
          )}


          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadJobs}
                className="mt-4 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Try Again
              </button>

            </div>
          )}


          {!loading &&
            !error &&
            jobs.length === 0 && (
              <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-lg">
                  ?
                </div>

                <h2 className="mt-5 text-lg font-semibold text-zinc-950">
                  No matching jobs
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Try changing your search
                  or removing one of the
                  filters.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Clear filters
                  </button>
                )}

              </div>
            )}


          {!loading &&
            !error &&
            jobs.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                  />
                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}


export default JobsPage;