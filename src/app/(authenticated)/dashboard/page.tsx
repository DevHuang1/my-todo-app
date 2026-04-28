import { createClient } from "@/utils/supabase/server";

import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-zinc-400">
        {/* Header Section */}
        <header className="border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-500">
                Welcome back. Here is what's on your plate today.
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* LEFT COLUMN: Todos (Takes up 7/12 of space) */}
            <section className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                  Active Tasks
                </h2>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  + New Task
                </button>
              </div>

              <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-1">
                {/* Example Task Item */}
                <div className="flex items-center gap-4 rounded-xl p-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-zinc-900 group-hover:border-indigo-500/50">
                    <div className="size-2 rounded-full bg-transparent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-200">
                      Finish Supabase Storage Policies
                    </p>
                    <p className="text-xs text-zinc-500">Due in 2 hours</p>
                  </div>
                </div>

                {/* Add more task items here */}
                <div className="h-px bg-white/5 mx-4" />

                <div className="flex items-center gap-4 rounded-xl p-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-zinc-900">
                    <div className="size-2 rounded-full bg-transparent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-200">
                      Refactor Navbar Component
                    </p>
                    <p className="text-xs text-zinc-500">
                      Scheduled for tomorrow
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN: Courses (Takes up 5/12 of space) */}
            <section className="lg:col-span-5 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                Currently Learning
              </h2>

              <div className="space-y-4">
                {/* Course Card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-5 group transition-all hover:border-white/10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Advanced Next.js Patterns
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          12 of 20 lessons completed
                        </p>
                      </div>
                      <div className="rounded-lg bg-indigo-500/10 px-2 py-1 text-[10px] font-bold text-indigo-400">
                        60%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-zinc-800">
                      <div className="h-1.5 w-[60%] rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
                    </div>
                  </div>
                </div>

                {/* Another Course Card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-5 group transition-all hover:border-white/10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Embedded Systems with C++
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          2 of 15 lessons completed
                        </p>
                      </div>
                      <div className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
                        15%
                      </div>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-zinc-800">
                      <div className="h-1.5 w-[15%] rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
