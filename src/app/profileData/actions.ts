"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function uploadImage(
  supabase: any,
  file: File,
  bucket: string,
  userId: string,
) {
  if (!file || file.size === 0) return null;
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .form(bucket)
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError.message);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const avatarFile = formData.get("avatar-url") as File;
  const avatarUrl = await uploadImage(supabase, avatarFile, "avatars", user.id);

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const profileData: any = {
    id: user.id,
    username: formData.get("username"),
    full_name: `${firstName} ${lastName}`.trim(),
    about: formData.get("about"),
    country: formData.get("country"),
    street_address: formData.get("street-address"),
    city: formData.get("city"),
    state_region: formData.get("region"),
    language: formData.get("language") || "English",
    timezone: formData.get("timezone") || "UTC",
    postal_code: formData.get("postal-code"),
    updated_at: new Date().toISOString(),
  };
  if (avatarUrl) {
    profileData.avatarUrl = avatarUrl;
  }
  const { error } = await supabase.from("profiles").upsert(profileData);
  if (error) throw error;
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  redirect("/dashboard");
}
export async function editProfile(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const profileData = {
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

  const { error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", user.id);

  if (error) throw error;

  revalidatePath("/profile");
}
