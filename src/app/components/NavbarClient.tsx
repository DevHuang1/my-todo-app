"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { signOut } from "../lib/actions";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/outline";
import LoadingOverlay from "./loadingOverlay";
import NavLoadingLink from "./NavLoadingLink";
export default function NavbarClient({ user, displayName, userImage }: any) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const supabase = createClient();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const fetchRequests = async () => {
    if (!user?.id) return;
    setIsActionLoading(true);
    const { data, error } = await supabase.from("friends").select(`
      id,
      status,
      friend_id,
      user_id
    `);

    console.log("DATABASE CHECK: All rows in friends table:", data);
    console.log("DATABASE CHECK: My Current ID:", user.id);
    setIsActionLoading(false);
    if (data) {
      const filtered = data.filter(
        (row) => row.friend_id === user.id && row.status === "pending",
      );
      console.log("DATABASE CHECK: Rows that SHOULD match:", filtered);
      setNotifications(filtered);
    }
  };
  useEffect(() => {
    if (!user?.id) return;

    fetchRequests();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab focused: Refreshing notifications...");
        fetchRequests();
      }
    };

    const interval = setInterval(() => {
      fetchRequests();
    }, 60000);

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [user.id]);
  const handleRequest = async (requestId: string, accept: boolean) => {
    if (accept) {
      await supabase
        .from("friends")
        .update({ status: "accepted" })
        .eq("id", requestId);
    } else {
      await supabase.from("friends").delete().eq("id", requestId);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== requestId));
  };
  const NotificationMenu = ({
    align = "right",
  }: {
    align?: "left" | "right";
  }) => (
    <Menu as="div" className="relative">
      <MenuButton className="relative flex rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
        <BellIcon className="size-6" />
        {notifications.length > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-indigo-500"></span>
          </span>
        )}
      </MenuButton>
      <MenuItems
        className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-3 w-80 origin-top-right rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl outline-none backdrop-blur-xl z-[60]`}
      >
        <div className="px-3 py-2 border-b border-white/5 mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Notifications
        </div>
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-600">
            No new requests
          </div>
        ) : (
          notifications.map((noti) => (
            <MenuItem key={noti.id}>
              <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition-colors">
                <img
                  src={
                    noti.sender.avatar_url ||
                    `https://ui-avatars.com/api/?name=${noti.sender.full_name}`
                  }
                  className="size-10 rounded-full bg-zinc-800"
                  alt=""
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-white truncate">
                    {noti.sender.full_name}
                  </p>
                  <p className="text-[11px] text-zinc-500 text-left">
                    wants to connect
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleRequest(noti.id, true)}
                    className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                  >
                    <CheckIcon className="size-4" />
                  </button>
                  <button
                    onClick={() => handleRequest(noti.id, false)}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-500 hover:bg-rose-500/20 hover:text-rose-500"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
              </div>
            </MenuItem>
          ))
        )}
      </MenuItems>
    </Menu>
  );
  const handleSignOut = async () => {
    setIsActionLoading(true);
    try {
      await signOut();
    } catch (error) {
      setIsActionLoading(false);
      console.error(error);
    }
  };
  return (
    <>
      <LoadingOverlay isLoading={isActionLoading} />
      <Disclosure
        as="nav"
        className="sticky top-0 z-50 border-b border-white/5 bg-zinc-900/60 backdrop-blur-xl text-white"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link
                    href="/dashboard"
                    className="flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  >
                    <span className="text-lg font-bold tracking-tight">Y</span>
                  </Link>
                  {/* Desktop Nav */}
                  <div className="hidden md:block">
                    <div className="flex items-center gap-1">
                      <NavLoadingLink href="/dashboard">
                        Dashboard
                      </NavLoadingLink>
                      <NavLoadingLink href="/courses">Courses</NavLoadingLink>
                      <NavLoadingLink href="/friends">Friends</NavLoadingLink>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center gap-4">
                    <NotificationMenu />
                    <div className="flex flex-col items-end mr-2 text-right">
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
                          src={userImage}
                          className="size-8 rounded-full object-cover"
                          alt=""
                        />
                      </MenuButton>
                      <MenuItems className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-2xl outline-none">
                        <MenuItem>
                          <NavLoadingLink href="/profile">
                            Your Profile
                          </NavLoadingLink>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={handleSignOut}
                            className="flex w-full px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white rounded-lg text-left"
                          >
                            Sign out
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                  {/* Mobile Button */}
                  <div className="flex md:hidden">
                    <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-white/5 hover:text-white">
                      {open ? (
                        <XMarkIcon className="h-6 w-6" />
                      ) : (
                        <Bars3Icon className="h-6 w-6" />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE MENU */}
            <DisclosurePanel className="md:hidden border-t border-white/5 bg-zinc-900/90 backdrop-blur-md">
              <div className="space-y-1 px-2 pb-3 pt-2">
                <NavLoadingLink href="/dashboard">Dashboard</NavLoadingLink>
                <NavLoadingLink href="/courses">Courses</NavLoadingLink>
                <NavLoadingLink href="/friends">Friends</NavLoadingLink>
              </div>

              <div className="border-t border-white/5 pb-3 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={userImage}
                      alt=""
                    />
                    <div className="ml-3 text-left">
                      <div className="text-base font-medium text-white">
                        {displayName}
                      </div>
                      <div className="text-sm font-medium text-zinc-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  {/* Mobile Notification Bell */}
                  <NotificationMenu align="right" />
                </div>
                <div className="mt-3 space-y-1">
                  <NavLoadingLink href="/profile">Your Profile</NavLoadingLink>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-rose-400 hover:bg-white/5 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
}
