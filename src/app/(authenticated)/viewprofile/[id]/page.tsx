// app/profile/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import UnfriendButton from "@/app/components/unfriendBtn";

export default async function ViewProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!profile || !user) notFound();

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Link
          href="/friends"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors group"
        >
          <ChevronLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Friends</span>
        </Link>

        {/* Profile Card */}
        <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <img
                src={
                  profile.avatar_url ||
                  `https://ui-avatars.com/api/?name=${profile.full_name}`
                }
                className="size-32 rounded-full border-4 border-indigo-500/20 object-cover shadow-[0_0_40px_rgba(79,70,229,0.15)]"
                alt={profile.full_name}
              />
              <div className="absolute bottom-1 right-1 size-6 rounded-full border-4 border-[#09090b] bg-emerald-500"></div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-indigo-400 font-medium text-sm">
                @{profile.username}
              </p>
              <p className="mt-4 text-zinc-400 text-sm max-w-sm leading-relaxed">
                {profile.bio || "This user hasn't added a bio yet."}
              </p>
              <UnfriendButton
                friendId={profile.id}
                friendName={profile.full_name || profile.username}
                myId={user.id}
              />
            </div>

            {/* Stats / Info Grid */}
            <div className="grid w-full grid-cols-2 gap-4 border-t border-white/5 pt-8 mt-2">
              <div className="rounded-2xl bg-white/[0.03] p-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  Status
                </p>
                <p className="mt-1 font-semibold text-zinc-200 italic">
                  Connected
                </p>
              </div>
              <div className="rounded-2xl bg-white/[0.03] p-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  Joined
                </p>
                <p className="mt-1 font-semibold text-zinc-200">
                  {new Date(profile.created_at).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
