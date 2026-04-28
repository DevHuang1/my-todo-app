"use client";

import { useState } from "react";

export default function VisualIdentity({ profile }: { profile: any }) {
  const [previews, setPreviews] = useState({
    avatar: profile?.avatar_url,
    cover: profile?.cover_url,
  });
  const handlePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };
  return (
    <section className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
      <input
        type="hidden"
        name="current-avatar-url"
        value={profile?.avatar_url || ""}
      />
      <input
        type="hidden"
        name="current-cover-url"
        value={profile?.cover_url || ""}
      />
      <div>
        <h2 className="text-base font-semibold text-white">Visual Identity</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Your profile's public appearance.
        </p>
      </div>

      <div className="md:col-span-2 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-200">
            Avatar & Cover Image
          </label>

          {/* Cover Image Box */}
          <div
            className="relative h-44 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden bg-cover bg-center group"
            style={{
              backgroundImage: previews.cover
                ? `url('${previews.cover}')`
                : "none",
            }}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <input
              type="file"
              name="cover-url"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              onChange={(e) => handlePreview(e, "cover")}
            />

            {/* Avatar Box */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 z-40">
              <div className="size-20 rounded-xl bg-zinc-800 border-2 border-[#09090b] overflow-hidden relative shadow-2xl">
                <img
                  src={previews.avatar || "/default-avatar.png"}
                  className="object-cover size-full"
                  alt="Avatar"
                />
                <input
                  type="file"
                  name="avatar-url"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handlePreview(e, "avatar")}
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Click to change
                </p>
                <p className="text-[10px] text-zinc-400">Avatar & Cover</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300">
              Username
            </label>
            <div className="mt-2 flex rounded-lg bg-zinc-900 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-indigo-500">
              <span className="flex items-center pl-3 text-zinc-500 text-sm">
                app.com/
              </span>
              <input
                type="text"
                name="username"
                defaultValue={profile?.username || ""}
                className="block flex-1 border-0 bg-transparent py-2.5 pl-1 text-white focus:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300">
              Bio
            </label>
            <textarea
              name="about"
              rows={4}
              defaultValue={profile?.about || ""}
              className="mt-2 block w-full rounded-lg border-0 bg-zinc-900 py-2.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
