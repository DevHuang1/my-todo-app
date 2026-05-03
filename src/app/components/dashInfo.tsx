"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "./loadingOverlay";
import Link from "next/link";
export default function Dashboard({
  profile,
  tasks: initialTasks,
  courses,
}: {
  profile: any;
  tasks: any[];
  courses: any[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isOpen, setIsOpen] = useState(false);
  const [dueLabel, setDueLabel] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const handleAddTask = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: profile.id,
          title: title,
          due_date: dueLabel,
          is_completed: false,
        },
      ])
      .select()
      .single();
    setIsLoading(false);
    if (!error && data) {
      setTasks([data, ...tasks]);
      setIsOpen(false);
      router.refresh();
      setTitle("");
      setDueLabel("");
    } else {
      console.error("Supabase error", error);
    }
  };
  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setIsLoading(true);
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, is_completed: newStatus } : t)),
    );

    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: newStatus })
      .eq("id", id);
    setIsLoading(false);
    if (error) {
      console.error("Error toggling task", error);
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, is_completed: currentStatus } : t,
        ),
      );
    }
  };
  const deleteTask = async (id: string) => {
    setIsLoading(true);
    setTasks(tasks.filter((t) => t.id !== id));

    const { error } = await supabase.from("tasks").delete().eq("id", id);
    setIsLoading(false);
    if (error) {
      console.error("Error deleting task", error);
      router.refresh();
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="min-h-screen bg-[#09090b] text-zinc-400">
        {/* Header Section */}
        <header className="border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-500">
                Welcome back {profile?.full_name || "User"}. Here is what's on
                your plate today.
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
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  + New Task
                </button>
              </div>
              {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                  />

                  {/* Modal Content */}
                  <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Create New Task
                      </h3>

                      <form onSubmit={handleAddTask} className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Task Title
                          </label>
                          <input
                            autoFocus
                            required
                            className="mt-1 w-full rounded-lg border border-white/5 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                            placeholder="e.g. Finish Supabase Policies"
                            value={title}
                            name="taskTitle"
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Due Date / Label
                          </label>
                          <div className="relative mt-1">
                            <select
                              required
                              value={dueLabel}
                              name="taskDue"
                              onChange={(e) => setDueLabel(e.target.value)}
                              className="w-full appearance-none rounded-lg border border-white/5 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50 cursor-pointer"
                            >
                              <option value="" disabled className="bg-zinc-900">
                                Select timing...
                              </option>
                              <option
                                value="Urgent"
                                className="bg-zinc-900 text-rose-400"
                              >
                                Urgent
                              </option>
                              <option
                                value="Due in 2 hours"
                                className="bg-zinc-900"
                              >
                                Due in 2 hours
                              </option>
                              <option value="Today" className="bg-zinc-900">
                                Today
                              </option>
                              <option value="This Week" className="bg-zinc-900">
                                This Week
                              </option>
                            </select>

                            {/* Custom Chevron Arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                              <svg
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 rounded-lg border border-white/5 bg-zinc-800 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
                          >
                            Create Task
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-1">
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {tasks &&
                    tasks.filter((t) => !t.is_completed).length > 0 ? (
                      tasks
                        .filter((task) => !task.is_completed)
                        .map((task) => (
                          <motion.div
                            key={task.id}
                            layout // This makes the other tasks "snap" upward smoothly
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              scale: 0.95,
                              filter: "blur(4px)",
                            }}
                            transition={{ duration: 0.2 }}
                            className="group border-b border-white/5 last:border-0"
                          >
                            <div
                              onClick={() =>
                                handleToggleTask(task.id, task.is_completed)
                              }
                              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                            >
                              {/* Custom Checkbox UI */}
                              <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-zinc-900 group-hover:border-indigo-500/50">
                                <div className="size-2 rounded-full bg-transparent" />
                              </div>

                              {/* Task Content */}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-zinc-200">
                                  {task.title}
                                </p>
                                {task.due_date && (
                                  <p className="text-xs text-zinc-500">
                                    {task.due_date}
                                  </p>
                                )}
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTask(task.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-rose-500 transition-all"
                              >
                                <svg
                                  className="size-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 text-center text-sm text-zinc-600"
                      >
                        All caught up! Take a breather.
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                {courses && courses.filter((c) => c.is_enrolled).length > 0 ? (
                  courses
                    .filter((course) => course.is_enrolled)
                    .map((course) => {
                      const progress =
                        course.total_lessons > 0
                          ? Math.round(
                              (course.completed_lessons /
                                course.total_lessons) *
                                100,
                            )
                          : 0;

                      return (
                        <Link
                          key={course.id}
                          href={`/eachcourse/${course.id}`}
                          className="group relative block overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-5 transition-all hover:border-white/10 hover:bg-zinc-900/80"
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-bold text-white truncate">
                                    {course.title}
                                  </h3>
                                  {course.is_premium && (
                                    <span className="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-500">
                                      Pro
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                  {course.completed_lessons} of{" "}
                                  {course.total_lessons} lessons completed
                                </p>
                              </div>
                              <div
                                className="rounded-lg px-2 py-1 text-[10px] font-bold"
                                style={{
                                  backgroundColor: `${course.accent_color}1A`,
                                  color: course.accent_color,
                                }}
                              >
                                {progress}%
                              </div>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="h-1.5 w-full rounded-full bg-zinc-800">
                              <div
                                className="h-1.5 rounded-full transition-all duration-700 ease-in-out"
                                style={{
                                  width: `${progress}%`,
                                  backgroundColor: course.accent_color,
                                  boxShadow: `0 0 10px ${course.accent_color}4D`,
                                }}
                              />
                            </div>
                          </div>
                        </Link>
                      );
                    })
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/5 p-8 text-center">
                    <p className="text-sm text-zinc-600">
                      No courses in progress.
                    </p>
                    <Link
                      href="/courses"
                      className="mt-2 inline-block text-xs font-bold text-emerald-500 hover:underline"
                    >
                      Browse Catalog →
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
