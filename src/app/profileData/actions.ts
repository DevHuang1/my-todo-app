"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function uploadImage(
  supabase: any,
  file: any,
  bucket: string,
  userId: string,
) {
  if (!file || !(file instanceof File) || file.size === 0) {
    return null;
  }
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true,
    });

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
  const avatar_url = formData.get("avatar-url");
  const cover_url = formData.get("cover-url");

  const currentAvatarUrl = formData.get("current-avatar-url") as string;
  const currentCoverUrl = formData.get("current-cover-url") as string;

  const username = formData.get("username") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const about = formData.get("about") as string;
  const streetAddress = formData.get("street-address") as string;
  const city = formData.get("city") as string;
  const region = formData.get("region") as string;
  const postalCode = formData.get("postal-code") as string;
  const country = formData.get("country") as string;

  const profileData: any = {
    id: user.id,
    updated_at: new Date().toISOString(),
    username: username?.trim() || null,
    avatar_url: avatar_url || currentAvatarUrl || null,
    cover_url: cover_url || currentCoverUrl || null,
  };

  if (username?.trim()) {
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser && existingUser.id !== user.id) {
      throw new Error("This username is already taken. Please choose another.");
    }
  }

  if (firstName?.trim() || lastName?.trim()) {
    profileData.full_name = `${firstName || ""} ${lastName || ""}`.trim();
  }

  if (about?.trim()) profileData.about = about;
  if (streetAddress?.trim()) profileData.street_address = streetAddress;
  if (city?.trim()) profileData.city = city;
  if (region?.trim()) profileData.state_region = region;
  if (postalCode?.trim()) profileData.postal_code = postalCode;
  if (country?.trim()) profileData.country = country;

  const { error } = await supabase.from("profiles").upsert(profileData, {
    onConflict: "id",
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Username already exists.");
    }
    throw error;
  }
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function editProfile(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Files
  const avatarFile = formData.get("avatar-url") as File;
  const coverFile = formData.get("cover-url") as File;

  // Hidden inputs
  const currentAvatar = formData.get("current-avatar-url") as string;
  const currentCover = formData.get("current-cover-url") as string;

  // Uploads
  const newAvatarUrl = await uploadImage(
    supabase,
    avatarFile,
    "avatars",
    user.id,
  );
  const newCoverUrl = await uploadImage(supabase, coverFile, "covers", user.id);

  const firstName = (formData.get("first-name") as string) || "";
  const lastName = (formData.get("last-name") as string) || "";

  const profileData: any = {
    username: (formData.get("username") as string)?.trim() || null,
    full_name: `${firstName} ${lastName}`.trim(),
    about: (formData.get("about") as string)?.trim() || null,
    street_address: (formData.get("street-address") as string)?.trim() || null,
    city: (formData.get("city") as string)?.trim() || null,
    state_region: (formData.get("region") as string)?.trim() || null,
    postal_code: (formData.get("postal-code") as string)?.trim() || null,
    updated_at: new Date().toISOString(),
    avatar_url: newAvatarUrl || currentAvatar || undefined,
    cover_url: newCoverUrl || currentCover || undefined,
  };
  Object.keys(profileData).forEach(
    (key) => profileData[key] === undefined && delete profileData[key],
  );

  const { error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", user.id);

  if (error) {
    console.error("Database Update Error:", error.message);
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
