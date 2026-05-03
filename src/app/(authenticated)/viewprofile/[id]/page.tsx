import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import UnfriendButton from "@/app/components/unfriendBtn";

export default async function ViewProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !profile) {
    return notFound();
  }
  const { data: userCourses } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", id)
    .order("last_accessed", { ascending: false });

  const { data: targetFriends } = await supabase
    .from("friends")
    .select(
      "friend_id, profiles:friend_id(id, full_name, avatar_url, username)",
    )
    .eq("user_id", id)
    .eq("status", "accepted");

  const { data: myFriends } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("user_id", user?.id)
    .eq("status", "accepted");

  const myFriendIds = new Set(myFriends?.map((f) => f.friend_id));
  const mutualFriends =
    targetFriends?.filter((f) => myFriendIds.has(f.friend_id)) || [];

  const joinYear = profile.created_at
    ? new Date(profile.created_at).getFullYear()
    : "2026";

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-12">
      <div className="mx-auto max-w-4xl">
        {/* Back Header */}
        <Link
          href="/friends"
          className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-all group w-fit"
        >
          <ChevronLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-tight">NETWORK</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900/40 backdrop-blur-md">
              {/* Banner */}
              <div className="h-32 w-full bg-gradient-to-r from-indigo-600 to-violet-600 opacity-20" />

              <div className="px-8 pb-8">
                <div className="relative -mt-12 flex items-end gap-6">
                  <img
                    src={
                      profile.avatar_url ||
                      `https://ui-avatars.com/api/?name=${profile.full_name}`
                    }
                    className="size-28 rounded-3xl border-4 border-[#09090b] shadow-2xl object-cover"
                  />
                  <div className="pb-2">
                    <h1 className="text-2xl font-black tracking-tight">
                      {profile.full_name}
                    </h1>
                    <p className="text-indigo-400 text-sm font-medium">
                      @{profile.username}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-md">
                  {profile.about ||
                    "This learner is currently focused on mastering new skills."}
                </p>

                {/* 3. Action Buttons - Fixed Alignment */}
                <div className="mt-8 flex flex-row items-stretch gap-3">
                  <div className="flex-1 sm:flex-none">
                    <UnfriendButton
                      friendId={profile.id}
                      friendName={profile.full_name}
                      myId={user?.id || ""}
                    />
                  </div>
                  <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center">
                    Message
                  </button>
                </div>
              </div>
            </div>

            {/* Learning Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userCourses?.slice(0, 4).map((course) => {
                const progress = Math.round(
                  (course.completed_lessons / course.total_lessons) * 100,
                );
                return (
                  <div
                    key={course.id}
                    className="group p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        {course.category.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-black text-zinc-500">
                        {progress}%
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-zinc-200 mb-4">
                      {course.title}
                    </h4>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: course.accent_color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Social Stats */}
          <div className="space-y-6">
            {/* Mutual Friends Card */}
            <div className="p-6 rounded-[2rem] border border-white/5 bg-zinc-900/40">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">
                Connections
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-zinc-400 mb-3">
                    Mutual Friends ({mutualFriends.length})
                  </p>
                  <div className="flex -space-x-3">
                    {mutualFriends.slice(0, 4).map((mf: any) => (
                      <img
                        key={mf.friend_id}
                        src={mf.profiles.avatar_url}
                        className="size-8 rounded-full border-2 border-[#09090b]"
                        title={mf.profiles.full_name}
                      />
                    ))}
                    {mutualFriends.length > 4 && (
                      <div className="size-8 rounded-full bg-zinc-800 border-2 border-[#09090b] flex items-center justify-center text-[10px] font-bold">
                        +{mutualFriends.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-zinc-400 mb-3">
                    All Friends
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {targetFriends?.slice(0, 8).map((f: any) => (
                      <Link
                        key={f.profiles.id}
                        href={`/viewprofile/${f.profiles.id}`}
                      >
                        <img
                          src={f.profiles.avatar_url}
                          className="size-10 rounded-xl bg-zinc-800 hover:scale-105 transition-transform"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="p-6 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/[0.02]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50 mb-1">
                Learning Status
              </p>
              <p className="text-emerald-400 font-bold italic text-sm">
                Active Now
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
