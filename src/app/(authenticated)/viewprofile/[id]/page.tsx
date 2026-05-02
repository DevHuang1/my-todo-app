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

  // Fallback for dates
  const joinYear = profile.created_at
    ? new Date(profile.created_at).getFullYear()
    : "2026";

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Link
          href="/friends"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors group"
        >
          <ChevronLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Friends</span>
        </Link>

        {/* Profile Card Container */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
          {/* 1. Cover Image Section */}
          <div
            className="h-40 w-full bg-zinc-800 bg-cover bg-center relative"
            style={{
              backgroundImage: profile.cover_url
                ? `url('${profile.cover_url}')`
                : `linear-gradient(to bottom right, #4f46e5, #7c3aed)`, // Default gradient if no cover
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* 2. Profile Content Section */}
          <div className="px-8 pb-8">
            <div className="relative flex flex-col items-center">
              {/* Avatar - Overlapping the cover */}
              <div className="relative -mt-16 mb-4">
                <img
                  src={
                    profile.avatar_url ||
                    `https://ui-avatars.com/api/?name=${profile.full_name}`
                  }
                  className="size-32 rounded-2xl border-4 border-[#09090b] object-cover shadow-2xl"
                  alt={profile.full_name}
                />
                <div className="absolute bottom-2 right-2 size-5 rounded-full border-4 border-[#09090b] bg-emerald-500 shadow-lg"></div>
              </div>

              {/* Text Content */}
              <div className="text-center w-full">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-indigo-400 font-medium text-sm">
                  @{profile.username}
                </p>

                <p className="mt-4 mx-auto text-zinc-400 text-sm max-w-sm leading-relaxed">
                  {profile.about || "No bio available."}
                </p>

                {/* 3. Unfriend Button - Centered and Aligned */}
                <div className="mt-6 flex justify-center">
                  <UnfriendButton
                    friendId={profile.id}
                    friendName={profile.full_name || profile.username}
                    myId={user?.id || ""}
                  />
                </div>
              </div>

              {/* Stats / Info Grid */}
              <div className="grid w-full grid-cols-2 gap-4 border-t border-white/5 pt-8 mt-8">
                <div className="rounded-2xl bg-white/[0.03] p-4 text-center border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    Status
                  </p>
                  <p className="mt-1 font-semibold text-emerald-400 italic">
                    Connected
                  </p>
                </div>
                <div className="rounded-2xl bg-white/[0.03] p-4 text-center border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    Joined
                  </p>
                  <p className="mt-1 font-semibold text-zinc-200">{joinYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
