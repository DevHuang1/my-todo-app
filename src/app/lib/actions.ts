"use server";
type AuthResponse =
  | { success: true; email: string; error?: never }
  | { error: string; success?: never; email?: never };
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData): Promise<AuthResponse> {
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
    console.error("Signup Error Log:", error.message);
  }

  return { success: true, email: email as string };
}

export async function loginUser(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { email, password } = Object.fromEntries(formData) as Record<
    string,
    string
  >;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) redirect("/login?error=invalid-credentials");

  const fullName = data.user?.user_metadata?.full_name;

  if (fullName) {
    redirect("/dashboard");
  } else {
    redirect("/profileInfo");
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  }
  redirect("/login");
}
