import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createJob } from "../services/jobs";

function CreateJobPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employment_type: "Full-time",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    skills: "",
    application_deadline: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location || null,
        employment_type: formData.employment_type,
        experience_level: formData.experience_level || null,
        salary_min:
          formData.salary_min === ""
            ? null
            : Number(formData.salary_min),
        salary_max:
          formData.salary_max === ""
            ? null
            : Number(formData.salary_max),
        skills: formData.skills || null,
        application_deadline:
          formData.application_deadline
            ? new Date(
                `${formData.application_deadline}T23:59:59`
              ).toISOString()
            : null,
      };

      if (
        jobData.salary_min !== null &&
        jobData.salary_max !== null &&
        jobData.salary_min > jobData.salary_max
      ) {
        setError(
          "Minimum salary cannot be greater than maximum salary."
        );
        return;
      }

      await createJob(jobData);

      navigate("/recruiter/jobs");
    } catch (err) {
      console.error("Failed to create job:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to create the job. Please check your details and try again."
      );
    } finally {
      setSaving(false);
    }
  };

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
              to="/recruiter/dashboard"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Dashboard
            </Link>

            <Link
              to="/recruiter/jobs"
              className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
            >
              My Jobs
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Recruiter Area
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
            Create a Job
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            Publish a clear and transparent opportunity for candidates
            searching on ClearHire.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                Job Information
              </h2>

              <div className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    minLength={2}
                    maxLength={150}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Python Backend Developer"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    required
                    minLength={10}
                    rows={8}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role, responsibilities, expectations, and what candidates can expect."
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      maxLength={100}
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bengaluru / Remote"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="employment_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Employment Type
                    </label>

                    <select
                      id="employment_type"
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experience_level"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Experience Level
                  </label>

                  <select
                    id="experience_level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                  >
                    <option value="">
                      Select experience level
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
            </section>

            <section className="border-t border-gray-100 pt-8">
              <h2 className="text-lg font-semibold text-gray-900">
                Compensation & Skills
              </h2>

              <div className="mt-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="salary_min"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Minimum Salary
                    </label>

                    <input
                      id="salary_min"
                      name="salary_min"
                      type="number"
                      min="0"
                      value={formData.salary_min}
                      onChange={handleChange}
                      placeholder="e.g. 500000"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="salary_max"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Maximum Salary
                    </label>

                    <input
                      id="salary_max"
                      name="salary_max"
                      type="number"
                      min="0"
                      value={formData.salary_max}
                      onChange={handleChange}
                      placeholder="e.g. 800000"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Required Skills
                  </label>

                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Python, FastAPI, PostgreSQL, Docker"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Separate multiple skills with commas.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-gray-100 pt-8">
              <h2 className="text-lg font-semibold text-gray-900">
                Application Timeline
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="application_deadline"
                  className="block text-sm font-medium text-gray-700"
                >
                  Application Deadline
                </label>

                <input
                  id="application_deadline"
                  name="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Leave this empty if the position does not have a fixed
                  application deadline.
                </p>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/recruiter/jobs"
                className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateJobPage;