// components/Navbar.tsx
import { createClient } from "@/utils/supabase/server";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { cookies } from "next/headers";
import Link from "next/link";

export default async function Navbar() {
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

  const displayName = profile?.username || "User";
  const userImage =
    profile?.avatar_url || "https://www.gravatar.com/avatar/?d=mp";

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-b border-white/5 bg-zinc-900/60 backdrop-blur-xl text-white"
    >
      {/* ... Paste the EXACT Disclosure content from the previous design here ... */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              <span className="text-xl font-bold">Y</span>
            </Link>
            <div className="hidden md:block">
              <div className="flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Dashboard
                </Link>
                {/* Add other links here */}
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                  Welcome back
                </span>
                <span className="text-sm font-semibold text-zinc-200">
                  {displayName}
                </span>
              </div>
              <Menu as="div" className="relative">
                <MenuButton className="group flex rounded-full bg-zinc-800 p-0.5 transition-all hover:ring-2 hover:ring-indigo-500/50">
                  <img
                    alt=""
                    src={userImage}
                    className="size-8 rounded-full object-cover"
                  />
                </MenuButton>
                <MenuItems className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-2xl outline-none focus:outline-none">
                  <MenuItem>
                    <Link
                      href="/profile"
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href="/auth/signout"
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                      Sign out
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
