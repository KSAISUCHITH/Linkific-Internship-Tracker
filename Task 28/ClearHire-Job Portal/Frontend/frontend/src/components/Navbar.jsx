import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${
    isActive
      ? "bg-white text-zinc-950 shadow-sm"
      : "text-zinc-500 hover:bg-white hover:text-zinc-950"
  }`;


export default function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);


  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };


  const closeMenu = () => {
    setMenuOpen(false);
  };


  return (
    <header className="sticky top-4 z-50 mx-auto mt-5 w-[calc(100%-2rem)] max-w-7xl rounded-3xl border border-zinc-200/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">

      <nav className="px-4 py-3 sm:px-5">

        <div className="flex min-h-[58px] items-center justify-between">

          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white transition group-hover:scale-105">
              C
            </span>

            <div className="leading-none">

              <span className="text-[17px] font-semibold tracking-[-0.04em]">
                ClearHire
              </span>

              <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-400 sm:block">
                Hiring, clarified
              </span>

            </div>

          </Link>


          <div className="hidden items-center gap-1 rounded-full bg-zinc-100/70 p-1 md:flex">

            <NavLink
              to="/jobs"
              className={navLinkClass}
            >
              Jobs
            </NavLink>

            {!isAuthenticated && (
              <>
                <a
                  href="/#how-it-works"
                  className={navLinkClass}
                >
                  How it works
                </a>

                <a
                  href="/#transparency"
                  className={navLinkClass}
                >
                  Transparency
                </a>
              </>
            )}

            {isAuthenticated &&
              user?.role === "candidate" && (
                <>
                  <NavLink
                    to="/dashboard"
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/applications"
                    className={navLinkClass}
                  >
                    Applications
                  </NavLink>

                  <NavLink
                    to="/interviews"
                    className={navLinkClass}
                  >
                    Interviews
                  </NavLink>

                  <NavLink
                    to="/notifications"
                    className={navLinkClass}
                  >
                    Notifications
                  </NavLink>
                </>
              )}

            {isAuthenticated &&
              user?.role === "recruiter" && (
                <>
                  <NavLink
                    to="/recruiter/dashboard"
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/recruiter/jobs"
                    className={navLinkClass}
                  >
                    My Jobs
                  </NavLink>

                  <NavLink
                    to="/recruiter/company"
                    className={navLinkClass}
                  >
                    Company
                  </NavLink>
                </>
              )}

          </div>


          <div className="hidden items-center gap-2 md:flex">

            {isAuthenticated ? (
              <>
                <span className="px-3 text-sm text-zinc-500">
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
                  className="rounded-full px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Get started
                </Link>
              </>
            )}

          </div>


          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

        </div>


        {menuOpen && (
          <div className="border-t border-zinc-100 py-4 md:hidden">

            <div className="flex flex-col gap-1">

              <NavLink
                to="/jobs"
                onClick={closeMenu}
                className={navLinkClass}
              >
                Jobs
              </NavLink>

              {!isAuthenticated && (
                <>
                  <a
                    href="/#how-it-works"
                    onClick={closeMenu}
                    className={navLinkClass}
                  >
                    How it works
                  </a>

                  <a
                    href="/#transparency"
                    onClick={closeMenu}
                    className={navLinkClass}
                  >
                    Transparency
                  </a>
                </>
              )}

              {isAuthenticated &&
                user?.role === "candidate" && (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/applications"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Applications
                    </NavLink>

                    <NavLink
                      to="/interviews"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Interviews
                    </NavLink>

                    <NavLink
                      to="/notifications"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Notifications
                    </NavLink>
                  </>
                )}

              {isAuthenticated &&
                user?.role === "recruiter" && (
                  <>
                    <NavLink
                      to="/recruiter/dashboard"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/recruiter/jobs"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      My Jobs
                    </NavLink>

                    <NavLink
                      to="/recruiter/company"
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      Company
                    </NavLink>
                  </>
                )}

            </div>


            <div className="mt-4 border-t border-zinc-100 pt-4">

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white"
                >
                  Log out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-zinc-200 px-4 py-3 text-center text-sm font-medium text-zinc-700"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-medium text-white"
                  >
                    Get started
                  </Link>

                </div>
              )}

            </div>

          </div>
        )}

      </nav>

    </header>
  );
}