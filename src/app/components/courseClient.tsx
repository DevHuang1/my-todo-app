"use client";
import { useState } from "react";
import {
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import LoadingOverlay from "./loadingOverlay";

type Lesson = {
  id: string;
  title: string;
  video_url: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
};
export default function CourseClientPage({ course }: { course: any }) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    course.lessons[0],
  );
  const [isEnrolled, setIsEnrolled] = useState(course.is_enrolled);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from("courses")
      .update({ is_enrolled: true })
      .eq("id", course.id);
    setIsEnrolled(true);
    router.refresh();
  };
  const handleComplete = async () => {
    if (!activeLesson || activeLesson.is_completed) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error: lessonError } = await supabase
        .from("lessons")
        .update({ is_completed: true })
        .eq("id", activeLesson.id);

      if (lessonError) throw lessonError;

      const { error: courseError } = await supabase
        .from("courses")
        .update({
          completed_lessons: (course.completed_lessons || 0) + 1,
          last_accessed: new Date().toISOString(),
        })
        .eq("id", course.id);

      if (courseError) throw courseError;

      setActiveLesson((prev) => {
        if (!prev) return null;
        return { ...prev, is_completed: true };
      });

      router.refresh();
    } catch (error) {
      console.error("Error completing lesson:", error);
      alert("Failed to save progress. Please try again.");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="min-h-screen bg-[#09090b] text-white">
        {/* Top Navigation */}
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link
              href="/courses"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
            >
              <ArrowLeftIcon className="size-4 shrink-0" />
              <span className="hidden sm:inline">Back to Catalog</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden md:inline text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                {course.category}
              </span>
              <div className="hidden md:block size-1 rounded-full bg-zinc-700 shrink-0" />
              <span className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-none">
                {course.title}
              </span>
            </div>
          </div>
        </nav>

        <main className="max-w-screen-2xl mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {!isEnrolled ? (
                // PREVIEW MODE
                <div className="aspect-video w-full rounded-3xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center p-8 text-center space-y-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundColor: course.accent_color }}
                  />
                  <div className="relative z-10 space-y-4">
                    <h2 className="text-3xl font-bold">
                      Ready to start learning?
                    </h2>
                    <p className="text-zinc-400 max-w-md mx-auto">
                      Get access to all {course.total_lessons} lessons, source
                      code, and community support.
                    </p>
                    <button
                      onClick={handleEnroll}
                      className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl hover:scale-105 transition-transform"
                      style={{ backgroundColor: course.accent_color }}
                    >
                      Enroll in Course
                    </button>
                  </div>
                </div>
              ) : (
                // CLASSROOM MODE
                <div className="space-y-6">
                  <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5">
                    <iframe
                      src={activeLesson?.video_url}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-xl md:text-2xl font-bold truncate">
                      {activeLesson?.title}
                    </h1>
                    <button
                      onClick={handleComplete}
                      disabled={activeLesson?.is_completed}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all w-full sm:w-auto text-xs font-bold ${
                        activeLesson?.is_completed
                          ? "bg-emerald-500 text-white border-emerald-500" // "Marked" state
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" // Default state
                      }`}
                    >
                      <CheckCircleIcon className="size-4" />
                      {activeLesson?.is_completed
                        ? "Marked"
                        : "Mark as Complete"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Lesson Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">
                  Course Content
                </h2>

                <div className="space-y-3">
                  {course.lessons.map((lesson: any, index: number) => (
                    <button
                      key={lesson.id}
                      disabled={!isEnrolled}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all border ${
                        activeLesson?.id === lesson.id
                          ? "bg-white/5 border-white/10"
                          : "border-transparent hover:bg-white/[0.02]"
                      } ${!isEnrolled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-zinc-600 w-4">
                          {index + 1}
                        </span>
                        <div className="text-left">
                          <p
                            className={`text-sm font-semibold ${activeLesson?.id === lesson.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}
                          >
                            {lesson.title}
                          </p>
                        </div>
                      </div>
                      {isEnrolled ? (
                        lesson.is_completed ? (
                          <CheckCircleIcon className="size-5 text-emerald-500" />
                        ) : (
                          <PlayIcon
                            className={`size-5 ${activeLesson?.id === lesson.id ? "text-white" : "text-zinc-700"}`}
                          />
                        )
                      ) : (
                        <LockClosedIcon className="size-4 text-zinc-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
