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

export default function NavbarClient({ user, displayName, userImage }: any) {
  return (
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
                <div className="hidden md:block">
                  <div className="flex items-center gap-1">
                    <Link
                      href="/dashboard"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                      Courses
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="hidden md:flex items-center gap-4">
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
                        src={userImage}
                        className="size-8 rounded-full object-cover"
                        alt=""
                      />
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-2xl outline-none">
                      <MenuItem>
                        <Link
                          href="/profile"
                          className="flex w-full px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white rounded-lg"
                        >
                          Your Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => signOut()}
                          className="flex w-full px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white rounded-lg text-left"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
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

          <DisclosurePanel className="md:hidden border-t border-white/5 bg-zinc-900/90 backdrop-blur-md">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/dashboard"
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                Dashboard
              </Link>
            </div>
            <div className="border-t border-white/5 pb-3 pt-4 px-5">
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={userImage}
                  alt=""
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {displayName}
                  </div>
                  <div className="text-sm font-medium text-zinc-500">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
