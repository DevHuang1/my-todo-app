"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const CATEGORIES = ["All", "Web Tech", "Database", "Grade 12", "Embedded"];

export default function CoursesPage({ courses }: { courses: any[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black p-6 lg:p-12">
      <header className="max-w-7xl mx-auto mb-12 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Explore Courses
          </h1>
          <p className="text-zinc-400 mt-2">Pick a path and start building.</p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-6">
          <div className="relative max-w-2xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Grid Rendering */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map((course) => (
            <Link
              key={course.id}
              href={`/eachcourse/${course.id}`}
              className="group relative flex flex-col bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all hover:-translate-y-1"
            >
              <div
                className="h-24 w-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: course.accent_color }}
              />

              <div className="p-6 -mt-10 flex-1 flex flex-col">
                <div
                  className="size-10 rounded-xl mb-4 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: course.accent_color }}
                >
                  {course.title.charAt(0)}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {course.title}
                  </h3>
                  {course.is_premium && (
                    <span className="bg-amber-500/10 text-amber-500 text-[9px] px-1.5 py-0.5 rounded border border-amber-500/20 font-black">
                      PRO
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest font-medium">
                  {course.category} • {course.total_lessons} Lessons
                </p>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-300">
                    {course.is_premium ? "Premium Access" : "Free Course"}
                  </span>
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <span className="text-white text-lg">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
