import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getApiError } from "../utils/errors";


function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "candidate",
    });

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const passwordRules = {
    length:
      formData.password.length >= 8,

    uppercase:
      /[A-Z]/.test(
        formData.password
      ),

    lowercase:
      /[a-z]/.test(
        formData.password
      ),

    number:
      /\d/.test(
        formData.password
      ),

    special:
      /[!@#$%^&*(),.?":{}|<>\-_[\]/+=;'`~]/.test(
        formData.password
      ),
  };


  const passwordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");


    if (
      formData.name.trim().length < 2
    ) {
      setError(
        "Name must contain at least 2 characters."
      );

      return;
    }


    if (!passwordValid) {
      setError(
        "Please satisfy all password requirements."
      );

      return;
    }


    if (
      formData.password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    try {
      setLoading(true);

      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      navigate(
        formData.role === "recruiter"
          ? "/recruiter/dashboard"
          : "/dashboard"
      );

    } catch (err) {
      console.error(
        "Registration failed:",
        err
      );

      setError(
        getApiError(
          err,
          "Unable to create your account."
        )
      );
    } finally {
      setLoading(false);
    }
  };


  const Rule = ({
    valid,
    children,
  }) => (
    <li
      className={`flex items-center gap-2 text-xs ${
        valid
          ? "text-green-600"
          : "text-zinc-400"
      }`}
    >

      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
          valid
            ? "bg-green-100"
            : "bg-zinc-100"
        }`}
      >
        {valid ? "✓" : ""}
      </span>

      {children}

    </li>
  );


  return (
    <div className="min-h-screen bg-zinc-50">

      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">

        <div className="w-full">

          <div className="mb-8 text-center">

            <Link
              to="/"
              className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950"
            >
              ClearHire
            </Link>

            <p className="mt-3 text-sm text-zinc-500">
              Create your account and
              start your journey.
            </p>

          </div>


          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Create account
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Join ClearHire as a candidate
              or recruiter.
            </p>


            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">

                <p className="text-sm leading-6 text-red-700">
                  {error}
                </p>

              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="K Sai Suchith"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
                />

              </div>


              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
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
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
                />

                <p className="mt-2 text-xs text-zinc-400">
                  Your email is used as your
                  ClearHire login.
                </p>

              </div>


              <div>

                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Account type
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
                >
                  <option value="candidate">
                    Candidate
                  </option>

                  <option value="recruiter">
                    Recruiter
                  </option>
                </select>

              </div>


              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
                />


                <div className="mt-4 rounded-2xl bg-zinc-50 p-4">

                  <p className="mb-3 text-xs font-medium text-zinc-600">
                    Password requirements
                  </p>

                  <ul className="grid gap-2 sm:grid-cols-2">

                    <Rule
                      valid={
                        passwordRules.length
                      }
                    >
                      At least 8 characters
                    </Rule>

                    <Rule
                      valid={
                        passwordRules.uppercase
                      }
                    >
                      One uppercase letter
                    </Rule>

                    <Rule
                      valid={
                        passwordRules.lowercase
                      }
                    >
                      One lowercase letter
                    </Rule>

                    <Rule
                      valid={
                        passwordRules.number
                      }
                    >
                      One number
                    </Rule>

                    <Rule
                      valid={
                        passwordRules.special
                      }
                    >
                      One special character
                    </Rule>

                  </ul>

                </div>

              </div>


              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(
                      event.target.value
                    );
                    setError("");
                  }}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white"
                />

                {confirmPassword && (
                  <p
                    className={`mt-2 text-xs ${
                      formData.password ===
                      confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {formData.password ===
                    confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-zinc-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>


            <div className="mt-6 text-center">

              <p className="text-sm text-zinc-500">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-medium text-zinc-950 hover:underline"
                >
                  Log in
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


export default RegisterPage;