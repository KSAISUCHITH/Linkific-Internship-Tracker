import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [location]);


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
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(
        formData.email,
        formData.password
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to sign in. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-white text-zinc-950">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left panel */}
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
                The hiring journey, clarified.
              </p>

              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-white xl:text-6xl">
                Know where
                <br />
                you stand.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-zinc-400">
                Keep your applications organized and
                understand what happens after you apply.
              </p>


              <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">

                <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                  Your application
                </p>

                <div className="mt-5 flex items-center justify-between">

                  <div>
                    <h3 className="text-base font-medium text-white">
                      Product Engineer
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Acme Technologies
                    </p>
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-zinc-300">
                    Under review
                  </span>

                </div>


                <div className="mt-7 space-y-5">

                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />

                    <span className="text-sm text-zinc-300">
                      Application submitted
                    </span>
                  </div>

                  <div className="ml-1 h-5 w-px bg-zinc-700" />

                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />

                    <span className="text-sm text-zinc-300">
                      Application viewed
                    </span>
                  </div>

                  <div className="ml-1 h-5 w-px bg-zinc-700" />

                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white ring-4 ring-white/10" />

                    <span className="text-sm font-medium text-white">
                      Under review
                    </span>
                  </div>

                </div>

              </div>

            </div>


            <p className="text-sm text-zinc-500">
              © 2026 ClearHire
            </p>

          </div>

        </section>


        {/* Login panel */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">

          <div className="w-full max-w-md">

            <div className="mb-10">

              <Link
                to="/"
                className="text-xl font-semibold tracking-[-0.03em] lg:hidden"
              >
                ClearHire
              </Link>

              <p className="mt-10 text-sm font-medium text-zinc-500">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                Sign in to ClearHire
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Continue managing your applications and
                hiring journey.
              </p>

            </div>


            {success && (
              <div
                role="status"
                className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
              >
                {success}
              </div>
            )}


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
                  required
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />

              </div>


              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-800"
                  >
                    Password
                  </label>

                  <span className="text-xs text-zinc-400">
                    Password reset coming soon
                  </span>

                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-zinc-950 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>


            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-zinc-200" />

              <span className="text-xs text-zinc-400">
                OR
              </span>

              <div className="h-px flex-1 bg-zinc-200" />

            </div>


            <p className="text-center text-sm text-zinc-500">

              Don't have a ClearHire account?{" "}

              <Link
                to="/register"
                className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-950"
              >
                Create one
              </Link>

            </p>


            <p className="mt-8 text-center text-xs leading-5 text-zinc-400">
              By continuing, you agree to ClearHire's
              terms and privacy policy.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}


export default LoginPage;