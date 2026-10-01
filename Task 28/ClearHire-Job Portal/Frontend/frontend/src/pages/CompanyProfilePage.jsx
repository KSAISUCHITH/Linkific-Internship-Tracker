import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createCompany,
  getCompanies,
  updateCompany,
} from "../services/companies";

function CompanyProfilePage() {
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const companies = await getCompanies();

        const currentCompany = companies.find(
          (item) => item.user_id === user?.id
        );

        if (currentCompany) {
          setCompany(currentCompany);

          setFormData({
            name: currentCompany.name || "",
            description: currentCompany.description || "",
            website: currentCompany.website || "",
            location: currentCompany.location || "",
            industry: currentCompany.industry || "",
          });
        }
      } catch (err) {
        console.error("Failed to load company profile:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load your company profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadCompany();
    }
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let savedCompany;

      if (company) {
        savedCompany = await updateCompany(
          company.id,
          formData
        );
      } else {
        savedCompany = await createCompany(formData);
      }

      setCompany(savedCompany);

      setFormData({
        name: savedCompany.name || "",
        description: savedCompany.description || "",
        website: savedCompany.website || "",
        location: savedCompany.location || "",
        industry: savedCompany.industry || "",
      });

      setSuccess(
        company
          ? "Company profile updated successfully."
          : "Company profile created successfully."
      );
    } catch (err) {
      console.error("Failed to save company profile:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to save your company profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading company profile...
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
            Company Profile
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            Add the information candidates need to understand your
            organization and its opportunities.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="border-b border-gray-100 pb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recruiter Account
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Recruiter
                </p>

                <p className="mt-1 text-sm text-gray-800">
                  {user?.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <p className="mt-1 text-sm text-gray-800">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={150}
                placeholder="e.g. Acme Technologies"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Company Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your company, products, culture, and what your organization does."
                className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="https://example.com"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                />
              </div>

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
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. Bengaluru, India"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700"
              >
                Industry
              </label>

              <input
                id="industry"
                name="industry"
                type="text"
                value={formData.industry}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Software Technology"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-700">
                  {success}
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/recruiter/dashboard"
                className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : company
                    ? "Update Company"
                    : "Create Company"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CompanyProfilePage;