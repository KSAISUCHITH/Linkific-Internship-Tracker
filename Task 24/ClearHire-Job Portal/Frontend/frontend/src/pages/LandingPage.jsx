import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function LandingPage() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-white text-zinc-950">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-180px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-zinc-100/70 blur-3xl" />
      </div>


      {/* ================= NAVBAR ================= */}

      <header className="px-5 pt-5 sm:px-8 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-zinc-200/80 bg-white/90 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:px-5">

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
                  onClick={logout}
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


      {/* ================= HERO ================= */}

      <section className="relative px-6 pb-28 pt-24 sm:px-8 sm:pt-32 lg:px-10 lg:pb-36 lg:pt-40">

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">


          {/* Hero Content */}

          <div className="max-w-2xl">

            <p className="mb-7 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              A clearer hiring journey
            </p>


            <h1 className="text-6xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-7xl lg:text-[6.5rem]">

              Find work.

              <br />

              Know where
              <br />

              you stand.

            </h1>


            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-500">
              ClearHire helps you discover relevant opportunities,
              manage applications, and understand what happens
              after you apply.
            </p>


            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">

              <Link
                to={isAuthenticated ? "/" : "/register"}
                className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                {isAuthenticated
                  ? "Explore opportunities"
                  : "Create your account"}

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>


              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
                >
                  Already have an account
                  <span className="ml-2">→</span>
                </Link>
              )}

            </div>

          </div>


          {/* ================= APPLICATION PREVIEW ================= */}

          <div className="relative">

            <div className="absolute -inset-10 -z-10 rounded-[4rem] bg-zinc-100/80 blur-3xl" />


            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_40px_100px_rgba(0,0,0,0.10)] sm:p-9">


              {/* Application Header */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Application
                  </p>

                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    Product Engineer
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Acme Technologies
                  </p>

                </div>


                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
                  Under review
                </span>

              </div>


              <div className="my-8 h-px bg-zinc-100" />


              {/* Timeline */}

              <div className="space-y-7">


                {/* Submitted */}

                <div className="flex gap-4">

                  <div className="flex flex-col items-center">

                    <span className="h-3 w-3 rounded-full bg-zinc-950" />

                    <span className="mt-2 h-10 w-px bg-zinc-200" />

                  </div>


                  <div className="-mt-1">

                    <p className="text-sm font-medium">
                      Application submitted
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      September 18
                    </p>

                  </div>

                </div>


                {/* Viewed */}

                <div className="flex gap-4">

                  <div className="flex flex-col items-center">

                    <span className="h-3 w-3 rounded-full bg-zinc-950" />

                    <span className="mt-2 h-10 w-px bg-zinc-200" />

                  </div>


                  <div className="-mt-1">

                    <p className="text-sm font-medium">
                      Application viewed
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      September 19
                    </p>

                  </div>

                </div>


                {/* Under Review */}

                <div className="flex gap-4">

                  <div className="flex flex-col items-center">

                    <span className="h-3 w-3 rounded-full bg-zinc-950 ring-4 ring-zinc-100" />

                    <span className="mt-2 h-10 w-px bg-zinc-200" />

                  </div>


                  <div className="-mt-1">

                    <p className="text-sm font-medium">
                      Under review
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      Current stage
                    </p>

                  </div>

                </div>


                {/* Next Decision */}

                <div className="flex gap-4">

                  <div className="flex items-start justify-center">

                    <span className="h-3 w-3 rounded-full border-2 border-zinc-300" />

                  </div>


                  <div className="-mt-1">

                    <p className="text-sm font-medium text-zinc-400">
                      Next decision
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      Pending
                    </p>

                  </div>

                </div>

              </div>


              {/* Response Window */}

              <div className="mt-8 rounded-2xl bg-zinc-50 p-4">

                <div className="flex items-center gap-3">

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm shadow-sm">
                    ✓
                  </span>


                  <div>

                    <p className="text-xs font-medium text-zinc-800">
                      Response window
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Expected response by September 27
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= TRANSPARENCY ================= */}

      <section
        id="transparency"
        className="border-t border-zinc-100 bg-zinc-50 px-6 py-28 sm:px-8 lg:px-10"
      >

        <div className="mx-auto max-w-7xl">


          <div className="max-w-3xl">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              Beyond job listings
            </p>


            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">

              Your application shouldn't

              <br />

              disappear into a black box.

            </h2>


            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-500">
              ClearHire is designed around the part of the
              hiring journey that usually becomes unclear
              after you click Apply.
            </p>

          </div>


          <div className="mt-20 grid gap-px overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-200 md:grid-cols-3">


            {/* Card 1 */}

            <article className="group bg-white p-8 transition duration-300 hover:bg-zinc-50 sm:p-10">

              <span className="text-sm font-medium text-zinc-400">
                01
              </span>


              <h3 className="mt-20 text-xl font-semibold tracking-tight">
                Track applications
              </h3>


              <p className="mt-4 text-sm leading-7 text-zinc-500">
                Keep your applications, companies and current
                status organized in one place.
              </p>


              <div className="mt-8 h-px w-0 bg-zinc-950 transition-all duration-500 group-hover:w-full" />

            </article>


            {/* Card 2 */}

            <article className="group bg-white p-8 transition duration-300 hover:bg-zinc-50 sm:p-10">

              <span className="text-sm font-medium text-zinc-400">
                02
              </span>


              <h3 className="mt-20 text-xl font-semibold tracking-tight">
                Follow progress
              </h3>


              <p className="mt-4 text-sm leading-7 text-zinc-500">
                See the stages of an application from submission
                through interviews and decisions.
              </p>


              <div className="mt-8 h-px w-0 bg-zinc-950 transition-all duration-500 group-hover:w-full" />

            </article>


            {/* Card 3 */}

            <article className="group bg-white p-8 transition duration-300 hover:bg-zinc-50 sm:p-10">

              <span className="text-sm font-medium text-zinc-400">
                03
              </span>


              <h3 className="mt-20 text-xl font-semibold tracking-tight">
                Understand timing
              </h3>


              <p className="mt-4 text-sm leading-7 text-zinc-500">
                See expected response periods and identify when
                an application has gone beyond them.
              </p>


              <div className="mt-8 h-px w-0 bg-zinc-950 transition-all duration-500 group-hover:w-full" />

            </article>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="px-6 py-28 sm:px-8 lg:px-10"
      >

        <div className="mx-auto max-w-7xl">


          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                How it works
              </p>


              <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">

                From discovery

                <br />

                to decision.

              </h2>

            </div>


            <p className="max-w-md text-base leading-7 text-zinc-500">
              One place to manage the journey instead of
              switching between job boards, spreadsheets
              and scattered updates.
            </p>

          </div>


          <div className="mt-20 divide-y divide-zinc-200 border-y border-zinc-200">


            {/* Step 1 */}

            <div className="group grid gap-4 py-9 transition sm:grid-cols-[100px_1fr_1fr] sm:items-center">

              <span className="text-sm font-medium text-zinc-400">
                01
              </span>


              <h3 className="text-xl font-semibold tracking-tight transition group-hover:translate-x-1">
                Discover
              </h3>


              <p className="max-w-md text-sm leading-7 text-zinc-500">
                Find opportunities that match your skills
                and career goals.
              </p>

            </div>


            {/* Step 2 */}

            <div className="group grid gap-4 py-9 transition sm:grid-cols-[100px_1fr_1fr] sm:items-center">

              <span className="text-sm font-medium text-zinc-400">
                02
              </span>


              <h3 className="text-xl font-semibold tracking-tight transition group-hover:translate-x-1">
                Apply
              </h3>


              <p className="max-w-md text-sm leading-7 text-zinc-500">
                Submit applications and keep every opportunity
                organized.
              </p>

            </div>


            {/* Step 3 */}

            <div className="group grid gap-4 py-9 transition sm:grid-cols-[100px_1fr_1fr] sm:items-center">

              <span className="text-sm font-medium text-zinc-400">
                03
              </span>


              <h3 className="text-xl font-semibold tracking-tight transition group-hover:translate-x-1">
                Follow
              </h3>


              <p className="max-w-md text-sm leading-7 text-zinc-500">
                Understand the current stage and expected
                next step.
              </p>

            </div>


            {/* Step 4 */}

            <div className="group grid gap-4 py-9 transition sm:grid-cols-[100px_1fr_1fr] sm:items-center">

              <span className="text-sm font-medium text-zinc-400">
                04
              </span>


              <h3 className="text-xl font-semibold tracking-tight transition group-hover:translate-x-1">
                Decide
              </h3>


              <p className="max-w-md text-sm leading-7 text-zinc-500">
                Keep a clear record of outcomes and your
                hiring journey.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="px-6 pb-28 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-zinc-950 px-8 py-20 text-center sm:px-12 lg:py-28">

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Start with clarity
          </p>


          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">

            Make your next application

            <br />

            easier to follow.

          </h2>


          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400">
            Create your ClearHire account and bring your
            application journey into one place.
          </p>


          {!isAuthenticated && (
            <Link
              to="/register"
              className="mt-9 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-medium text-zinc-950 transition duration-300 hover:-translate-y-1 hover:bg-zinc-100"
            >
              Get started →
            </Link>
          )}

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-zinc-100 px-6 py-8 sm:px-8 lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-xs font-semibold text-white">
              C
            </span>

            <span className="font-semibold tracking-tight">
              ClearHire
            </span>

          </div>


          <span className="text-zinc-400">
            A clearer approach to the hiring journey.
          </span>

        </div>

      </footer>

    </main>
  );
}


export default LandingPage;