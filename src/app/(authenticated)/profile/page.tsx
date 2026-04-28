import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { editProfile } from "../../profileData/actions";
import Link from "next/link";
import VisualIdentity from "@/app/components/visualidentity";
import { redirect } from "next/navigation";

export default async function EditProfile() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const [firstName, ...lastNameParts] = (profile?.full_name || "").split(" ");
  const lastName = lastNameParts.join(" ");
  if (error) {
    console.error("Profile Fetch Error:", error.message);
  }
  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-200">
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <div className="mb-10 border-b border-white/5 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Profile Settings
          </h1>
        </div>

        <form action={editProfile} className="space-y-12">
          {/* Render the Client Component for Images/Username */}
          <VisualIdentity profile={profile} />

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
