"use server";
import FormShell from "@/app/components/formshell";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { updateProfile } from "../profileData/actions";
import { revalidatePath } from "next/cache";

export default async function Profile() {
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
  const names = profile?.full_name?.split(" ") || ["", ""];
  const firstName = names[0];
  const lastName = names.slice(1).join(" ");
  return (
    <form action={updateProfile}>
      <FormShell
        title="Profile Information"
        description="This information is stored in your private profile table."
      >
        {/* Username */}
        <div className="sm:col-span-4">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Username
          </label>
          <input
            type="text"
            name="username"
            defaultValue={profile?.username || ""}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* About */}
        <div className="col-span-full">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            About
          </label>
          <textarea
            name="about"
            rows={3}
            defaultValue={profile?.about || ""}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* First Name */}
        <div className="sm:col-span-3">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            First name
          </label>
          <input
            type="text"
            name="first-name"
            defaultValue={firstName}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* Last Name */}
        <div className="sm:col-span-3">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Last name
          </label>
          <input
            type="text"
            name="last-name"
            defaultValue={lastName}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* Country */}
        <div className="sm:col-span-3">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Country
          </label>
          <select
            name="country"
            defaultValue={profile?.country || "United States"}
            className="mt-2 block w-full rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 dark:bg-white/5 dark:text-white dark:outline-white/10"
          >
            <option>United States</option>
            <option>Canada</option>
            <option>Mexico</option>
          </select>
        </div>

        {/* Street Address */}
        <div className="col-span-full">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Street address
          </label>
          <input
            type="text"
            name="street-address"
            defaultValue={profile?.street_address || ""}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* City */}
        <div className="sm:col-span-2">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            City
          </label>
          <input
            type="text"
            name="city"
            defaultValue={profile?.city || ""}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* State / Region */}
        <div className="sm:col-span-2">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            State / Province
          </label>
          <input
            type="text"
            name="region"
            defaultValue={profile?.state_region || ""}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* Postal Code */}
        <div className="sm:col-span-2">
          <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            ZIP / Postal code
          </label>
          <input
            type="text"
            name="postal-code"
            defaultValue={profile?.postal_code || ""}
            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 dark:bg-white/5 dark:text-white dark:outline-white/10"
          />
        </div>

        {/* Save Button */}
        <div className="col-span-full mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Save All Information
          </button>
          <button
            onClick={() => revalidatePath("/dashboard")}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Continue
          </button>
        </div>
      </FormShell>
    </form>
  );
}
