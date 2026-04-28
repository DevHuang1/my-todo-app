import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/components/profileform";

export default async function Profile() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
    .single();
  if (profile?.username) {
    redirect("/dashboard");
  }
  return <ProfileForm initialProfile={profile} />;
}
