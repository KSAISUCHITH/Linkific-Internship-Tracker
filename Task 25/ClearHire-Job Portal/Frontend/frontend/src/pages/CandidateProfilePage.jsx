import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createCandidateProfile,
  getCandidateProfiles,
  updateCandidateProfile,
} from "../services/candidates";

function CandidateProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    location: "",
    skills: "",
    resume_url: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profiles = await getCandidateProfiles();

        const currentProfile = profiles.find(
          (item) => item.user_id === user?.id
        );

        if (currentProfile) {
          setProfile(currentProfile);

          setFormData({
            headline: currentProfile.headline || "",
            bio: currentProfile.bio || "",
            location: currentProfile.location || "",
            skills: currentProfile.skills || "",
            resume_url: currentProfile.resume_url || "",
          });
        }
      } catch (err) {
        console.error("Failed to load candidate profile:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let savedProfile;

      if (profile) {
        savedProfile = await updateCandidateProfile(
          profile.id,
          formData
        );
      } else {
        savedProfile = await createCandidateProfile(formData);
      }

      setProfile(savedProfile);

      setFormData({
        headline: savedProfile.headline || "",
        bio: savedProfile.bio || "",
        location: savedProfile.location || "",
        skills: savedProfile.skills || "",
        resume_url: savedProfile.resume_url || "",
      });

      setSuccess(
        profile
          ? "Your profile has been updated successfully."
          : "Your profile has been created successfully."
      );
    } catch (err) {
      console.error("Failed to save candidate profile:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading your profile...
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

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Candidate Profile
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
            Your professional profile
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            Keep your professional information up to date so your
            applications contain the right context.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="border-b border-gray-100 pb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Account Information
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Name
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
                htmlFor="headline"
                className="block text-sm font-medium text-gray-700"
              >
                Professional Headline
              </label>

              <input
                id="headline"
                name="headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                maxLength={150}
                placeholder="e.g. Full Stack Developer | Python & React"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                About You
              </label>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={6}
                placeholder="Tell recruiters about your experience, interests, and career goals."
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
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. Bengaluru, India"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="resume_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Resume URL
                </label>

                <input
                  id="resume_url"
                  name="resume_url"
                  type="url"
                  value={formData.resume_url}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700"
              >
                Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Python, React, FastAPI, PostgreSQL"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
              />

              <p className="mt-2 text-xs text-gray-400">
                Separate multiple skills with commas.
              </p>
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
                to="/dashboard"
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
                  : profile
                    ? "Update Profile"
                    : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CandidateProfilePage;