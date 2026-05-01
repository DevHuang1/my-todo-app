"use client";
import { createClient } from "@/utils/supabase/server";
import FriendsPage from "@/app/components/friendCom";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Friend() {
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

  return <FriendsPage profile={profile} />;
}
