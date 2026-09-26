import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="mx-auto mt-5 w-[calc(100%-2rem)] max-w-7xl rounded-full border border-zinc-200/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <nav className="flex min-h-[76px] items-center justify-between px-4 py-3 sm:px-5">

        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white transition duration-300 group-hover:scale-105">
            C
          </span>

          <div className="leading-none">
            <span className="text-[17px] font-semibold tracking-[-0.04em]">
              ClearHire
            </span>

            <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-400">
              Hiring, clarified
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-1 rounded-full bg-zinc-100/70 p-1 md:flex">

          <Link
            to="/jobs"
            className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
          >
            Jobs
          </Link>

          {!isAuthenticated && (
            <>
              <a
                href="#how-it-works"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                How it works
              </a>

              <a
                href="#transparency"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                Transparency
              </a>
            </>
          )}

          {isAuthenticated && user?.role === "candidate" && (
            <>
              <Link
                to="/dashboard"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                Dashboard
              </Link>

              <Link
                to="/applications"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                Applications
              </Link>

              <Link
                to="/interviews"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                Interviews
              </Link>

              <Link
                to="/notifications"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                Notifications
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === "recruiter" && (
            <>
              <Link
                to="/recruiter/dashboard"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                Dashboard
              </Link>

              <Link
                to="/recruiter/jobs"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                My Jobs
              </Link>

              <Link
                to="/recruiter/company"
                className="rounded-full px-5 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                Company
              </Link>
            </>
          )}

        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {isAuthenticated ? (
            <>
              <span className="hidden px-3 text-sm text-zinc-500 sm:block">
                {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 sm:block"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg"
              >
                Get started
              </Link>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}