import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getCandidateProfiles } from "../services/candidates";
import { getJobs } from "../services/jobs";
import { getMyApplications } from "../services/applications";

function CandidateDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");

  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobsData, applicationsData] = await Promise.all([
          getJobs(),
          getMyApplications(),
        ]);

        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setApplications(
          Array.isArray(applicationsData) ? applicationsData : []
        );
      } catch (err) {
        console.error("Failed to load candidate dashboard:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load the dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setProfileLoading(false);
      return;
    }

    let active = true;

    const checkCandidateProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const profiles = await getCandidateProfiles();

        if (!active) return;

        const profileExists = Array.isArray(profiles)
          ? profiles.some(
              (profile) =>
                Number(profile.user_id) === Number(user.id)
            )
          : false;

        setHasProfile(profileExists);
      } catch (err) {
        if (!active) return;

        console.error("Failed to load candidate profile:", err);

        setProfileError(
          err.response?.data?.detail ||
            "We couldn't check your profile. Please try refreshing the page."
        );
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    };

    checkCandidateProfile();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "applied"
  ).length;

  const shortlistedCount = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "shortlisted"
  ).length;

  const interviewCount = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "interview"
  ).length;

  const recentJobs = jobs.slice(0, 5);
  const recentApplications = applications.slice(0, 5);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-40 rounded bg-zinc-200" />
            <div className="h-12 w-96 max-w-full rounded bg-zinc-200" />
            <div className="h-6 w-80 max-w-full rounded bg-zinc-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-3xl border border-zinc-200 bg-white"
                />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="h-80 rounded-3xl border border-zinc-200 bg-white" />
              <div className="h-80 rounded-3xl border border-zinc-200 bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white">
              C
            </span>

            <div className="leading-none">
              <span className="text-lg font-semibold tracking-tight">
                ClearHire
              </span>

              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                Hiring, clarified
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/jobs"
              className="hidden text-sm font-medium text-zinc-500 transition hover:text-zinc-950 sm:block"
            >
              Browse Jobs
            </Link>

            <Link
              to="/profile"
              className="hidden text-sm font-medium text-zinc-500 transition hover:text-zinc-950 sm:block"
            >
              Profile
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Welcome */}
        <section className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">
            Candidate Dashboard
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Welcome back, {user?.name}.
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-500">
            Keep track of your applications and discover new
            opportunities.
          </p>
        </section>

        {/* Profile onboarding */}
        {!profileLoading && !profileError && !hasProfile && (
          <section className="mb-10 flex flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Getting started
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Complete your profile
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                Welcome to ClearHire! Add your skills, location and
                resume to prepare your profile for job applications.
                You can update these details whenever you need to.
              </p>
            </div>

            <Link
              to="/profile"
              className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Complete profile
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        )}

        {/* Profile check error */}
        {!profileLoading && profileError && (
          <div
            role="alert"
            className="mb-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {profileError}
          </div>
        )}

        {/* Statistics */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-7">
            <p className="text-sm font-medium text-zinc-500">
              Applications
            </p>

            <p className="mt-5 text-4xl font-semibold tracking-tight">
              {totalApplications}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-7">
            <p className="text-sm font-medium text-zinc-500">
              Applied
            </p>

            <p className="mt-5 text-4xl font-semibold tracking-tight">
              {appliedCount}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-7">
            <p className="text-sm font-medium text-zinc-500">
              Shortlisted
            </p>

            <p className="mt-5 text-4xl font-semibold tracking-tight">
              {shortlistedCount}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-7">
            <p className="text-sm font-medium text-zinc-500">
              Interviews
            </p>

            <p className="mt-5 text-4xl font-semibold tracking-tight">
              {interviewCount}
            </p>
          </div>
        </section>

        {/* Main dashboard content */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          {/* Recent opportunities */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Recent Opportunities
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Explore the latest jobs available on ClearHire.
                </p>
              </div>

              <Link
                to="/jobs"
                className="shrink-0 text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
              >
                View all
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-zinc-500">
                    No jobs are currently available.
                  </p>

                  <Link
                    to="/jobs"
                    className="mt-4 inline-flex text-sm font-medium text-zinc-950 underline underline-offset-4"
                  >
                    Browse jobs
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 divide-y divide-zinc-100">
                {recentJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="group block py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="font-medium tracking-tight transition group-hover:text-zinc-600">
                          {job.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                          {job.location && (
                            <span>{job.location}</span>
                          )}

                          {job.employment_type && (
                            <span>{job.employment_type}</span>
                          )}

                          {job.experience_level && (
                            <span>{job.experience_level}</span>
                          )}
                        </div>
                      </div>

                      <span className="text-sm text-zinc-400 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Applications */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Your Applications
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Track your recent application activity.
              </p>
            </div>

            {recentApplications.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-zinc-500">
                    You haven't applied for any jobs yet.
                  </p>

                  <Link
                    to="/jobs"
                    className="mt-4 inline-flex text-sm font-medium text-zinc-950 underline underline-offset-4"
                  >
                    Find a job
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {recentApplications.map((application) => (
                  <Link
                    key={application.id}
                    to={`/applications`}
                    className="group block rounded-2xl border border-zinc-100 p-4 transition hover:border-zinc-200 hover:bg-zinc-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          Application #{application.id}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Job #{application.job_id}
                        </p>
                      </div>

                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-700">
                        {application.status || "Applied"}
                      </span>
                    </div>

                    {application.applied_at && (
                      <p className="mt-3 text-xs text-zinc-400">
                        Applied{" "}
                        {new Date(
                          application.applied_at
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {recentApplications.length > 0 && (
              <Link
                to="/applications"
                className="mt-7 inline-flex text-sm font-medium text-zinc-950 underline underline-offset-4"
              >
                View all applications →
              </Link>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Link
            to="/jobs"
            className="group rounded-3xl bg-zinc-950 p-7 text-white transition duration-300 hover:-translate-y-1"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Explore
            </p>

            <h2 className="mt-12 text-xl font-semibold tracking-tight">
              Browse jobs
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Discover new opportunities and find roles that match
              your goals.
            </p>

            <span className="mt-7 inline-block text-sm text-zinc-300 transition group-hover:translate-x-1">
              Explore opportunities →
            </span>
          </Link>

          <Link
            to="/profile"
            className="group rounded-3xl border border-zinc-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-zinc-300"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Profile
            </p>

            <h2 className="mt-12 text-xl font-semibold tracking-tight">
              {hasProfile ? "Update your profile" : "Complete your profile"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Keep your skills, location, bio and resume information
              up to date.
            </p>

            <span className="mt-7 inline-block text-sm font-medium text-zinc-700 transition group-hover:translate-x-1">
              Open profile →
            </span>
          </Link>

          <Link
            to="/applications"
            className="group rounded-3xl border border-zinc-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-zinc-300"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Tracking
            </p>

            <h2 className="mt-12 text-xl font-semibold tracking-tight">
              Application activity
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Follow your submitted applications and see their
              current status.
            </p>

            <span className="mt-7 inline-block text-sm font-medium text-zinc-700 transition group-hover:translate-x-1">
              View applications →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default CandidateDashboard;