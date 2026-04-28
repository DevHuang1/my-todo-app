import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { editProfile } from "../profileData/actions";
import FormShell from "@/app/components/formshell";
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
    <main className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your public and private profile details.
        </p>
      </div>

      <form action={editProfile}>
        <FormShell
          title="Personal Identity"
          description="Update your username and public bio."
        >
          {/* Username */}
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium">Username</label>
            <div className="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                app.com/
              </span>
              <input
                type="text"
                name="username"
                defaultValue={profile?.username || ""}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm dark:text-white"
              />
            </div>
          </div>

          {/* About */}
          <div className="col-span-full">
            <label className="block text-sm font-medium">About</label>
            <textarea
              name="about"
              rows={4}
              defaultValue={profile?.about || ""}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-white/5 dark:text-white"
            />
          </div>
        </FormShell>

        <div className="mt-10">
          <FormShell
            title="Shipping & Contact"
            description="Your current address for physical orders."
          >
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">First name</label>
              <input
                type="text"
                name="first-name"
                defaultValue={firstName}
                className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 dark:bg-white/5"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">Last name</label>
              <input
                type="text"
                name="last-name"
                defaultValue={lastName}
                className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 dark:bg-white/5"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium">
                Street address
              </label>
              <input
                type="text"
                name="street-address"
                defaultValue={profile?.street_address || ""}
                className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 dark:bg-white/5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                defaultValue={profile?.city || ""}
                className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 dark:bg-white/5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">
                State / Province
              </label>
              <input
                type="text"
                name="region"
                defaultValue={profile?.state_region || ""}
                className="mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-gray-300 dark:bg-white/5"
              />
            </div>
          </FormShell>
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-6 dark:border-white/10">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            <Link
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Cancel
            </Link>
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}
