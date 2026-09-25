import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. You can now sign in.",
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to create your account. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-white text-zinc-950">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}
        <section className="relative hidden overflow-hidden bg-zinc-950 lg:flex">

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            <Link
              to="/"
              className="w-fit text-xl font-semibold tracking-[-0.03em] text-white"
            >
              ClearHire
            </Link>


            <div className="max-w-xl">

              <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Start with clarity
              </p>

              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-white xl:text-6xl">
                Your next
                <br />
                opportunity starts here.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-zinc-400">
                Build your profile, discover opportunities,
                and keep track of every step after you apply.
              </p>


              <div className="mt-12 space-y-5">

                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-950">
                    1
                  </span>

                  <div>
                    <p className="font-medium text-white">
                      Discover relevant opportunities
                    </p>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      Find jobs that align with your goals.
                    </p>
                  </div>
                </div>


                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-950">
                    2
                  </span>

                  <div>
                    <p className="font-medium text-white">
                      Keep applications organized
                    </p>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      Track every opportunity from one place.
                    </p>
                  </div>
                </div>


                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-950">
                    3
                  </span>

                  <div>
                    <p className="font-medium text-white">
                      Follow what happens next
                    </p>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      Understand your application's progress.
                    </p>
                  </div>
                </div>

              </div>

            </div>


            <p className="text-sm text-zinc-500">
              © 2026 ClearHire
            </p>

          </div>

        </section>


        {/* Right Side */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">

          <div className="w-full max-w-md">

            <div className="mb-8">

              <Link
                to="/"
                className="text-xl font-semibold tracking-[-0.03em] lg:hidden"
              >
                ClearHire
              </Link>

              <p className="mt-10 text-sm font-medium text-zinc-500">
                Create your account
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                Join ClearHire
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Set up your account and start managing your
                hiring journey.
              </p>

            </div>


            {error && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />

              </div>


              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />

              </div>


              {/* Role */}
              <div>

                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Account type
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                >
                  <option value="candidate">
                    I'm looking for a job
                  </option>

                  <option value="recruiter">
                    I'm hiring
                  </option>
                </select>

              </div>


              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />

              </div>


              {/* Confirm Password */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />

              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-zinc-950 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>


            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-950"
              >
                Sign in
              </Link>
            </p>


            <p className="mt-6 text-center text-xs leading-5 text-zinc-400">
              By creating an account, you agree to ClearHire's
              terms and privacy policy.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}


export default RegisterPage;