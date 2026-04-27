"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const profileData = {
    id: user.id,
    username: formData.get("username"),
    full_name: `${firstName} ${lastName}`.trim(),
    about: formData.get("about"),
    country: formData.get("country"),
    street_address: formData.get("street-address"),
    city: formData.get("city"),
    state_region: formData.get("region"),
    postal_code: formData.get("postal-code"),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("profiles").upsert(profileData);
  if (error) throw error;
  revalidatePath("/profile");
}
