import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";


function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  const dashboardLink =
    user?.role === "recruiter"
      ? "/recruiter/dashboard"
      : "/dashboard";


  return (
    <div className="min-h-screen overflow-hidden bg-[#fbfbfa] text-zinc-950">

      <Navbar />


      {/* Hero */}

      <main>

        <section className="relative">

          {/* Subtle background atmosphere */}

          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

            <div className="absolute left-[8%] top-24 h-[500px] w-[500px] rounded-full bg-zinc-200/30 blur-[120px]" />

            <div className="absolute right-[5%] top-32 h-[450px] w-[450px] rounded-full bg-zinc-100/80 blur-[100px]" />

          </div>


          <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">

            <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">


              {/* LEFT — Hero content */}

              <div className="max-w-2xl">

                <div className="mb-8 flex items-center gap-3">

                  <span className="h-px w-8 bg-zinc-400" />

                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                    A clearer hiring journey
                  </span>

                </div>


                <h1 className="text-[4.25rem] font-semibold leading-[0.94] tracking-[-0.065em] text-zinc-950 sm:text-[5.5rem] lg:text-[6.25rem]">

                  Find work.

                  <br />

                  Know where

                  <br />

                  <span className="text-zinc-400">
                    you stand.
                  </span>

                </h1>


                <p className="mt-8 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg sm:leading-8">

                  ClearHire helps you discover relevant opportunities,
                  manage applications, and understand what happens
                  after you apply.

                </p>


                <div className="mt-9 flex flex-wrap items-center gap-4">

                  <Link
                    to="/jobs"
                    className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-[0_14px_35px_rgba(0,0,0,0.16)]"
                  >
                    Explore opportunities

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>

                  </Link>


                  {!isAuthenticated && (
                    <Link
                      to="/register"
                      className="inline-flex items-center rounded-full px-5 py-3.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
                    >
                      Create an account
                    </Link>
                  )}


                  {isAuthenticated && (
                    <Link
                      to={dashboardLink}
                      className="inline-flex items-center rounded-full px-5 py-3.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
                    >
                      Go to dashboard →
                    </Link>
                  )}

                </div>


                {/* Small trust detail */}

                <div className="mt-12 flex items-center gap-4">

                  <div className="flex -space-x-2">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fbfbfa] bg-zinc-200 text-[10px] font-medium text-zinc-600">
                      S
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fbfbfa] bg-zinc-300 text-[10px] font-medium text-zinc-700">
                      A
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fbfbfa] bg-zinc-400 text-[10px] font-medium text-white">
                      R
                    </span>

                  </div>

                  <div>

                    <p className="text-xs font-medium text-zinc-600">
                      Built for clearer applications
                    </p>

                    <p className="mt-0.5 text-[11px] text-zinc-400">
                      Track what happens after you apply.
                    </p>

                  </div>

                </div>

              </div>


              {/* RIGHT — Application transparency card */}

              <div className="relative">

                {/* Decorative background */}

                <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-zinc-100/80 via-transparent to-zinc-200/40 blur-2xl" />


                <div className="relative rounded-[2rem] border border-zinc-200/90 bg-white p-2 shadow-[0_35px_80px_rgba(0,0,0,0.08)]">

                  <div className="rounded-[1.55rem] border border-zinc-100 bg-white p-7 sm:p-9">


                    {/* Card header */}

                    <div className="flex items-start justify-between gap-5">

                      <div>

                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                          Application
                        </p>

                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-zinc-950 sm:text-2xl">
                          Product Engineer
                        </h2>

                        <p className="mt-1.5 text-sm text-zinc-500">
                          Acme Technologies
                        </p>

                      </div>


                      <span className="shrink-0 rounded-full bg-zinc-100 px-3.5 py-1.5 text-[11px] font-medium text-zinc-600">
                        Under review
                      </span>

                    </div>


                    <div className="my-8 h-px bg-zinc-100" />


                    {/* Timeline */}

                    <div className="relative">

                      {/* Vertical line */}

                      <div className="absolute left-[6px] top-3 bottom-3 w-px bg-zinc-200" />


                      <div className="space-y-7">


                        {/* Step 1 */}

                        <div className="relative flex gap-5">

                          <div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-white bg-zinc-950 shadow-sm" />

                          <div>

                            <p className="text-sm font-semibold text-zinc-900">
                              Application submitted
                            </p>

                            <p className="mt-1 text-xs text-zinc-400">
                              September 18
                            </p>

                          </div>

                        </div>


                        {/* Step 2 */}

                        <div className="relative flex gap-5">

                          <div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-white bg-zinc-950 shadow-sm" />

                          <div>

                            <p className="text-sm font-semibold text-zinc-900">
                              Application viewed
                            </p>

                            <p className="mt-1 text-xs text-zinc-400">
                              September 19
                            </p>

                          </div>

                        </div>


                        {/* Step 3 */}

                        <div className="relative flex gap-5">

                          <div className="relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-zinc-950 shadow-[0_0_0_4px_rgba(24,24,27,0.08)]" />

                          <div>

                            <div className="flex items-center gap-2">

                              <p className="text-sm font-semibold text-zinc-950">
                                Under review
                              </p>

                              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-zinc-500">
                                Current
                              </span>

                            </div>

                            <p className="mt-1 text-xs text-zinc-400">
                              Current stage
                            </p>

                          </div>

                        </div>


                        {/* Step 4 */}

                        <div className="relative flex gap-5">

                          <div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-zinc-300 bg-white" />

                          <div>

                            <p className="text-sm font-medium text-zinc-400">
                              Next decision
                            </p>

                            <p className="mt-1 text-xs text-zinc-400">
                              Pending
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* Response window */}

                    <div className="mt-8 flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm text-zinc-700 shadow-sm">
                        ✓
                      </div>

                      <div>

                        <p className="text-xs font-semibold text-zinc-800">
                          Response window
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-400">
                          Expected response by September 27
                        </p>

                      </div>

                    </div>


                    {/* Bottom metadata */}

                    <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">

                      <span className="text-[11px] text-zinc-400">
                        Updated 2 days ago
                      </span>

                      <span className="text-[11px] font-medium text-zinc-500">
                        Application #1042
                      </span>

                    </div>

                  </div>

                </div>


                {/* Floating detail */}

                <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.08)] sm:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs text-white">
                      ✓
                    </div>

                    <div>

                      <p className="text-[11px] font-semibold text-zinc-800">
                        Status tracked
                      </p>

                      <p className="text-[10px] text-zinc-400">
                        No guesswork required
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Minimal value strip */}

        <section className="border-y border-zinc-200 bg-white">

          <div className="mx-auto grid max-w-7xl divide-y divide-zinc-200 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">

            <div className="px-0 py-8 sm:px-8">

              <p className="text-sm font-semibold text-zinc-950">
                Discover
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                Find opportunities that fit.
              </p>

            </div>


            <div className="px-0 py-8 sm:px-8">

              <p className="text-sm font-semibold text-zinc-950">
                Apply
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                Keep every application organized.
              </p>

            </div>


            <div className="px-0 py-8 sm:px-8">

              <p className="text-sm font-semibold text-zinc-950">
                Understand
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                See what happens after applying.
              </p>

            </div>

          </div>

        </section>


        {/* Transparency */}

        <section
          id="transparency"
          className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
        >

          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-7 bg-zinc-400" />

                <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                  Transparency
                </span>

              </div>

              <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                The hiring journey
                <br />
                shouldn't disappear
                <br />
                after you apply.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-zinc-500">
                ClearHire brings application status,
                history, interviews, and notifications
                together so candidates have a clearer
                view of their recruitment journey.
              </p>

            </div>


            <div className="grid gap-3 sm:grid-cols-2">

              {[
                {
                  number: "01",
                  title: "Application tracking",
                  text: "Keep applications organized in one place.",
                },
                {
                  number: "02",
                  title: "Status history",
                  text: "Understand meaningful changes over time.",
                },
                {
                  number: "03",
                  title: "Interview visibility",
                  text: "Keep schedules and meeting details accessible.",
                },
                {
                  number: "04",
                  title: "Notifications",
                  text: "Stay aware of important recruitment updates.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/5"
                >

                  <span className="text-[11px] font-semibold tracking-[0.15em] text-zinc-400">
                    {item.number}
                  </span>

                  <h3 className="mt-8 text-base font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {item.text}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </section>


        {/* How it works */}

        <section
          id="how-it-works"
          className="border-y border-zinc-200 bg-white"
        >

          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

            <div className="max-w-2xl">

              <div className="flex items-center gap-3">

                <span className="h-px w-7 bg-zinc-400" />

                <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                  How it works
                </span>

              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Simple from search
                <br />
                to interview.
              </h2>

            </div>


            <div className="mt-14 grid overflow-hidden rounded-3xl border border-zinc-200 md:grid-cols-3">

              {[
                {
                  number: "01",
                  title: "Discover",
                  text: "Search and filter opportunities based on your needs.",
                },
                {
                  number: "02",
                  title: "Apply",
                  text: "Submit applications and keep your activity organized.",
                },
                {
                  number: "03",
                  title: "Stay informed",
                  text: "Track status updates, interviews, and notifications.",
                },
              ].map((item, index) => (
                <div
                  key={item.number}
                  className={`p-8 lg:p-10 ${
                    index !== 0
                      ? "border-t border-zinc-200 md:border-l md:border-t-0"
                      : ""
                  }`}
                >

                  <span className="text-xs font-semibold tracking-[0.15em] text-zinc-400">
                    {item.number}
                  </span>

                  <h3 className="mt-12 text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
                    {item.text}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </section>


        {/* CTA */}

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-16 sm:px-12 lg:px-20">

            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="relative max-w-2xl">

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                ClearHire
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                A clearer way to
                navigate hiring.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
                Find opportunities, manage your applications,
                and stay connected to what happens next.
              </p>

              <div className="mt-8">

                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
                >
                  Explore opportunities
                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}

      <footer className="border-t border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>

            <p className="text-sm font-semibold tracking-tight">
              ClearHire
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-400">
              Hiring, clarified.
            </p>

          </div>


          <div className="flex items-center gap-6">

            <Link
              to="/jobs"
              className="text-xs text-zinc-500 transition hover:text-zinc-950"
            >
              Jobs
            </Link>

            <a
              href="#how-it-works"
              className="text-xs text-zinc-500 transition hover:text-zinc-950"
            >
              How it works
            </a>

            <a
              href="#transparency"
              className="text-xs text-zinc-500 transition hover:text-zinc-950"
            >
              Transparency
            </a>

          </div>


          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} ClearHire
          </p>

        </div>

      </footer>

    </div>
  );
}


export default LandingPage;