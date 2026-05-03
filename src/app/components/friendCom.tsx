"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "./loadingOverlay";
import Toast, { ToastType } from "../components/Toast";
import NavLoadingLink from "./NavLoadingLink";

export default function FriendsPage({ profile }: { profile: any }) {
  const supabase = createClient();
  const [friends, setFriends] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as ToastType,
    onConfirm: undefined as (() => void) | undefined,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isVisible: true, message, type, onConfirm: undefined });
    if (type !== "confirm") {
      setTimeout(
        () => setToast((prev) => ({ ...prev, isVisible: false })),
        4000,
      );
    }
  };
  const handleUnfriendClick = (friendId: string, friendName: string) => {
    setToast({
      isVisible: true,
      type: "confirm",
      message: `Unfriend ${friendName}?`,
      onConfirm: () => executeUnfriend(friendId),
    });
  };

  const executeUnfriend = async (friendId: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(
        `and(user_id.eq.${profile.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${profile.id})`,
      );

    if (!error) {
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      showToast("Friend removed", "success");
    } else {
      showToast("Failed to remove friend", "error");
    }
    setIsLoading(false);
  };
  const fetchData = async () => {
    if (!profile?.id) return;
    setIsLoading(true);

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
      .or(`user_id.eq.${profile.id},friend_id.eq.${profile.id}`);

    setIsLoading(false);

    if (!error && data) {
      const accepted = data
        .filter((rel) => rel.status === "accepted")
        .map((rel) => (rel.user_id === profile.id ? rel.receiver : rel.sender));
      setFriends(accepted);

      const pending = data.filter(
        (rel) => rel.status === "pending" && rel.friend_id === profile.id,
      );
      setPendingRequests(pending);
    }
  };

  useEffect(() => {
    fetchData();
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
  const handleRequest = async (requestId: string, accept: boolean) => {
    setIsLoading(true);
    if (accept) {
      await supabase
        .from("friends")
        .update({ status: "accepted" })
        .eq("id", requestId);
    } else {
      await supabase.from("friends").delete().eq("id", requestId);
    }
    await fetchData(); // Refresh lists
    setIsLoading(false);
  };
  const addFriend = async (targetId: string) => {
    const { data: existing } = await supabase
      .from("friends")
      .select("status")
      .or(
        `and(user_id.eq.${profile.id},friend_id.eq.${targetId}),and(user_id.eq.${targetId},friend_id.eq.${profile.id})`,
      )
      .single();

    if (existing) {
      const message =
        existing.status === "accepted"
          ? "You are already friends!"
          : "A friend request is already pending.";
      showToast(message, "info");
      return;
    }
    const { error } = await supabase
      .from("friends")
      .insert([
        { user_id: profile.id, friend_id: targetId, status: "pending" },
      ]);

    if (error) {
      if (error.code === "23505") {
        showToast("Request already sent!", "info");
      } else {
        showToast("Failed to send request. Try again.", "error");
        console.error("Add Friend Error:", error.message);
      }
    } else {
      showToast("Friend request sent successfully!", "success");
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <Toast
        {...toast}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
      <div className="min-h-screen bg-[#09090b] text-zinc-400 pb-20">
        <header className="border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Social Circle
            </h1>
            <p className="text-sm text-zinc-500">
              Manage connections and collaborators.
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* LEFT COLUMN: Friends & Requests */}
            <section className="lg:col-span-7 space-y-10">
              {/* 1. FRIEND REQUESTS SECTION */}
              {pendingRequests.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                    Friend Requests ({pendingRequests.length})
                  </h2>
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-1">
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="flex items-center gap-4 p-4">
                        <img
                          src={
                            req.sender.avatar_url ||
                            `https://ui-avatars.com/api/?name=${req.sender.full_name}`
                          }
                          className="size-10 rounded-full border border-white/10"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">
                            {req.sender.full_name}
                          </p>
                          <p className="text-[10px] text-amber-500/70 uppercase font-bold tracking-widest">
                            Wants to connect
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequest(req.id, true)}
                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequest(req.id, false)}
                            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:bg-zinc-700"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. FRIENDS LIST */}
              <div className="space-y-4">
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
                        <img
                          src={
                            friend.avatar_url ||
                            `https://ui-avatars.com/api/?name=${friend.full_name}`
                          }
                          className="size-10 rounded-full bg-zinc-800 border border-white/5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-200 truncate">
                            {friend.full_name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] text-zinc-500 uppercase font-medium">
                              Online
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                          <NavLoadingLink
                            href={`/viewprofile/${friend.id}`}
                            className="text-[11px] font-bold text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap"
                          >
                            View Profile
                          </NavLoadingLink>

                          <button
                            onClick={() =>
                              handleUnfriendClick(friend.id, friend.full_name)
                            }
                            className="text-[11px] font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors shrink-0 whitespace-nowrap"
                          >
                            Unfriend
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-zinc-600">
                      No friends found yet.
                    </div>
                  )}
                </div>
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
    </>
  );
}
