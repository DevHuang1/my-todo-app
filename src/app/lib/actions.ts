"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { name, email, password } = Object.fromEntries(formData) as Record<
    string,
    string
  >;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });
  if (error) {
    // 3. This will show up in your Vercel "Logs" tab
    console.error("Signup Error Log:", error.message);

    // Pass the real error to the URL to see it in your browser
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/login?message=check-email-to-confirm");
}

export async function loginUser(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { email, password } = Object.fromEntries(formData) as Record<
    string,
    string
  >;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) redirect("/login?error=invalid-credentials");
  redirect("/profileInfo");
}
