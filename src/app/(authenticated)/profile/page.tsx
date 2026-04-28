import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { editProfile } from "../../profileData/actions";
import Link from "next/link";

export default async function EditProfile() {
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

  const [firstName, ...lastNameParts] = (profile?.full_name || "").split(" ");
  const lastName = lastNameParts.join(" ");

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-200">
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 border-b border-white/5 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Profile Settings
          </h1>
          <p className="mt-2 text-zinc-400">
            Update your presence and personal information on the platform.
          </p>
        </div>

        <form action={editProfile} className="space-y-12">
          {/* Section 1: Visual Identity */}
          <section className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                Visual Identity
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Your profile's public appearance.
              </p>
            </div>

            <div className="md:col-span-2 space-y-8">
              {/* Note: You should wrap the avatar/cover inputs in a Client Component for previews */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-200">
                  Avatar & Cover Image
                </label>
                {/* Reference the Client Logic I gave you previously here */}
                <div className="relative h-40 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <input
                    type="file"
                    name="cover-url"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-4">
                    <div className="size-16 rounded-xl bg-zinc-800 border-2 border-zinc-900 overflow-hidden relative">
                      <img
                        src={profile?.avatar_url || "/default-avatar.png"}
                        className="object-cover size-full"
                        alt=""
                      />
                      <input
                        type="file"
                        name="avatar-url"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-zinc-300 font-medium bg-black/50 px-2 py-1 rounded-md backdrop-blur-md">
                      Click images to upload
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300">
                    Username
                  </label>
                  <div className="mt-2 flex rounded-lg bg-zinc-900 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    <span className="flex items-center pl-3 text-zinc-500 text-sm sm:text-base">
                      app.com/
                    </span>
                    <input
                      type="text"
                      name="username"
                      defaultValue={profile?.username || ""}
                      className="block flex-1 border-0 bg-transparent py-2.5 pl-1 text-white placeholder:text-zinc-600 focus:ring-0 sm:text-sm"
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
                    className="mt-2 block w-full rounded-lg border-0 bg-zinc-900 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Personal Details */}
          <section className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 pt-10 border-t border-white/5">
            <div>
              <h2 className="text-base font-semibold text-white">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Shipping and contact details.
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-zinc-300">
                  First name
                </label>
                <input
                  type="text"
                  name="first-name"
                  defaultValue={firstName}
                  className="mt-2 block w-full rounded-lg border-0 bg-zinc-900 py-2.5 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-zinc-300">
                  Last name
                </label>
                <input
                  type="text"
                  name="last-name"
                  defaultValue={lastName}
                  className="mt-2 block w-full rounded-lg border-0 bg-zinc-900 py-2.5 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-zinc-300">
                  Street address
                </label>
                <input
                  type="text"
                  name="street-address"
                  defaultValue={profile?.street_address || ""}
                  className="mt-2 block w-full rounded-lg border-0 bg-zinc-900 py-2.5 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-300">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={profile?.city || ""}
                  className="mt-2 block w-full rounded-lg border-0 bg-zinc-900 py-2.5 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Postal code
                </label>
                <input
                  type="text"
                  name="postal-code"
                  defaultValue={profile?.postal_code || ""}
                  className="mt-2 block w-full rounded-lg border-0 bg-zinc-900 py-2.5 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                />
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-x-4 pt-8 border-t border-white/5">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
