"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FriendsPage({ profile }: { profile: any }) {
  const supabase = createClient();
  const [friends, setFriends] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!profile?.id) return;

      const { data, error } = await supabase
        .from("friends")
        .select(
          `
    id,
    status,
    user_id,
    friend_id,
    sender:profiles!user_id (id, full_name, avatar_url),
    receiver:profiles!friend_id (id, full_name, avatar_url)
  `,
        )
        .or(`user_id.eq.${profile.id},friend_id.eq.${profile.id}`)
        .eq("status", "accepted");
      if (!error && data) {
        const friendProfiles = data.map((relation: any) => {
          return relation.user_id === profile.id
            ? relation.receiver
            : relation.sender;
        });

        setFriends(friendProfiles);
      } else if (error) {
        console.error("Error fetching friends:", error.message);
      }
    };

    fetchFriends();
  }, [profile?.id]);

  const handleSearch = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .ilike("full_name", `%${searchQuery}%`)
      .not("id", "eq", profile.id)
      .limit(5);

    if (!error) setSearchResults(data || []);
  };
  const addFriend = async (targetId: string) => {
    const { error } = await supabase.from("friends").insert([
      {
        user_id: profile.id,
        friend_id: targetId,
        status: "pending",
      },
    ]);
    if (error) {
      if (error.code === "23505") {
        // Postgres code for Unique Violation
        alert("You have already sent a request to this person!");
      } else {
        console.error("Error sending request", error);
      }
    } else {
      alert("Friend request successful!");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400">
      <header className="border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Social Circle
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your connections and find collaborators.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Current Friends */}
          <section className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
              Your Friends
            </h2>

            <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-1">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="group flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-all"
                  >
                    <div className="size-10 rounded-full bg-zinc-800 border border-white/5 overflow-hidden">
                      <img
                        src={
                          friend.avatar_url ||
                          `https://ui-avatars.com/api/?name=${friend.full_name}&background=random`
                        }
                        alt="avatar"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-200">
                        {friend.full_name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-tight font-medium">
                          Online
                        </span>
                      </div>
                    </div>

                    <button className="opacity-0 group-hover:opacity-100 text-xs text-zinc-500 hover:text-white transition-all">
                      View Profile
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-zinc-600">
                  No friends found yet. Use the search to find people!
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: Search and Add */}
          <section className="lg:col-span-5 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Find People
            </h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                className="w-full rounded-xl border border-white/5 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 rounded-lg bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                Search
              </button>
            </form>

            {/* Search Results */}
            <div className="space-y-3">
              <AnimatePresence>
                {searchResults.map((user) => (
                  <motion.div
                    key={user.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-4 hover:bg-white/[0.05] transition-all"
                  >
                    {/* Profile Avatar */}
                    <div className="relative size-12 shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          className="size-12 rounded-full object-cover border border-white/10"
                          alt={user.full_name}
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-white/10 text-indigo-400 font-bold">
                          {user.full_name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 bg-emerald-500" />
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-sm font-bold text-white">
                        {user.full_name}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate">
                        Software Engineer
                      </p>
                    </div>

                    <button
                      onClick={() => addFriend(user.id)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all active:scale-95"
                    >
                      Add
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
